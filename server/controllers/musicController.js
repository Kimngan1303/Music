const Music = require('../models/Music');
const axios = require('axios');
const ytSearch = require('yt-search');
const { getTracks } = require('spotify-url-info')(fetch);


const getSongs = async (req, res) => {
  try {
    const { userId } = req.query;
    // If userId is provided, fetch only their songs. Otherwise return empty array (we don't want cross-user leak)
    if (!userId) return res.json([]);
    
    const songs = await Music.find({ addedBy: userId }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const parseYouTubeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const youtubeId = (match && match[2].length === 11) ? match[2] : null;

    if (!youtubeId) return res.status(400).json({ message: 'Invalid YouTube URL' });

    const oembedRes = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);
    const data = oembedRes.data;

    res.json({
      youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      title: data.title || 'YouTube Song',
      artist: data.author_name || 'YouTube Creator',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      duration: '3:30'
    });
  } catch (error) {
    res.status(400).json({ message: 'Could not fetch song metadata from YouTube URL' });
  }
};

const addSong = async (req, res) => {
  try {
    const { id, youtubeId, youtubeUrl, title, artist, thumbnail, duration, addedBy, inLibrary } = req.body;
    
    // Upsert the song so we don't get duplicates if they re-add or sync
    const song = await Music.findOneAndUpdate(
      { id }, // match by frontend ID
      {
        id,
        youtubeId,
        youtubeUrl,
        title,
        artist,
        thumbnail,
        duration,
        addedBy,
        inLibrary: inLibrary !== undefined ? inLibrary : true
      },
      { new: true, upsert: true }
    );
    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    await Music.findOneAndDelete({ id });
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBatchSongs = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách ID không hợp lệ.' });
    }
    await Music.deleteMany({ id: { $in: ids } });
    res.json({ message: 'Batch songs removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPlaylist = async (req, res) => {
  try {
    const { playlistUrl, addedBy, inLibrary } = req.body;
    const match = playlistUrl.match(/[?&]list=([^#\&\?]+)/);
    let listId = match ? match[1] : null;
    if (listId && !listId.startsWith('VL')) {
      listId = 'VL' + listId;
    }
    
    if (!listId) {
      return res.status(400).json({ message: 'Đường dẫn Playlist YouTube không hợp lệ!' });
    }

    const { Innertube, UniversalCache } = await import('youtubei.js');
    const yt = await Innertube.create({ cache: new UniversalCache(false) });
    let playlist = await yt.getPlaylist(listId);
    
    if (!playlist || !playlist.items || playlist.items.length === 0) {
      return res.status(404).json({ message: 'Playlist trống hoặc không có quyền truy cập.' });
    }

    let allItems = [...playlist.items];

    // Tự động tải tiếp tất cả các trang đằng sau (Continuation) để lấy trọn vẹn toàn bộ Playlist (>100 bài)
    let pageCount = 0;
    const maxPages = 50; // Cho phép tải tới 5,000 bài hát trong 1 playlist
    while (playlist.has_continuation && pageCount < maxPages) {
      try {
        playlist = await playlist.getContinuation();
        if (playlist.items && playlist.items.length > 0) {
          allItems.push(...playlist.items);
        } else {
          break;
        }
      } catch (contErr) {
        console.warn('Lỗi khi tải trang tiếp theo của Playlist:', contErr);
        break;
      }
      pageCount++;
    }

    const songsToUpsert = allItems.map((item, idx) => {
      let title = 'Unknown Title';
      let artist = 'Unknown Artist';
      let duration = '3:30'; // default
      let vid = null;

      if (item.type === 'LockupView' || item.type === 'PlaylistVideoView') {
        vid = item.content_id || (item.metadata && item.metadata.content_id);
        title = item.metadata?.title?.text || title;
        
        try {
          const rows = item.metadata?.metadata?.metadata_rows || [];
          if (rows.length > 0 && rows[0].metadata_parts) {
            artist = rows[0].metadata_parts[0]?.text?.text || artist;
          }
        } catch(e) {}
        
        // duration might be buried in accessibility_context
        try {
           const label = item.renderer_context?.accessibility_context?.label || '';
           const durMatch = label.match(/(\d+)\s*minutes?,\s*(\d+)\s*seconds?/);
           if (durMatch) duration = `${durMatch[1]}:${durMatch[2].padStart(2, '0')}`;
        } catch(e) {}
      } else {
        // Fallback for older youtubei.js PlaylistVideo type
        if (item.title) title = typeof item.title === 'string' ? item.title : item.title.text || title;
        if (item.author) artist = typeof item.author === 'string' ? item.author : item.author.name || artist;
        if (item.duration && item.duration.text) duration = item.duration.text;
        vid = item.id;
      }
      
      if (!vid) vid = 'unknown_' + idx;

      const sId = 's' + vid + Date.now() + '_' + idx; // Ensure unique local ID

      return {
        id: sId,
        youtubeId: vid,
        youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
        title: title,
        artist: artist,
        thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
        duration: duration,
        addedBy: addedBy || null,
        inLibrary: inLibrary !== undefined ? inLibrary : true
      };
    });

    // We use a simple insert or loop through to upsert
    // Because it's a playlist, we can just insert them. If duplicates happen in DB, it's fine since 'id' is unique for this import batch.
    const createdSongs = await Music.insertMany(songsToUpsert);

    res.status(201).json(createdSongs);
  } catch (error) {
    console.error("Playlist Error:", error);
    res.status(500).json({ message: 'Lỗi khi tải Playlist: ' + error.message });
  }
};

const searchYouTube = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });
    const r = await ytSearch(query);
    const video = r.videos[0];
    if (!video) return res.status(404).json({ message: 'No video found' });
    res.json({
      youtubeId: video.videoId,
      title: video.title,
      artist: video.author.name,
      thumbnail: video.thumbnail,
      duration: video.timestamp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchOnline = async (req, res) => {
  try {
    const { q, query, limit = 15 } = req.query;
    const searchTerm = q || query;
    if (!searchTerm || !searchTerm.trim()) {
      return res.status(400).json({ message: 'Từ khóa tìm kiếm không được để trống.' });
    }

    const r = await ytSearch(searchTerm.trim());
    if (!r || !r.videos || r.videos.length === 0) {
      return res.json([]);
    }

    const maxLimit = Math.min(parseInt(limit) || 15, 30);
    const results = r.videos.slice(0, maxLimit).map((v) => ({
      id: 'yt_' + v.videoId,
      youtubeId: v.videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
      title: v.title,
      artist: v.author ? v.author.name : 'YouTube Creator',
      thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
      duration: v.timestamp || '3:30',
      views: v.views || 0,
      ago: v.ago || ''
    }));

    res.json(results);
  } catch (error) {
    console.error('Error in searchOnline:', error);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm bài hát online: ' + error.message });
  }
};

const addSpotifyPlaylist = async (req, res) => {
  try {
    const { playlistUrl, addedBy, inLibrary } = req.body;
    if (!playlistUrl) return res.status(400).json({ message: 'Missing playlistUrl' });

    // Ensure it is a valid Spotify URL
    if (!playlistUrl.includes('spotify.com/')) {
      return res.status(400).json({ message: 'Đường dẫn Spotify không hợp lệ.' });
    }

    // Get tracks from Spotify
    const tracks = await getTracks(playlistUrl);
    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài hát nào trong Playlist này.' });
    }

    // Limit to 30 tracks to avoid timeout
    const limit = 30;
    const tracksToProcess = tracks.slice(0, limit);

    // Process tracks sequentially (or with limited concurrency) to not spam YouTube search
    const songsToUpsert = [];
    
    for (let i = 0; i < tracksToProcess.length; i++) {
      const track = tracksToProcess[i];
      const title = track.name;
      const artist = track.artist || (track.artists && track.artists[0] ? track.artists[0].name : 'Unknown Artist');
      
      try {
        const query = `${title} ${artist}`;
        const searchRes = await ytSearch(query);
        const video = searchRes.videos[0];
        
        if (video) {
          const sId = 's' + video.videoId + Date.now() + '_' + i;
          
          songsToUpsert.push({
            id: sId,
            youtubeId: video.videoId,
            youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
            title: title,
            artist: artist,
            thumbnail: video.thumbnail, // fallback to YouTube thumbnail, or use track.album?.images[0]?.url if available, but spotify-url-info getTracks doesn't always return full images
            duration: video.timestamp || '3:00',
            addedBy: addedBy || null,
            inLibrary: inLibrary !== undefined ? inLibrary : true
          });
        }
      } catch (err) {
        console.warn('Could not find track on YouTube:', title, artist);
        // skip this track if search fails
      }
    }

    if (songsToUpsert.length === 0) {
      return res.status(404).json({ message: 'Không thể tìm thấy nguồn nhạc nào trên YouTube cho các bài hát trong Playlist này.' });
    }

    const createdSongs = await Music.insertMany(songsToUpsert);
    res.status(201).json(createdSongs);
  } catch (error) {
    console.error("Spotify Playlist Error:", error);
    res.status(500).json({ message: 'Lỗi khi tải Playlist Spotify: ' + error.message });
  }
};

const cleanSearchTerm = (str) => {
  if (!str) return '';
  return str
    .replace(/[\(\[\{](official|mv|video|audio|lyric|remix|lofi|tiktok).*?[\)\]\}]/gi, '')
    .replace(/official\s*music\s*video|official\s*video|official\s*audio|mv|remix|lofi|ver|version|cover|tiktok|audio/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const parseSongTitleAndArtist = (rawTitle, rawArtist) => {
  const cleanArtist = (rawArtist || '').replace(/official|channel|creator/gi, '').trim();
  const cleanTitleStr = (rawTitle || '').replace(/[\(\[\{](official|mv|video|audio|lyric|remix|lofi|tiktok).*?[\)\]\}]/gi, '').trim();

  let candidateTitles = [];
  let candidateArtists = cleanArtist ? [cleanArtist] : [];

  const parts = cleanTitleStr.split(/–|—|-|:|\|/).map(p => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const left = parts[0];
    const right = parts.slice(1).join(' ');

    const lowerArtist = cleanArtist.toLowerCase();
    const lowerLeft = left.toLowerCase();
    const lowerRight = right.toLowerCase();

    if (lowerArtist && (lowerLeft.includes(lowerArtist) || lowerArtist.includes(lowerLeft))) {
      // Artist is on the left -> Title is on the right! (e.g. "MCK - Nếu Như Ta Chẳng Còn")
      candidateTitles.push(right);
      candidateTitles.push(left); // fallback
      candidateArtists.push(left);
    } else if (lowerArtist && (lowerRight.includes(lowerArtist) || lowerArtist.includes(lowerRight))) {
      // Title is on the left -> Artist is on the right! (e.g. "Nếu Như Ta Chẳng Còn - MCK")
      candidateTitles.push(left);
      candidateTitles.push(right); // fallback
      candidateArtists.push(right);
    } else {
      // Unknown orientation: If left has fewer words than right, right is more likely title
      const leftWords = left.split(' ').filter(Boolean).length;
      const rightWords = right.split(' ').filter(Boolean).length;

      if (leftWords <= 2 && rightWords > 2) {
        candidateTitles.push(right);
        candidateTitles.push(left);
      } else {
        candidateTitles.push(left);
        candidateTitles.push(right);
      }
      candidateArtists.push(left);
      candidateArtists.push(right);
    }
  } else {
    candidateTitles.push(cleanTitleStr);
  }

  candidateTitles.push(cleanTitleStr);

  return {
    candidateTitles: candidateTitles.filter((v, i, a) => v && a.indexOf(v) === i),
    candidateArtists: candidateArtists.filter((v, i, a) => v && a.indexOf(v) === i)
  };
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const parseTitleWithAI = async (videoTitle, videoArtist) => {
  if (!GEMINI_API_KEY) return null;

  try {
    const prompt = `You are a music metadata parser. Extract the exact core song title (track_name) and main performing artist (artist_name) from this raw video title and channel name.
Output ONLY a JSON object: {"track_name": "Song Title", "artist_name": "Artist Name"}
No markdown code blocks, no explanation.

Video Title: "${videoTitle}"
Channel Name: "${videoArtist || ''}"`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150,
          responseMimeType: "application/json"
        }
      },
      { timeout: 4000 }
    );

    const replyText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (replyText) {
      const cleanJsonStr = replyText.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);
      if (parsed && parsed.track_name) {
        return {
          track_name: parsed.track_name.trim(),
          artist_name: (parsed.artist_name || '').trim()
        };
      }
    }
  } catch (err) {
    console.warn("Gemini AI title parsing warning:", err.message);
  }
  return null;
};

/**
 * Scrape Vietnamese lyrics directly from HopAmChuan (hopamchuan.com)
 * @param {string} title 
 * @param {string} artist 
 * @returns {Promise<{lyrics: string, url: string}|null>}
 */
const fetchLyricsFromHopAmChuan = async (title, artist) => {
  if (!title || !title.trim()) return null;

  try {
    const cleanT = title.replace(/[\(\[\{].*?[\)\]\}]/g, '').replace(/ft\..*|feat\..*/gi, '').trim();
    const parts = cleanT.split(/–|—|-|:|\|/).map(p => p.trim()).filter(Boolean);
    const cleanA = (artist || '').split(/\/|&|,|feat|ft\./i)[0].trim();

    let candidateTitles = [];
    if (parts.length >= 2) {
      if (cleanA && parts[0].toLowerCase().includes(cleanA.toLowerCase())) {
        candidateTitles.push(parts[1]);
      } else {
        candidateTitles.push(parts[0]);
      }
      candidateTitles.push(parts.join(' '));
    } else {
      candidateTitles.push(cleanT);
    }

    const queries = [];
    for (const cand of candidateTitles) {
      if (!cand) continue;
      queries.push(cand);
      if (cleanA) queries.push(`${cand} ${cleanA}`);
    }

    const uniqueQueries = queries.filter((v, i, a) => v && a.indexOf(v) === i);

    for (const qStr of uniqueQueries) {
      try {
        const searchUrl = `https://hopamchuan.com/search?q=${encodeURIComponent(qStr)}&mode=song`;
        const searchRes = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
          },
          timeout: 4000
        });

        const html = searchRes.data;

        if (!html.includes('song-title')) continue;

        const songItemRegex = /href="([^"]+\/song\/[^"]+)"\s+class="song-title">\s*([^<]+)<\/a>/gi;
        let match;

        while ((match = songItemRegex.exec(html)) !== null) {
          let songUrl = match[1];

          if (songUrl.startsWith('/')) {
            songUrl = `https://hopamchuan.com${songUrl}`;
          }

          const detailRes = await axios.get(songUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 4000
          });

          const detailHtml = detailRes.data;
          const lyricDivMatch = detailHtml.match(/<div id="song-lyric"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i) ||
                                detailHtml.match(/<div id="song-lyric"[^>]*>([\s\S]*?)<div id="song-leftover-space"/i);

          if (!lyricDivMatch) continue;

          const lyricHtml = lyricDivMatch[1];
          const lines = [];
          const lineRegex = /<div class="chord_lyric_line[^"]*">([\s\S]*?)<\/div>/gi;
          let lMatch;

          while ((lMatch = lineRegex.exec(lyricHtml)) !== null) {
            const lineContent = lMatch[1];
            let cleanLine = lineContent.replace(/<span class="hopamchuan_chord_inline">[\s\S]*?<\/span>/gi, '');
            cleanLine = cleanLine.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim();
            
            if (cleanLine && !cleanLine.toLowerCase().startsWith('tone ') && !cleanLine.toLowerCase().startsWith('vòng hợp âm:')) {
              lines.push(cleanLine);
            }
          }

          if (lines.length > 0) {
            return {
              lyrics: lines.join('\n'),
              url: songUrl
            };
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn("HopAmChuan scrape warning:", err.message);
  }
  return null;
};

const getLyrics = async (req, res) => {
  try {
    const { title, artist } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Thiếu tên bài hát.' });
    }

    // ── PRIORITY LAYER 0: HOPAMCHUAN.COM VIETNAMESE LYRICS SEARCH ─────────
    try {
      const hopAmChuanRes = await fetchLyricsFromHopAmChuan(title, artist);
      if (hopAmChuanRes && hopAmChuanRes.lyrics) {
        console.log(`🎶 Found Vietnamese Lyrics from HopAmChuan.com (${hopAmChuanRes.url})`);
        let syncedLrc = '';
        try {
          const cleanT = title.replace(/[\(\[\{].*?[\)\]\}]/g, '').trim();
          const lrclibRes = await axios.get('https://lrclib.net/api/search', { params: { q: cleanT }, timeout: 3000 });
          if (lrclibRes.data?.[0]?.syncedLyrics) {
            syncedLrc = lrclibRes.data[0].syncedLyrics;
          }
        } catch (e) {}

        return res.json({
          syncedLyrics: syncedLrc,
          plainLyrics: hopAmChuanRes.lyrics,
          isSynced: Boolean(syncedLrc && syncedLrc.trim()),
          source: 'HopAmChuan.com (Hợp Âm Chuẩn)',
          url: hopAmChuanRes.url
        });
      }
    } catch (e) {
      console.warn("HopAmChuan layer error:", e.message);
    }

    // ── LAYER 1: GEMINI AI POWERED EXACT METADATA EXTRACTION ───────────────
    try {
      const aiResult = await parseTitleWithAI(title, artist);
      if (aiResult && aiResult.track_name) {
        console.log(`🤖 Gemini AI Extracted: "${aiResult.track_name}" by "${aiResult.artist_name}"`);

        // Try LRCLIB exact get first
        try {
          const getRes = await axios.get('https://lrclib.net/api/get', {
            params: {
              track_name: aiResult.track_name,
              artist_name: aiResult.artist_name || undefined
            },
            timeout: 4000
          });
          if (getRes.data && (getRes.data.syncedLyrics || getRes.data.plainLyrics)) {
            return res.json({
              syncedLyrics: getRes.data.syncedLyrics || '',
              plainLyrics: getRes.data.plainLyrics || '',
              isSynced: Boolean(getRes.data.syncedLyrics && getRes.data.syncedLyrics.trim()),
              source: `Gemini AI Exact ("${aiResult.track_name}")`
            });
          }
        } catch (e) { }

        // Try LRCLIB search query with AI clean title
        const aiQueries = [
          `${aiResult.track_name} ${aiResult.artist_name}`.trim(),
          aiResult.track_name
        ];

        for (const aiQ of aiQueries) {
          if (!aiQ) continue;
          try {
            const searchRes = await axios.get('https://lrclib.net/api/search', {
              params: { q: aiQ },
              timeout: 4000
            });
            if (searchRes.data && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
              const bestMatch = searchRes.data.find(item => item.syncedLyrics && item.syncedLyrics.trim()) || 
                                searchRes.data.find(item => item.plainLyrics && item.plainLyrics.trim()) || 
                                searchRes.data[0];

              if (bestMatch && (bestMatch.syncedLyrics || bestMatch.plainLyrics)) {
                return res.json({
                  syncedLyrics: bestMatch.syncedLyrics || '',
                  plainLyrics: bestMatch.plainLyrics || '',
                  isSynced: Boolean(bestMatch.syncedLyrics && bestMatch.syncedLyrics.trim()),
                  source: `Gemini AI Search ("${aiQ}")`
                });
              }
            }
          } catch (e) { }
        }
      }
    } catch (e) {
      console.warn("AI Layer fallback to Multi-pass algorithm:", e.message);
    }

    // ── LAYER 2: MULTI-PASS ALGORITHM FALLBACK ──────────────────────────────
    const { candidateTitles, candidateArtists } = parseSongTitleAndArtist(title, artist);
    const searchQueries = [];

    // For each candidate title, generate short core words (3-5 words) and full clean title
    for (const candTitle of candidateTitles) {
      const cleanT = candTitle.replace(/[\(\[\{].*?[\)\]\}]/g, '').replace(/ft\..*|feat\..*/gi, '').trim();
      const words = cleanT.split(' ').filter(Boolean);
      
      const shortT = words.length <= 3 
        ? words.join(' ') 
        : (words.length <= 6 ? words.slice(0, 4).join(' ') : words.slice(0, 5).join(' '));

      if (shortT) searchQueries.push(shortT);
      
      for (const candArtist of candidateArtists) {
        const baseArt = candArtist.split(/\/|&|,|feat|ft\./i)[0].trim();
        if (shortT && baseArt) searchQueries.push(`${shortT} ${baseArt}`);
        if (cleanT && baseArt) searchQueries.push(`${cleanT} ${baseArt}`);
      }

      if (cleanT) searchQueries.push(cleanT);
    }

    const searchQueriesList = searchQueries.filter((q, idx, arr) => q && q.trim().length > 0 && arr.indexOf(q) === idx);

    for (const query of searchQueriesList) {
      try {
        const searchRes = await axios.get('https://lrclib.net/api/search', {
          params: { q: query.trim() },
          timeout: 4000
        });

        if (searchRes.data && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
          const bestMatch = searchRes.data.find(item => item.syncedLyrics && item.syncedLyrics.trim()) || 
                            searchRes.data.find(item => item.plainLyrics && item.plainLyrics.trim()) || 
                            searchRes.data[0];

          if (bestMatch && (bestMatch.syncedLyrics || bestMatch.plainLyrics)) {
            return res.json({
              syncedLyrics: bestMatch.syncedLyrics || '',
              plainLyrics: bestMatch.plainLyrics || '',
              isSynced: Boolean(bestMatch.syncedLyrics && bestMatch.syncedLyrics.trim()),
              source: `LRCLIB (${query})`
            });
          }
        }
      } catch (e) { }
    }

    return res.status(404).json({ message: 'Không tìm thấy lời bài hát tự động.' });
  } catch (error) {
    console.error("Lyrics search error:", error);
    res.status(500).json({ message: 'Lỗi khi tải lời bài hát.' });
  }
};

module.exports = { getSongs, parseYouTubeUrl, addSong, deleteSong, deleteBatchSongs, searchYouTube, searchOnline, addPlaylist, addSpotifyPlaylist, getLyrics };
