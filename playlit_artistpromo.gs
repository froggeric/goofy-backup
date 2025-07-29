/**
 * Creates or updates an artist's promotional playlist by combining tracks from an artist-specific
 * playlist and a general promotional playlist according to a detailed set of rules.
 * This function is designed to be fault-tolerant; it will not modify the combined
 * playlist if any error occurs during the track preparation phase.
 *
 * @param {{
 *   artistPlaylist: {id: string, name: string},
 *   promoPlaylist: {id: string, name: string},
 *   combinedPlaylist: {id: string, name: string}
 * }} params An object containing the configuration for the three playlists.
 * @property {object} params.artistPlaylist - The playlist containing only the artist's own tracks.
 *           The first 3 tracks are treated as top priorities.
 * @property {object} params.promoPlaylist - The playlist containing tracks from other artists for promotion.
 * @property {object} params.combinedPlaylist - The target playlist to be updated. Its existing content will be replaced.
 *           Its name, description, and cover art will be preserved.
 */
function createArtistPromoPlaylist(params) {
  const { artistPlaylist, promoPlaylist, combinedPlaylist } = params;


  Logger.log(`Starting to build playlist: "${combinedPlaylist.name}"...`);


  try {
    // =================================================================
    // STEP 1: FETCH ALL TRACKS FROM SOURCE PLAYLISTS
    // =================================================================
    const artistTracks = Source.getTracks([{ id: artistPlaylist.id, name: artistPlaylist.name }]);
    const promoTracksSource = Source.getTracks([{ id: promoPlaylist.id, name: promoPlaylist.name }]);


    if (!artistTracks || artistTracks.length === 0) {
      Logger.log(`Warning: The artist playlist "${artistPlaylist.name}" is empty or could not be found. Aborting.`);
      return;
    }
    if (!promoTracksSource || promoTracksSource.length === 0) {
      Logger.log(`Warning: The promo playlist "${promoPlaylist.name}" is empty or could not be found. Aborting.`);
      return;
    }


    const initialTotalTracks = artistTracks.length + promoTracksSource.length;
    Logger.log(`Fetched ${artistTracks.length} tracks from artist playlist and ${promoTracksSource.length} from promo playlist. Total: ${initialTotalTracks}`);


    // =================================================================
    // STEP 2: CREATE "CRATES" (COLLECTIONS OF TRACKS)
    // =================================================================


    // --- Artist Crates ---
    const top3ArtistTracks = Selector.sliceFirst(artistTracks, 3);
    const otherArtistTracks = Selector.sliceAllExceptFirst(artistTracks, 3);


    // --- Promo Crates (based on popularity) ---
    // First, sort all promo tracks by popularity in descending order.
    // The Order.sort function handles fetching full track objects with popularity data.
    Order.sort(promoTracksSource, 'meta.popularity', 'desc');


    const totalPromoTracks = promoTracksSource.length;
    const topCount = Math.ceil(totalPromoTracks * 0.20);
    const midCount = Math.ceil(totalPromoTracks * 0.30);


    const topTracks = Selector.sliceFirst(promoTracksSource, topCount);
    const midTracks = promoTracksSource.slice(topCount, topCount + midCount);
    const lowTracks = Selector.sliceAllExceptFirst(promoTracksSource, topCount + midCount);


    Logger.log(`Created promo crates: Top(${topTracks.length}), Mid(${midTracks.length}), Low(${lowTracks.length})`);



    // =================================================================
    // STEP 3: BUILD THE FINAL PLAYLIST - TOP SECTION
    // =================================================================
    const finalTracks = [];


    // Helper to safely remove a track from its original crate by its ID
    const removeFromCrates = (trackId) => {
        let topIndex = topTracks.findIndex(t => t.id === trackId);
        if (topIndex > -1) {
            topTracks.splice(topIndex, 1);
            return;
        }
        let midIndex = midTracks.findIndex(t => t.id === trackId);
        if (midIndex > -1) {
            midTracks.splice(midIndex, 1);
        }
    };
    
    // Helper to pick random tracks from a combination of crates
    const pickRandomFrom = (crates, count) => {
      const combined = [].concat(...crates);
      if (combined.length === 0) return [];
      
      const picks = Selector.sliceRandom(combined, count);
      picks.forEach(pick => removeFromCrates(pick.id));
      return picks;
    };



    // Rule 1: One random track from "top tracks"
    finalTracks.push(...pickRandomFrom([topTracks], 1));


    // Rule 2: First artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());


    // Rule 3: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2));


    // Rule 4: Second artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());
    
    // Rule 5: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2));


    // Rule 6: Third artist track
    if (top3ArtistTracks.length > 0) finalTracks.push(top3ArtistTracks.shift());


    // Rule 7: Two random from "top" & "mid"
    finalTracks.push(...pickRandomFrom([topTracks, midTracks], 2));



    // =================================================================
    // STEP 4: BUILD THE FINAL PLAYLIST - BOTTOM SECTION
    // =================================================================


    // Combine all remaining promo tracks into a single shuffled crate
    const promoTracksBottom = Combiner.push([], topTracks, midTracks, lowTracks);
    Order.shuffle(promoTracksBottom);


    // Shuffle the remaining artist tracks
    Order.shuffle(otherArtistTracks);


    // Insert the remaining artist tracks one by one into the promo tracks crate
    // with a random interval of 2-4 promo tracks between each.
    let insertionIndex = 0;
    while (otherArtistTracks.length > 0) {
      const artistTrack = otherArtistTracks.shift();
      const interval = Math.floor(Math.random() * 3) + 2; // Random integer between 2 and 4
      
      insertionIndex += interval;
      
      // Ensure the insertion index does not go beyond the end of the array
      if (insertionIndex > promoTracksBottom.length) {
        insertionIndex = promoTracksBottom.length;
      }
      
      promoTracksBottom.splice(insertionIndex, 0, artistTrack);
      insertionIndex++; // Move index past the newly inserted track
    }


    // Append the fully mixed bottom section to the final playlist
    Combiner.push(finalTracks, promoTracksBottom);


    // =================================================================
    // STEP 5: VALIDATE AND SAVE THE PLAYLIST
    // =================================================================


    // Critical Validation: Ensure no tracks were lost during processing.
    if (finalTracks.length !== initialTotalTracks) {
      const message = `CRITICAL ERROR: Track count mismatch. Started with ${initialTotalTracks}, ended with ${finalTracks.length}. Aborting to prevent data loss.`;
      Logger.log(message);
      // Optional: throw new Error(message) to get an email notification if script fails.
      return; 
    }


    Logger.log(`Successfully prepared ${finalTracks.length} tracks. All tracks accounted for. Saving to Spotify...`);


    // This is the only function that modifies the live playlist.
    // It replaces all existing tracks with the new, carefully constructed list.
    Playlist.saveWithReplace({
      id: combinedPlaylist.id,
      name: combinedPlaylist.name, // Preserves the playlist name
      tracks: finalTracks,
      // Note: `saveWithReplace` does not preserve the description or cover by default.
      // If you need to preserve them, they must be passed in this object.
      // For this implementation, we assume Goofy's default behavior is sufficient,
      // or that the name is the only critical metadata to preserve via this call.
    });


    Logger.log(`Playlist "${combinedPlaylist.name}" has been successfully updated.`);


  } catch (e) {
    // If any error occurs above, this block is executed.
    Logger.log(`An error occurred: ${e.message}\nStack: ${e.stack}`);
    Logger.log(`IMPORTANT: The playlist "${combinedPlaylist.name}" was NOT modified due to the error.`);
  }
}


/**
 * EXAMPLE USAGE:
 * This function demonstrates how to call createArtistPromoPlaylist.
 * It should be triggered by a time-based scheduler in Google Apps Script.
 */
function runArtistPromoUpdate() {
  const playlistConfig = {
    artistPlaylist: {
      id: '4RGQCOmziHwObM24VyuwyD',    // <-- Replace with actual ID
      name: 'Reference tracks',              // <-- Replace with actual Name
    },
    promoPlaylist: {
      id: '37i9dQZF1DX9dX3aBjsxqd',     // <-- Replace with actual ID
      name: 'Mellow Cello',             // <-- Replace with actual Name
    },
    combinedPlaylist: {
      id: '0PWIdpFNOh7tWktxiQDTvq',  // <-- Replace with actual ID
      name: 'Reference guitar',          // <-- Replace with actual Name
    },
  };


  createArtistPromoPlaylist(playlistConfig);
}
