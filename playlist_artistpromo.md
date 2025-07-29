Of course. Here is the complete documentation for the script, broken down into the five parts you requested.

***

# PART 1: Concise Overview

This script is a powerful promotional tool for artists on Spotify. It automatically builds and shuffles a dynamic playlist every day, designed to capture new listeners and keep them engaged.

The final playlist strategically places your most important tracks near the top, surrounded by popular songs from similar, well-known artists. The rest of the playlist is a smart mix of your other music and related tracks, creating a professional and compelling listening experience that drives discovery and showcases your work in the best possible light.

***

# PART 2: Preparation & How It Works

To get started, you will work with three distinct Spotify playlists. The script will only ever modify the content of the final "Combined Playlist".

### The 3 Core Playlists

1.  **Your Artist Playlist**:
    *   **Content**: This playlist must contain *only your own tracks*.
    *   **Track Order is Critical**: The first 3 tracks in this playlist are given top priority. Place your most important songs (e.g., your latest single, your most popular track) in positions 1, 2, and 3. The script will feature them prominently at the very top of the final playlist. The rest of your songs in this playlist will be woven into the final mix later.

2.  **Your Promo Playlist**:
    *   **Content**: Fill this playlist with songs from *other artists* that you want to be associated with. Think of artists who have a similar sound or who your ideal fans already listen to.
    *   **Track Order Doesn't Matter**: You can add songs in any order. The script will automatically sort them by their current popularity on Spotify to decide where they go in the final mix.

3.  **The Combined Playlist**:
    *   **Content**: This is the final, public-facing playlist that the script creates and updates.
    *   **Strategic Placement**: The playlist is intelligently constructed. It starts with a popular track to immediately grab a listener's attention, then strategically alternates between your top 3 songs and other popular tracks.
    *   **Daily Shuffle**: The entire playlist is refreshed daily. This keeps it from feeling static and encourages repeat listening, as the experience is slightly different each day while still maintaining its core structure.

***

# PART 3: Example Usage

You can use the script to manage multiple promotional playlists simultaneously. The main function `createArtistPromoPlaylist` is called from a "runner" function where you define the specific IDs and names for each set of playlists.

This runner function, for example `runAllDailyUpdates`, is what you should schedule to run automatically in Google Apps Script.

```javascript
/**
 * Main runner function to be scheduled in Google Apps Script.
 * This function orchestrates the updates for one or more promotional playlists.
 */
function runAllDailyUpdates() {

  // --- Example 1: An Indie Folk Promotion Playlist ---
  const indieFolkConfig = {
    artistPlaylist: {
      id: '5r3aGvP3Yq9q0F9Zc9B9a1',    // Your artist playlist for your folk project
      name: 'My Indie Folk Songs',
    },
    promoPlaylist: {
      id: '7t2B8c8V6F5e4D3C2b1A0f',     // Playlist with tracks from The Lumineers, Bon Iver, etc.
      name: 'Indie Folk Inspirations',
    },
    combinedPlaylist: {
      id: '1Xy2Z3b4C5d6E7f8G9h0I1',  // The final, public "Indie Folk Discoveries" playlist
      name: 'Indie Folk Discoveries | Daily Updated',
    },
  };
  createArtistPromoPlaylist(indieFolkConfig);
  
  Logger.log('Finished updating the Indie Folk playlist.');


  // --- Example 2: A Lofi Beats Promotion Playlist ---
  const lofiBeatsConfig = {
    artistPlaylist: {
      id: '4pL5mN6o7P8q9R0s1T2u3V',    // Your artist playlist for your lofi project
      name: 'My Lofi Beats',
    },
    promoPlaylist: {
      id: '2kM3n4O5p6Q7r8S9t0U1vW',     // Playlist with tracks from artists like J Dilla, Nujabes, etc.
      name: 'Lofi & Chillhop Gems',
    },
    combinedPlaylist: {
      id: '6aB7c8D9e0F1g2H3i4J5kL',  // The final, public "Lofi Beats for Studying" playlist
      name: '🌿 Lofi Beats for Studying & Focus',
    },
  };
  createArtistPromoPlaylist(lofiBeatsConfig);
  
  Logger.log('Finished updating the Lofi Beats playlist.');

}
```

***

# PART 4: SEO Strategies for the Combined Playlist

The title, description, and cover art are crucial for attracting listeners. They should be clear, appealing, and optimized for Spotify's search algorithm.

### Strategies

*   **Playlist Title**: Combine mood, genre, and a hook. Keywords are key. Users search for terms like "Chill Morning," "Workout Motivation," or "Indie Rock." Including "Daily Update" or the current year signals freshness.
    *   *Formula*: [Mood/Activity] + [Genre] | Daily discoveries from [Your Artist Name] & more.
*   **Playlist Description**: This is your space for more keywords. Mention similar artists, sub-genres, and the overall feeling of the playlist. Tell a story about what the playlist is perfect for (e.g., "The perfect soundtrack for late-night drives, featuring..."). End with a call to action like "Follow for daily new music!"
*   **Cover Art**: It must be visually striking and legible as a tiny thumbnail. Use high-contrast colors and a clean aesthetic that matches the genre. A consistent visual style across your brand helps with recognition.

---

### AI Prompt to Generate Titles & Descriptions

Use this prompt with an AI like ChatGPT or Claude to generate compelling text.

```text
Act as an expert Spotify playlist curator and digital marketer for an independent artist. Your goal is to create titles and descriptions that are highly engaging and optimized for Spotify SEO.

My artist name is: [Your Artist Name]
My main genre is: [e.g., Dream Pop]
The playlist's mood is: [e.g., Nostalgic, Ethereal, Calming, Uplifting]
Similar artists featured in the playlist are: [e.g., Beach House, Cocteau Twins, Men I Trust]

Based on this, generate 5 unique sets of a playlist title and a playlist description.

**Requirements:**
1.  **Title:** Must include keywords related to the mood and genre. Can use tasteful special characters (e.g., ✨,  ethereal dreams). Must be under 100 characters.
2.  **Description:** Must be under 300 characters. It should expand on the title, mention 2-3 similar artists by name, and include a call to action like "Follow for daily discoveries." It must feel personal and authentic.
```

### AI Prompt to Generate Cover Art Ideas

Use this prompt with an AI image generator like Midjourney or DALL-E to create a stunning cover.

```text
Generate a prompt for a Spotify playlist cover. The goal is a visually striking image that looks great as a small thumbnail and perfectly captures the mood of the music.

The playlist's genre is Dream Pop and Shoegaze.
The mood is nostalgic, ethereal, and hazy, like a faded polaroid from a forgotten summer.
The color palette should be muted pastels: soft pinks, dusty blues, and warm, hazy gold, with low contrast.
The composition should be minimalist and atmospheric.

**Create an image generation prompt that includes:**
- A detailed description of the subject and scene (e.g., "a lone figure watching a sunset over a calm sea through a hazy, vintage lens").
- The specific color palette and lighting (e.g., "golden hour lighting, soft focus, lens flare").
- The artistic style (e.g., "in the style of a 1980s polaroid photograph, cinematic, vaporwave aesthetic").
- A negative prompt to exclude unwanted elements (e.g., "--no text, logos, people's faces").
- The required aspect ratio: --ar 1:1```

***

# PART 5: How to Find Great Content for the Promo Playlist

Finding the right tracks to associate your music with is key. Your goal is a mix of popular, recognizable songs and hidden gems that make your playlist a go-to for discovery.

### Method

1.  **Start with Spotify**: Go to your artist page on Spotify. The "Fans Also Like" section is your primary source. These are artists Spotify's algorithm has already linked to you.
2.  **Go Deeper**: Click on those related artists. Check out their top tracks and explore their "Fans Also Like" sections. This creates a branching tree of potential artists.
3.  **Automate with Goofy**: You can use the Goofy library to automate this discovery process. Functions like `Source.getRecomArtists` or `Lastfm.getSimilarArtists` can generate lists of artists based on your own profile, saving you hours of manual research.
4.  **Analyze & Curate**: Don't just add every track. Listen to them. Do they fit the vibe? Are they too popular or too obscure? A good promo playlist has a balance. Aim for tracks that are slightly more popular than your own to leverage their audience.

---

### AI Prompt for Track Research

Use this prompt to get a curated list of potential tracks to add to your promo playlist.

```text
Act as an expert A&R scout and music curator. My artist, [Your Artist Name], creates [Genre, e.g., Indie Folk] music. I need a list of songs by other artists to create a promotional Spotify playlist.

My artist's key tracks are:
- "[Your Track 1 Title]"
- "[Your Track 2 Title]"

The goal is to find tracks that are a perfect musical fit and will appeal to my target audience.

Please provide a list of 15 songs. For each song, provide:
1.  Artist Name
2.  Track Title
3.  A brief, one-sentence reason why this track is a great fit (e.g., "Shares a similar melancholic acoustic style but with a slightly more polished production that will feel familiar yet fresh to listeners.").

**Constraints:**
- The artists should generally be more popular than mine, but avoid global superstars. We're looking for the sweet spot of discoverability.
- The songs should have been released in the last 3-4 years to keep the playlist feeling current.
- The list should be a mix of at least 3 different but related sub-genres (e.g., for Indie Folk, include some Americana and Singer-Songwriter tracks).
```

### Example Goofy Script for Artist Discovery

You can run this simple script to get a list of artists similar to a starting artist. Replace the ID with your own artist ID or that of an artist you admire.

```javascript
/**
 * A simple utility function to discover new artists based on a starting artist.
 * The results are printed to the logs.
 */
function discoverSimilarArtists() {
  // Replace with your artist ID or an artist you want to be similar to.
  const myArtistId = 'ARTIST_ID_HERE'; 
  
  // You can get an artist ID from their Spotify share link.
  // e.g., open.spotify.com/artist/ID_IS_HERE?si=...

  // We wrap the ID in an array of objects, as the function expects.
  const seedArtists = [{ id: myArtistId }];

  // Fetch recommended artists. The Goofy library handles the API calls.
  // This function is often more effective than the older 'getRelatedArtists'.
  const recommendedArtists = Source.getRecomArtists(seedArtists);
  
  // Remove any duplicate artists from the results.
  Filter.dedupArtists(recommendedArtists);

  Logger.log(`Found ${recommendedArtists.length} recommended artists similar to artist ID ${myArtistId}:`);

  recommendedArtists.forEach(artist => {
    Logger.log(`- ${artist.name}`);
  });
}
```
