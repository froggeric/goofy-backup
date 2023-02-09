// One off complex playlists creation:
//  Melatone
//  Bachata vs Salsa vs Cumbia
//  Back to sleep
//  Latin Party Mix
//  Running playlists

// Melatone
// Concatenated tracks from 3 playlists
// run on a different schedule from other playlists
function createMelatone() {

  let name = 'Melatone';
  let id = '6b4w2n49x7eVcYu3s90pCN';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] An instrumental playlist to fall asleep to. Approximately 45 to 60 minutes long. [1] First part: soft melodic songs to relax. [2] Second part: calmer songs to help fall asleep. [3] Final part: a few repetitions of the most relaxing song ever (Weightless by Marconi Union).";

  Logger.log("Creating custom playlist: " + name);

  // Get x random tracks from each playlist
  let tracks = Source.getTracks([
    {
      name: '<!>Melatone 1 relax',
      id: '4ydomBoG4tHzp1ekls1rSd',
      count: 4,
      inRow: false
    },
    {
      name: '<!>Melatone 2 falling asleep',
      id: '26ttzfvBwnULKyT1F90Icb',
      count: 4,
      inRow: false
    },
    {
      name: '<!>Melatone 3 deep sleep',
      id: '5bo06n7PBW5vXNj5ae7qte',
      count: 3,
      inRow: false
    }]);

  // Save playlist, without modifying the cover nor description
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });
}

// Back to sleep
// Concatenated tracks from 2 playlists
// run on a different schedule from other playlists
function createBackToSleep() {

  let name = 'Back to sleep';
  let id = '0PYcAZ0kdV5wyjynCcGzIR';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] A sort playlist to help going back to sleep when waking up in the middle of the night.";

  Logger.log("Creating custom playlist: " + name);

  // Get x random tracks from each playlist
  let tracks = Source.getTracks([
    {
      name: '<!>Melatone 2 falling asleep',
      id: '26ttzfvBwnULKyT1F90Icb',
      count: 1,
      inRow: false
    },
    {
      name: '<!>Melatone 3 deep sleep',
      id: '5bo06n7PBW5vXNj5ae7qte',
      count: 2,
      inRow: false
    }]);

  // Save playlist, without modifying the cover nor description
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });
}

// Latin Party Mix
// Alternated tracks from 4 playlists, filtered on duration, with a slight shuffle applied
function createLatinPartyMix() {
  let name = 'Latin party mix (cumbia, bachata, salsa, merengue)';
  let id = '672FuqsErGsxloQTpjbXYq';
  let playlists = [
    '7htbYn8f0q01n5br4XhQR9', // Cumbia (shuffled)
    '0o2GXyncPfGLmGSiOqSINx', // Salsa (shuffled)
    '7eufyawBpqQMvsIN4fgQB1', // Bachata (combined and shuffled)
    '3Bsz7QecNExg8bsDdW4iGW'  // Merengue (shuffled)
  ];
  let plsCount = 40;        // retrieve 40 tracks from each playlist
  let durationMin = 120000; // minimum duration in ms: 2min = 120s - exclude short intros
  let durationMax = 360000; // maximum duration in ms: 6mim = 360s - exclude long medleys
  let factor = 0.02;        // variable shuffle percentage (originally 0.02)

  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] 25% cumbia, 25% bachata, 25% salsa, 25% merengue. Mostly alternated genres, with a slight shuffle. Filtered out by duration to try to exclude medleys.";

  Logger.log("Creating custom playlist: " + name);

  // Build up an array of track lists, corresponding to each playlist id
  let trackGroups = playlists.map(id => {

    // Get tracks from source playlist
    //   For efficiency, we randomly retrieve a limited number of tracks.
    //   Since some of those will excluded later, due to their duration,
    //   We add 50% extra tracks.
    let plsTracks = Source.getTracks([
      {
        id: id,
        count: Math.floor(plsCount * 1.5),
        inRow: false
      }
    ]);

    // Only keep tracks tracks within the desired duration
    Filter.rangeTracks(plsTracks, {
        meta: {
          duration_ms: { min: durationMin, max: durationMax }
        }
    });

    // Only keep the desired number of tracks from the playlist
    Selector.keepFirst(plsTracks, plsCount);

    return plsTracks
  });

  // Alternate the track lists
  let tracks = Combiner.mixinMulti({
    source: trackGroups,
    inRow: [1,1,1,1],  // equal mixing ratio for each playlist, 1 track at a time
    toLimitOn: true    // stop processing as soon as the ratio cannot be adhered to
  });

  // Variable shuffle with with localised randomness factor
  let length = tracks.length;
  let permutations = length * factor;   // number of permutations we need to perform
  // shuffled index matching the size of the array
  let shuffledIndexes = Array.from(Array(length).keys()).sort(_ => Math.random() - .5)
  for (let i = 0; i < permutations; i++) {
    let x = shuffledIndexes[i];
    let r = Math.floor(Math.random() * (x + 1));
    let y = Math.floor(r * factor + x * (1 - factor));
    [tracks[x], tracks[y]] = [tracks[y], tracks[x]];
  }

  // Save the playlist
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });

}

// Bachata vs Salsa vs Cumbia
// Alternated tracks from 3 playlists, pattern: BSBSBC
function createBachataSalsaCumbia() {
  let name = '★ Bachata vs Salsa vs Cumbia ★';
  let id = '2i86j69ApMQVL6Fi4oQ1H0';
  let today = (new Date()).toISOString().split('T')[0];
  let description = "[DAILY SHUFFLE " + today + "] 150 new tracks every day! Taken from my manually curated playlists, alternating Bachata, Salsa, and Cumbia. Pattern: Bachata/Salsa/Bachata/Salsa/Bachata/Cumbia.";

  Logger.log("Creating custom playlist: " + name);

  // Get bachata tracks
  let tracksBachata = Source.getTracks([{
    id: '7eufyawBpqQMvsIN4fgQB1', // Bachata (combined and shuffled)
    count: 75,
    inRow: false
  }]);

  // Get salsa tracks
  let tracksSalsa = Source.getTracks([{
    id: '0o2GXyncPfGLmGSiOqSINx', // Salsa (shuffled)
    count: 50,
    inRow: false
  }]);

  // Get cumbia tracks
  let tracksCumbia = Source.getTracks([{
    id: '7htbYn8f0q01n5br4XhQR9', // Cumbia (shuffled)
    count: 25,
    inRow: false
  }]);

  // Combine salsa and cumbia tracks as: SSC
  let tracksSalsaCumbia = Combiner.mixin(tracksSalsa, tracksCumbia, 2, 1);

  // Combine all tracks as: BSBSBC
  let tracks = Combiner.alternate('max', tracksBachata, tracksSalsaCumbia);

  // Save the playlist
  Playlist.saveWithReplace({
    id: id,
    name: name,
    tracks: tracks,
    description: description,
    public: true
  });

}

// Running playlists
// Sources: merengue, cumbia, reggaeton
// filtered on bpm (including halved) and energy
function createRunningPlaylists() {

  let durationMax = 90;    // max duration in minutes of the final playlist
  let bpmTarget = 180;     // 180 BPM is the recemmended number of steps per minute for running
  let bpmDeviation = 0.15; // BPM range will be 15% of the target, centered around the target BPM
  let today = (new Date()).toISOString().split('T')[0];

  // Source playlists
  let tracksCumbia = FilterRunningPlaylist('<!>Cumbia [archive]', '1hSmpmZbgkoGpcIrCU9rpF', bpmTarget, bpmDeviation);
  let tracksMerengue = FilterRunningPlaylist('<!>Merengue [archive]', '0W2lVKgN2AbsFus2RIAiHz', bpmTarget, bpmDeviation);
  let tracksReggaeton = FilterRunningPlaylist('<!>Reggaeton [archive]', '1UoWJkPDZbNwuvNYrH6JRu', bpmTarget, bpmDeviation);
 
  // ► ¡Corre! ►
  let name = '► ¡Corre! ►';
  let id = '3ObKrWDdeEAcO7RxWRMItj';
  let description = "[DAILY REFRESH " + today + "] 90 minutes of latin songs for running, around the 180 BPM range (including halved BPM). Selected from my Cumbia, Merengue and Reggaeton playlists. Sorted by increasing tempo.";
  // Make a copy of the cumbia playlist as a starting point
  let tracks = Selector.sliceCopy(tracksCumbia);
  // Add the merengue and reggaeton playlists
  Combiner.push(tracks, tracksMerengue, tracksReggaeton);
  // Shuffle, extract duration, and save playlist
  SaveRunningPlaylist( name, id, tracks, description);

  // ► run: Cumbia ►
  name = '► run: Cumbia ►';
  id = '7ufkYNx8uyiHA1uDrH1ca3';
  description = "[DAILY REFRESH " + today + "] 90 minutes of cumbia songs for running, around the 180 BPM range. Sorted by increasing tempo."
  // Shuffle, extract duration, and save playlist
  SaveRunningPlaylist( name, id, tracksCumbia, description);

  // ► run: Merengue ►
  name = '► run: Merengue ►';
  id = '5CzTxbjBq7GYCyyPaaRmMY';
  description = "[DAILY REFRESH " + today + "] 90 minutes of merengue songs for running, around the 180 BPM range.  Sorted by increasing tempo."
  // Shuffle, extract duration, and save playlist
  SaveRunningPlaylist( name, id, tracksMerengue, description);

  // ► run: Reggaeton ►
  name = '► run: Reggaeton ►';
  id = '0Bul5uwXpAZsNQB3RgNlDE';
  description = "[DAILY REFRESH " + today + "] 90 minutes of reggaeton songs for running, around the 180 BPM range. Sorted by increasing tempo."
  // Shuffle, extract duration, and save playlist
  SaveRunningPlaylist( name, id, tracksReggaeton, description);


  function FilterRunningPlaylist( name, id, bpmTarget = 180, bpmDeviation = 0.15 ) {

    let bpmMargin = bpmTarget*bpmDeviation/2; // half percentage of BPM deviation to -/+ around the target
    let bpmMin = bpmTarget - bpmMargin;       // minimum BPM of tracks to keep
    let bpmMax = bpmTarget + bpmMargin;       // minimum BPM of tracks to keep

    // get source tracks
    let tracks = Source.getTracks([
      {
        name: name,
        id: id
      }]);
    let total = tracks.length;
  
    // Make a copy of the playlist for halved BPM filtering
    let halvedTracks = Selector.sliceCopy(tracks);

    // Filter the tracks based on tempo and energy
    // Add tempo information to tracks
    FilterByTempo( tracks, bpmMin, bpmMax, 1 );
    FilterByTempo( halvedTracks, bpmMin/2, bpmMax/2, 2 );

    let totalFullBPM = tracks.length;
    let totalHalfBPM = halvedTracks.length;
    
    // Combine both results, shuffle the tracks, and only keep up to a maximum duration
    Combiner.push(tracks, halvedTracks);
    let totalFiltered = tracks.length;

    Logger.log("Filtered " + totalFiltered + '/' + total + ' tracks (' + totalFullBPM + ' @ ' + bpmMin + '-' + bpmMax + ' bpm + ' + totalHalfBPM + ' @ ' + bpmMin/2 + '-' + bpmMax/2 + ' bpm) from ' + name);

    return tracks;
  }


  function FilterByTempo( tracks, bpmMin, bpmMax, multiplier = 1 ) {

    let energyMin = 0.4;  // minimum energy of tracks to keep
    let energyMax = 1.0;  // maximum energy of tracks to keep

    // Only keep tracks tracks within the desired BPM range
    // Only keep tracks with sufficient energy
    Filter.rangeTracks(tracks, {
      features: {
        tempo: { min: bpmMin, max: bpmMax },
        energy: { min: energyMin, max: energyMax }
      }
    });

    // Add tempo information to tracks
    // Since the audio features have alredy been queried during the filtering,
    // goofy keeps them in the cache, and we can retrieve the whole cache content
    let cache = getCachedTracks(tracks, { features: {} }).features;
    let cachedItems = Object.values(cache);

    // For efficiency, since we have a lot more in the cache than the tracklist,
    // we first iterate through all the cached items
    for (let x = 0; x < cachedItems.length; x++) {
      let item = cachedItems[x];
      let id = item.id;
      // Now we iterate the tracklist to find a matching track, if any
      for (let y = 0; y < tracks.length; y++) {
        // Check it the current cached item is a match for the current track
        if ( tracks[y].id == id ) {
          // Save the tempo (potentially modified) to the track properties
          let tempo = item.tempo * multiplier;
          tracks[y].tempo = tempo;
          // Logger.log( id + ' = '+ tracks[y].id + ' : ' + tempo);
        }
      }
    }
  }


  function SaveRunningPlaylist( name, id, tracks, description) {
 
    // dedup and shuffle tracks, before only keeping up to the maximum duration
    Filter.dedupTracks(tracks);
    let total = tracks.length;
    Order.shuffle(tracks);
    Selector.keepNoLongerThan(tracks, durationMax+1);
    let saved = tracks.length;

    Logger.log("Creating custom playlist: " + name + ' (kept ' + saved + '/' + total + ' tracks)');

    // Sort by increasing tempo
    tracks.sort((x, y) => {
        return x.tempo - y.tempo;
    });

    // for (let y = 0; y < tracks.length; y++) {
    //   Logger.log( tracks[y].tempo + ' ' + tracks[y].name);
    // }

    // Save playlist, without modifying the cover
    Playlist.saveWithReplace({
      id: id,
      name: name,
      tracks: tracks,
      description: description,
      public: true
    });

  }

}
