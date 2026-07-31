const axios = require('axios');

/**
 * Helper to fetch YouTube captions / timedtext track if available for a given youtubeId
 * @param {string} youtubeId 
 * @returns {Promise<Array<{start: number, text: string}>|null>}
 */
const fetchYouTubeCaptions = async (youtubeId) => {
  if (!youtubeId) return null;

  try {
    // Fetch video page HTML to locate captionTracks metadata
    const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const pageRes = await axios.get(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 5000
    });

    const html = pageRes.data;
    const captionTracksMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
    if (!captionTracksMatch) return null;

    const captionTracks = JSON.parse(captionTracksMatch[1]);
    if (!captionTracks || captionTracks.length === 0) return null;

    // Prefer Vietnamese or English or first available track
    const track = captionTracks.find(t => t.languageCode === 'vi') ||
                  captionTracks.find(t => t.languageCode === 'en') ||
                  captionTracks[0];

    if (!track || !track.baseUrl) return null;

    // Fetch XML timedtext caption content
    const captionRes = await axios.get(track.baseUrl, { timeout: 5000 });
    const xml = captionRes.data;

    // XML regex parser for <text start="12.34" dur="3.45">Lyric text...</text>
    const regex = /<text\s+start="([\d\.]+)"[^>]*>(.*?)<\/text>/gi;
    const results = [];
    let match;

    while ((match = regex.exec(xml)) !== null) {
      const startSec = parseFloat(match[1]);
      let text = match[2]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/<[^>]+>/g, '')
        .trim();

      if (text) {
        results.push({ start: startSec, text });
      }
    }

    return results.length > 0 ? results : null;
  } catch (err) {
    console.warn("Could not fetch YouTube captions for ID:", youtubeId, err.message);
  }
  return null;
};

module.exports = { fetchYouTubeCaptions };
