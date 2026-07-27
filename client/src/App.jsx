import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ─── Typography ──────────────────────────────────────────
const F = {
  heading:    "'Playfair Display', Georgia, serif",
  brand:      "'Cormorant Garamond', Georgia, serif",
  cursive:    "'Great Vibes', cursive",
  body:       "'DM Sans', sans-serif",
};

// ─── Pre-curated Pastel Theme Palettes ───────────────────
const THEMES = {
  nude: {
    key: 'nude',
    name: 'Pastel Nude (Beige Kem)',
    icon: '🌾',
    bg:          'linear-gradient(145deg,#f5e8dc 0%,#ead7c5 50%,#f0e0d0 100%)',
    surface:     'rgba(252,245,238,0.92)',
    border:      '#e2cbb8',
    borderSel:   '#b8876a',
    txt:         '#523223',
    txtSub:      '#7a4d38',
    txtFad:      '#a87d69',
    primary:     'linear-gradient(135deg,#d98a6c,#c47150)',
    primarySolid:'#d98a6c',
    primaryGlow: 'rgba(217,138,108,0.45)',
    tag:         '#ebdacb',
    tagBd:       '#d8bea9',
    tagTxt:      '#6e3c23',
    btn:         '#ebdccf',
    btnBd:       '#d8bea9',
    btnTxt:      '#a25c38',
  },
  pink: {
    key: 'pink',
    name: 'Pastel Rose (Hồng Nhạt)',
    icon: '🌸',
    bg:          'linear-gradient(145deg,#f9d0e2 0%,#f1bada 50%,#f6cadf 100%)',
    surface:     'rgba(255,242,248,0.92)',
    border:      '#e89bbd',
    borderSel:   '#cd588e',
    txt:         '#4a122a',
    txtSub:      '#7c2a4f',
    txtFad:      '#aa5a81',
    primary:     'linear-gradient(135deg,#d95d90,#c74378)',
    primarySolid:'#d95d90',
    primaryGlow: 'rgba(217,93,144,0.45)',
    tag:         '#f3c4d9',
    tagBd:       '#e497b9',
    tagTxt:      '#681c3c',
    btn:         '#f4c7dc',
    btnBd:       '#e497b9',
    btnTxt:      '#a83d6a',
  },
  matcha: {
    key: 'matcha',
    name: 'Pastel Matcha (Xanh Trà Nhạt)',
    icon: '🌿',
    bg:          'linear-gradient(145deg,#cbe8cb 0%,#b9dfb9 50%,#c3e4c3 100%)',
    surface:     'rgba(240,250,240,0.92)',
    border:      '#91c491',
    borderSel:   '#509450',
    txt:         '#143317',
    txtSub:      '#2e5732',
    txtFad:      '#588c5c',
    primary:     'linear-gradient(135deg,#58a658,#438a43)',
    primarySolid:'#58a658',
    primaryGlow: 'rgba(88,166,88,0.45)',
    tag:         '#bee2be',
    tagBd:       '#94c894',
    tagTxt:      '#1f4823',
    btn:         '#bee2be',
    btnBd:       '#94c894',
    btnTxt:      '#38733d',
  },
  lavender: {
    key: 'lavender',
    name: 'Pastel Lavender (Tím Nhạt)',
    icon: '💜',
    bg:          'linear-gradient(145deg,#d8c7ff 0%,#c7b2ff 50%,#d0bcff 100%)',
    surface:     'rgba(245,240,255,0.92)',
    border:      '#b397ee',
    borderSel:   '#7e52d6',
    txt:         '#2a124a',
    txtSub:      '#4f2b7d',
    txtFad:      '#7d57ab',
    primary:     'linear-gradient(135deg,#8c57e6,#773fd3)',
    primarySolid:'#8c57e6',
    primaryGlow: 'rgba(140,87,230,0.45)',
    tag:         '#cdbbf8',
    tagBd:       '#b397ee',
    tagTxt:      '#3d1a6d',
    btn:         '#cfbefa',
    btnBd:       '#b397ee',
    btnTxt:      '#6d3ab8',
  },
  peach: {
    key: 'peach',
    name: 'Pastel Peach (Đào Nhạt)',
    icon: '🍑',
    bg:          'linear-gradient(145deg,#ffd2b3 0%,#fbc097 50%,#fecaa5 100%)',
    surface:     'rgba(255,246,238,0.92)',
    border:      '#f5a36c',
    borderSel:   '#db5e1d',
    txt:         '#471905',
    txtSub:      '#7a320e',
    txtFad:      '#ab5d33',
    primary:     'linear-gradient(135deg,#e87333,#d45a17)',
    primarySolid:'#e87333',
    primaryGlow: 'rgba(232,115,51,0.45)',
    tag:         '#fbc7a3',
    tagBd:       '#f3a470',
    tagTxt:      '#642407',
    btn:         '#fbc7a3',
    btnBd:       '#f3a470',
    btnTxt:      '#9c4114',
  },
  dark: {
    key: 'dark',
    name: 'Pastel Dusk (Hoàng Hôn)',
    icon: '🌙',
    bg:          'linear-gradient(145deg,#191328 0%,#100b1d 50%,#1d162f 100%)',
    surface:     'rgba(27,21,42,0.92)',
    border:      '#4e4e70',
    borderSel:   '#9377ed',
    txt:         '#ffffff',
    txtSub:      '#cfc6ed',
    txtFad:      '#9184b9',
    primary:     'linear-gradient(135deg,#9b7fed,#8160e6)',
    primarySolid:'#9b7fed',
    primaryGlow: 'rgba(155,127,237,0.45)',
    tag:         '#251c3b',
    tagBd:       '#4e4070',
    tagTxt:      '#bba7f5',
    btn:         '#251c3b',
    btnBd:       '#4e4070',
    btnTxt:      '#9b7fed',
    isDark:      true
  },
  midnight: {
    key: 'midnight',
    name: 'Midnight (Đen Huyền Bí)',
    icon: '🌑',
    bg:          'linear-gradient(145deg,#0a0a0a 0%,#151515 50%,#000000 100%)',
    surface:     'rgba(20,20,20,0.90)',
    border:      '#333333',
    borderSel:   '#777777',
    txt:         '#f5f5f5',
    txtSub:      '#aaaaaa',
    txtFad:      '#555555',
    primary:     'linear-gradient(135deg,#e0e0e0,#888888)',
    primarySolid:'#cccccc',
    primaryGlow: 'rgba(255,255,255,0.25)',
    tag:         '#1a1a1a',
    tagBd:       '#333333',
    tagTxt:      '#cccccc',
    btn:         '#1a1a1a',
    btnBd:       '#333333',
    btnTxt:      '#ffffff',
    isDark:      true
  },
  ocean: {
    key: 'ocean',
    name: 'Deep Ocean (Đại Dương Xanh)',
    icon: '🌊',
    bg:          'linear-gradient(145deg,#071a2b 0%,#0c253d 50%,#051524 100%)',
    surface:     'rgba(14,35,56,0.90)',
    border:      '#1f4b75',
    borderSel:   '#3d84c6',
    txt:         '#e6f2ff',
    txtSub:      '#99c2eb',
    txtFad:      '#4d88c2',
    primary:     'linear-gradient(135deg,#5dade2,#2874a6)',
    primarySolid:'#5dade2',
    primaryGlow: 'rgba(93,173,226,0.40)',
    tag:         '#102c47',
    tagBd:       '#1f4b75',
    tagTxt:      '#85b9e6',
    btn:         '#102c47',
    btnBd:       '#1f4b75',
    btnTxt:      '#5dade2',
    isDark:      true
  },
  cyberpunk: {
    key: 'cyberpunk',
    name: 'Cyberpunk (Neon Mix)',
    icon: '👾',
    bg:          'linear-gradient(145deg,#12041c 0%,#1a0628 50%,#0d0214 100%)',
    surface:     'rgba(30,10,48,0.90)',
    border:      '#4a1572',
    borderSel:   '#e024b4',
    txt:         '#faebff',
    txtSub:      '#c88de0',
    txtFad:      '#6a3b82',
    primary:     'linear-gradient(135deg,#ff2a9d,#00e5ff)',
    primarySolid:'#ff2a9d',
    primaryGlow: 'rgba(255,42,157,0.50)',
    tag:         '#250c38',
    tagBd:       '#4a1572',
    tagTxt:      '#e024b4',
    btn:         '#250c38',
    btnBd:       '#4a1572',
    btnTxt:      '#00e5ff',
    isDark:      true
  }
};


// Preset Avatars for quick selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
];

// Start with empty library — user adds their own songs
const DEFAULT_SONGS = [];

export default function App() {
  // ── Helper: per-user localStorage keys ──────────────────
  const songsKey = (uid) => `aura_songs_${uid || 'guest'}`;
  const favsKey  = (uid) => `aura_favs_${uid || 'guest'}`;

  // Get user ID from localStorage at init time (before user state resolves)
  const initUserId = (() => {
    try { return JSON.parse(localStorage.getItem('aura_user') || 'null')?._id || 'guest'; } catch { return 'guest'; }
  })();

  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(songsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [track,      setTrack]      = useState(null);
  const [playing,    setPlaying]    = useState(false);
  const [tab,        setTab]        = useState('home');
  const [favs,       setFavs]       = useState(() => {
    try {
      const saved = localStorage.getItem(favsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const playlistsKey = uid => `aura_playlists_${uid}`;

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(playlistsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [playlistModal, setPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [songToAdd, setSongToAdd] = useState(null); // Which song is currently selected to be added to a playlist


  const [query,      setQuery]      = useState('');
  const [curTime,    setCurTime]    = useState(0);
  const [dur,        setDur]        = useState(0);
  const [vol,        setVol]        = useState(80);
  const [muted,      setMuted]      = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [sleepTimeLeft, setSleepTimeLeft] = useState(0);
  const [addModal,   setAddModal]   = useState(false);
  const [addTab,     setAddTab]     = useState('youtube'); // 'youtube' | 'spotify' | 'playlist'
  const [ytUrl,      setYtUrl]      = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [adding,     setAdding]     = useState(false);
  const [addErr,     setAddErr]     = useState('');

  // User Auth & Profile State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      if (!saved) return null; // Not logged in — show landing page

      let userData = JSON.parse(saved);
      return userData;
    } catch {
      return null;
    }
  });


  // Page routing: 'landing' | 'login' | 'app'
  // Always start at landing page on fresh visit
  const [page, setPage] = useState('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loginModal, setLoginModal] = useState(false);
  const [email,      setEmail]      = useState('');
  const [pwd,        setPwd]        = useState('');
  const [loginErr,   setLoginErr]   = useState('');
  const [loggingIn,  setLoggingIn]  = useState(false);


  // Profile & Theme Customization Modal
  const [profileModal, setProfileModal] = useState(false);
  const [editName,     setEditName]     = useState('');
  const [editAvatar,   setEditAvatar]   = useState('');
  const avatarFileInputRef = useRef(null);

  // Reload songs and favs when user logs in or out
  useEffect(() => {
    const uid = user?._id || 'guest';
    let localSongs = [];
    try {
      const savedSongs = localStorage.getItem(songsKey(uid));
      localSongs = savedSongs ? JSON.parse(savedSongs) : [];
      setSongs(localSongs);
      
      const savedFavs = localStorage.getItem(favsKey(uid));
      setFavs(savedFavs ? JSON.parse(savedFavs) : []);
      
      const savedPlaylists = localStorage.getItem(playlistsKey(uid));
      setPlaylists(savedPlaylists ? JSON.parse(savedPlaylists) : []);
    } catch (e) {
      console.error("Failed to load user data", e);
    }
    
    // If logged in, fetch from backend to sync across devices
    if (user) {
      axios.get(`/api/music?userId=${user._id}`).then(res => {
        if (res.data && res.data.length > 0) {
          // Merge backend songs with local songs, preferring backend if duplicate
          const backendSongs = res.data.map(dbSong => ({
            id: dbSong.id,
            sourceType: 'youtube',
            youtubeId: dbSong.youtubeId,
            title: dbSong.title,
            artist: dbSong.artist,
            thumbnail: dbSong.thumbnail,
            duration: dbSong.duration
          }));
          
          const merged = [...backendSongs];
          // Add any local songs that aren't in backend yet
          localSongs.forEach(ls => {
            if (!merged.find(ms => ms.id === ls.id)) {
              merged.push(ls);
              // Push this local song to backend too
              axios.post('/api/music', { ...ls, addedBy: user._id }).catch(()=>{});
            }
          });
          
          setSongs(merged);
          localStorage.setItem(songsKey(uid), JSON.stringify(merged));
        }
      }).catch(console.error);

      // Fetch playlists
      axios.get(`/api/playlists?userId=${user._id}`).then(res => {
        setPlaylists(res.data);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(res.data));
      }).catch(console.error);

      // Fetch latest profile & favorites
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${user.token}` } }).then(res => {
        const dbProfile = res.data;
        const updatedUser = { ...user, name: dbProfile.name, avatar: dbProfile.avatar, favorites: dbProfile.favorites };
        setUser(updatedUser);
        localStorage.setItem('aura_user', JSON.stringify(updatedUser));
        
        if (dbProfile.favorites) {
          setFavs(dbProfile.favorites);
          localStorage.setItem(favsKey(user._id), JSON.stringify(dbProfile.favorites));
        }
      }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Theme State
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem('aura_theme_key') || 'nude';
  });

  // Repeat Mode State: 'off' | 'all' | 'one'
  const [repeatMode, setRepeatMode] = useState('off');
  const repeatRef = useRef('off');
  repeatRef.current = repeatMode;

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Current active theme tokens
  const C = THEMES[themeKey] || THEMES.nude;

  const yt = useRef(null);

  // Sync profile edit state when opening modal
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditAvatar(user.avatar || '');
    }
  }, [user, profileModal]);

  // Handle local avatar image upload from computer
  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Vui lòng chọn file ảnh dung lượng dưới 3MB!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setEditAvatar(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reload songs/favs when user changes (login to a different account)
  useEffect(() => {
    if (!user) { setSongs([]); setFavs([]); return; }
    try {
      const savedSongs = localStorage.getItem(songsKey(user._id));
      if (savedSongs !== null) setSongs(JSON.parse(savedSongs));
      else setSongs([]);
    } catch {}
    try {
      const savedFavs = localStorage.getItem(favsKey(user._id));
      if (savedFavs !== null) setFavs(JSON.parse(savedFavs));
      else setFavs([]);
    } catch {}
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init YT Player
  useEffect(() => {
    const init = () => {
      if (yt.current || !window.YT?.Player) return;
      yt.current = new window.YT.Player('yt-player', {
        height:'1', width:'1', videoId:'',
        playerVars: { autoplay:1, controls:0, disablekb:1, fs:0, rel:0, playsinline: 1 },
        events: {
          onReady: () => yt.current.setVolume(80),
          onStateChange: e => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
            else if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
            else if (e.data === window.YT.PlayerState.ENDED) {
              if (repeatRef.current === 'one') {
                yt.current?.seekTo?.(0, true);
                yt.current?.playVideo?.();
              } else {
                if (nextTrackRef.current) nextTrackRef.current();
              }
            }
          }
        }
      });
    };
    if (window.YT?.Player) init(); else window.onYouTubeIframeAPIReady = init;
  }, []);

  // Progress timer
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      try {
        setCurTime(yt.current?.getCurrentTime?.() || 0);
        const d = yt.current?.getDuration?.() || 0;
        if (d > 0) setDur(d);
      } catch {}
    }, 500);
    return () => clearInterval(t);
  }, [playing]);

  // Setup fallback loop listener for iOS background
  useEffect(() => {
    let silentAudio = document.getElementById('silent-audio');
    if (!silentAudio) return;
    const handleEnded = () => { silentAudio.currentTime = 0; silentAudio.play().catch(()=>{}); };
    silentAudio.addEventListener('ended', handleEnded);
    return () => { silentAudio.removeEventListener('ended', handleEnded); };
  }, []);

  // Sleep Timer logic
  useEffect(() => {
    let interval;
    if (sleepTimer > 0 && playing) {
      interval = setInterval(() => {
        setSleepTimeLeft(prev => {
          if (prev <= 1) {
            yt.current?.pauseVideo?.();
            setPlaying(false);
            setSleepTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepTimer, playing]);

  const cycleSleepTimer = () => {
    const options = [0, 15, 30, 60, 120];
    const idx = options.indexOf(sleepTimer);
    const nextVal = options[(idx + 1) % options.length] || 0;
    setSleepTimer(nextVal);
    setSleepTimeLeft(nextVal * 60);
  };

  const play = trk => {
    setTrack(trk); setPlaying(true);
    let yid = trk.youtubeId;
    
    // Auto-migrate old Spotify tracks
    if (!yid && trk.sourceType === 'spotify') {
      axios.get(`/api/music/search?query=${encodeURIComponent(trk.title + ' ' + trk.artist)}`)
        .then(searchRes => {
          yid = searchRes.data?.youtubeId;
          if (yid) {
            trk.youtubeId = yid;
            trk.sourceType = 'youtube';
            // Update in storage silently
            setSongs(prev => {
              const updated = prev.map(s => s.id === trk.id ? { ...s, youtubeId: yid, sourceType: 'youtube' } : s);
              if (user) localStorage.setItem(songsKey(user._id), JSON.stringify(updated));
              return updated;
            });
            yt.current?.playVideo?.(); // Prime mobile autoplay
            yt.current?.loadVideoById?.(yid);
          } else {
            setPlaying(false);
          }
        })
        .catch(e => {
          console.error("Failed to auto-migrate spotify track", e);
          setPlaying(false);
        });
      return;
    }

    if (yid) {
      // Call playVideo synchronously FIRST to unlock mobile browser audio constraints, then load the new video.
      const audio = document.getElementById('silent-audio');
      if (audio) audio.play().catch(()=>{});
      
      yt.current?.playVideo?.();
      yt.current?.loadVideoById?.(yid);
    } else {
      // If still no yid, just stop
      setPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!track) { if (songs[0]) play(songs[0]); return; }
    const audio = document.getElementById('silent-audio');
    if (playing) { 
      if (audio) audio.pause();
      yt.current?.pauseVideo?.(); 
      setPlaying(false); 
    } else { 
      if (audio) audio.play().catch(()=>{});
      yt.current?.playVideo?.();  
      setPlaying(true);  
    }
  };

  const nextTrack = () => {
    if (songs.length === 0) return;
    const i = songs.findIndex(s => s.id === track?.id);
    play(songs[(i + 1) % songs.length]);
  };

  const nextTrackRef = useRef();
  nextTrackRef.current = nextTrack;


  const prevTrack = () => {
    if (songs.length === 0) return;
    const i = songs.findIndex(s => s.id === track?.id);
    play(songs[(i - 1 + songs.length) % songs.length]);
  };

  const random = () => {
    if (songs.length === 0) return;
    play(songs[Math.floor(Math.random() * songs.length)]);
  };

  // Background playback control for mobile
  useEffect(() => {
    if ('mediaSession' in navigator && track) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artist: track.artist,
        artwork: [ { src: track.thumbnail, sizes: '512x512', type: 'image/jpeg' } ]
      });
      navigator.mediaSession.setActionHandler('play', () => { 
        const audio = document.getElementById('silent-audio');
        if (audio) audio.play().catch(()=>{});
        yt.current?.playVideo?.(); 
        setPlaying(true); 
      });
      navigator.mediaSession.setActionHandler('pause', () => { 
        const audio = document.getElementById('silent-audio');
        if (audio) audio.pause();
        yt.current?.pauseVideo?.(); 
        setPlaying(false); 
      });
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    }
  }, [track, songs]);

  const seek  = e => { const t = +e.target.value; setCurTime(t); yt.current?.seekTo?.(t, true); };
  const changeVol = e => { const v = +e.target.value; setVol(v); setMuted(v===0); yt.current?.setVolume?.(v); };
  const toggleMute = () => {
    if (muted) { setMuted(false); yt.current?.setVolume?.(vol||80); }
    else       { setMuted(true);  yt.current?.setVolume?.(0); }
  };

  const toggleFav = id => {
    setFavs(p => {
      const updated = p.includes(id) ? p.filter(x=>x!==id) : [...p,id];
      if (user) {
        localStorage.setItem(favsKey(user._id), JSON.stringify(updated));
        // Sync to backend
        axios.put('/api/auth/profile', { favorites: updated }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).catch(err => console.error("Failed to sync favorites", err));
      }
      return updated;
    });
  };

  const deleteSong = id => {
    setSongs(p => {
      const updated = p.filter(s => s.id !== id);
      if (user) localStorage.setItem(songsKey(user._id), JSON.stringify(updated));
      return updated;
    });
    setFavs(p => {
      const updated = p.filter(x => x !== id);
      if (user) {
        localStorage.setItem(favsKey(user._id), JSON.stringify(updated));
        axios.put('/api/auth/profile', { favorites: updated }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).catch(()=>{});
      }
      return updated;
    });
    if (track?.id === id) {
      setTrack(null);
      setPlaying(false);
      yt.current?.stopVideo?.();
    }
    axios.delete('/api/music/' + id).catch(() => {});
  };


  const handleLogin = async e => {
    e.preventDefault(); setLoggingIn(true); setLoginErr('');
    try {
      const r = await axios.post('/api/auth/login', { email, password: pwd });
      if (r.data?.token) {
        let loggedInUser = r.data;
        setUser(loggedInUser);
        localStorage.setItem('aura_user', JSON.stringify(loggedInUser));
        localStorage.setItem('aura_token', loggedInUser.token);
        
        // Sync favorites from backend
        if (loggedInUser.favorites) {
          setFavs(loggedInUser.favorites);
          localStorage.setItem(favsKey(loggedInUser._id), JSON.stringify(loggedInUser.favorites));
        }

        setLoginModal(false);
        setPage('app');
      }
    } catch(err) { 
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || err.message || 'Thông tin không chính xác.';
      setLoginErr(msg.includes('50') ? 'Máy chủ đang bảo trì hoặc mất kết nối (Lỗi 5xx).' : msg); 
    }
    finally { setLoggingIn(false); }
  };

  const logout = () => {
    setUser(null);
    setTrack(null);
    setPlaying(false);
    setPage('landing');
    try {
      yt.current?.stopVideo?.();
    } catch (e) {}
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
  };

  // Save Profile & Theme updates
  const handleSaveProfileAndTheme = async (e) => {
    e.preventDefault();
    if (user) {
      const updated = {
        ...user,
        name: editName.trim() || user.name,
        avatar: editAvatar.trim() || user.avatar
      };
      setUser(updated);
      localStorage.setItem('aura_user', JSON.stringify(updated));

      // Save to backend
      try {
        await axios.put('/api/auth/profile', {
          name: updated.name,
          avatar: updated.avatar
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (err) {
        console.error("Failed to save profile to server", err);
      }
    }
    localStorage.setItem('aura_theme_key', themeKey);
    setProfileModal(false);
  };

  const addSong = async e => {
    e.preventDefault(); if (!ytUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      const m = ytUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      const vid = m?.[2]?.length===11 ? m[2] : null;
      if (!vid) throw new Error('Đường dẫn YouTube không hợp lệ!');
      const existingSong = songs.find(song => song.youtubeId === vid);
      let s;
      if (existingSong) {
        s = existingSong;
      } else {
        s = { id:'s'+Date.now(), sourceType:'youtube', youtubeId:vid, title:'YouTube Song', artist:'YouTube Creator', thumbnail:`https://img.youtube.com/vi/${vid}/hqdefault.jpg`, duration:'3:30' };
        try { const o = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`); s.title = o.data?.title||s.title; s.artist = o.data?.author_name||s.artist; } catch {}
        setSongs(p => {
          const updated = [s, ...p];
          if (user) {
            localStorage.setItem(songsKey(user._id), JSON.stringify(updated));
            axios.post('/api/music', { ...s, addedBy: user._id }).catch(()=>{});
          }
          return updated;
        });
      }
      setAddModal(false); setYtUrl(''); play(s);
      
      if (tab.startsWith('playlist_')) {
        handleAddToPlaylist(tab.split('_')[1], s.id);
      }
    } catch(err) { setAddErr(err.message||'Lỗi không xác định.'); }
    finally { setAdding(false); }
  };

  const addSpotify = async e => {
    e.preventDefault(); if (!spotifyUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      // The backend /api/music/spotify-playlist handles playlists, albums, and single tracks
      const res = await axios.post('/api/music/spotify-playlist', {
        playlistUrl: spotifyUrl,
        addedBy: user?._id || null
      });
      
      const newSongs = res.data;
      if (!newSongs || newSongs.length === 0) throw new Error("Không lấy được bài hát nào từ Spotify.");

      const finalSongs = newSongs.map(ns => {
        const existing = songs.find(s => s.youtubeId === ns.youtubeId && ns.youtubeId && !ns.youtubeId.startsWith('unknown_'));
        return existing || ns;
      });

      setSongs(p => {
        const toAdd = finalSongs.filter(fs => !p.some(existing => existing.id === fs.id));
        if (toAdd.length === 0) return p;
        const updated = [...toAdd, ...p];
        if (user) {
          localStorage.setItem(songsKey(user._id), JSON.stringify(updated));
        }
        return updated;
      });
      
      setTrack(finalSongs[0]); 
      play(finalSongs[0]);
      setAddModal(false); 
      setSpotifyUrl('');
      
      if (tab.startsWith('playlist_')) {
        handleAddToPlaylist(tab.split('_')[1], null, finalSongs.map(ns => ns.id));
      }
    } catch(err) { setAddErr(err.response?.data?.message || err.message || 'Lỗi không xác định.'); }
    finally { setAdding(false); }
  };

  const addYouTubePlaylist = async e => {
    e.preventDefault(); if (!playlistUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      const res = await axios.post('/api/music/playlist', {
        playlistUrl,
        addedBy: user?._id || null
      });
      
      const newSongs = res.data;
      if (!newSongs || newSongs.length === 0) throw new Error("Không lấy được bài hát nào từ Playlist.");

      const finalSongs = newSongs.map(ns => {
        const existing = songs.find(s => s.youtubeId === ns.youtubeId && ns.youtubeId && !ns.youtubeId.startsWith('unknown_'));
        return existing || ns;
      });

      setSongs(p => {
        const toAdd = finalSongs.filter(fs => !p.some(existing => existing.id === fs.id));
        if (toAdd.length === 0) return p;
        const updated = [...toAdd, ...p];
        localStorage.setItem(songsKey(user?._id), JSON.stringify(updated));
        return updated;
      });
      
      setTrack(finalSongs[0]); 
      play(finalSongs[0]);
      setAddModal(false); 
      setPlaylistUrl('');
      
      if (tab.startsWith('playlist_')) {
        handleAddToPlaylist(tab.split('_')[1], null, finalSongs.map(ns => ns.id));
      }
    } catch(err) { 
      setAddErr(err.response?.data?.message || err.message || 'Lỗi không xác định.'); 
    }
    finally { setAdding(false); }
  };

  const handleCreatePlaylist = async e => {
    e.preventDefault();
    if (!newPlaylistName.trim() || !user) return;
    try {
      const res = await axios.post('/api/playlists', { name: newPlaylistName, userId: user._id });
      setPlaylists(p => {
        const up = [res.data, ...p];
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
      setPlaylistModal(false);
      setNewPlaylistName('');
      setTab(`playlist_${res.data._id}`);
    } catch(err) {
      console.error(err);
      alert('Lỗi tạo playlist: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeletePlaylist = async id => {
    if(!window.confirm('Bạn có chắc muốn xóa danh sách phát này không?')) return;
    try {
      await axios.delete(`/api/playlists/${id}`);
      setPlaylists(p => {
        const up = p.filter(x => x._id !== id);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
      if(tab === `playlist_${id}`) setTab('home');
    } catch(err) { console.error(err); }
  };

  const handleAddToPlaylist = async (playlistId, songId, songIds = null) => {
    try {
      const payload = songIds ? { songIds } : { songId };
      const res = await axios.put(`/api/playlists/${playlistId}/add`, payload);
      setPlaylists(p => {
        const up = p.map(x => x._id === playlistId ? res.data : x);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
      // Do not close modal immediately so user can see the success tick
    } catch(err) { console.error(err); }
  };

  const handleRemoveFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await axios.put(`/api/playlists/${playlistId}/remove`, { songId });
      setPlaylists(p => {
        const up = p.map(x => x._id === playlistId ? res.data : x);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
    } catch(err) { console.error(err); }
  };

  const fmt = s => isNaN(s)||s<0 ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  const activePlaylist = tab.startsWith('playlist_') ? playlists.find(p => p._id === tab.split('_')[1]) : null;

  const list = songs
    .filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
    .filter(s => {
      if (tab === 'favorites') return favs.includes(s.id);
      if (activePlaylist) return activePlaylist.songs.includes(s.id);
      return true;
    });

  const glass = { background: C.surface, backdropFilter: 'blur(20px)', border: `1.5px solid ${C.border}` };
  const btn   = { background: C.btn, color: C.btnTxt, border: `1.5px solid ${C.btnBd}` };

  // ── LANDING PAGE ──────────────────────────────────────────
  if (!user && page === 'landing') {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden flex flex-col" style={{ background: C.bg, fontFamily: F.body }}>
        <audio id="silent-audio" src="/silent.mp3" loop preload="auto" style={{ display: 'none' }}></audio>
        <div id="yt-player" className="fixed top-0 left-0 pointer-events-none z-[-50]" style={{ width: '300px', height: '300px', opacity: 1 }} />

        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background:`radial-gradient(circle at 30% 30%,${C.primarySolid},transparent 70%)`, transform:'translate(-30%,-30%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 float-anim"
          style={{ background:`radial-gradient(circle at 70% 70%,${C.borderSel},transparent 70%)`, transform:'translate(30%,30%)', animationDelay:'2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
          style={{ background:`radial-gradient(circle,${C.primarySolid},transparent)`, transform:'translate(-50%,-50%)' }} />

        {/* Nav bar */}
        <header className="relative z-10 flex items-center justify-between px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-xl text-white spin-slow"></i>
            </div>
            <span style={{ fontFamily: F.cursive, fontSize:'26px', color: C.primarySolid, lineHeight:1 }}>LittleLove</span>
          </div>
          <button
            onClick={() => setPage('login')}
            className="px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105 cursor-pointer"
            style={{ background: C.primary, color: '#fff', boxShadow:`0 4px 16px ${C.primaryGlow}` }}
          >
            Đăng nhập
          </button>
        </header>

        {/* Hero section */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 py-16 gap-8">
          {/* Spinning disc icon */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl mb-2"
            style={{ background: C.primary, boxShadow:`0 20px 60px ${C.primaryGlow}` }}>
            <i className="ri-disc-fill text-6xl text-white spin-slow"></i>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-2">
            <h1 style={{ fontFamily: F.cursive, fontSize:'clamp(48px,8vw,88px)', color: C.primarySolid, lineHeight:1.05 }}>
              LittleLove
            </h1>
            <p style={{ fontFamily: F.brand, fontSize:'clamp(13px,2vw,18px)', color: C.txtSub, letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600 }}>
              Không gian âm nhạc cá nhân của bạn
            </p>
          </div>

          {/* Description */}
          <p style={{ fontFamily: F.body, fontSize:'clamp(14px,1.8vw,17px)', color: C.txtSub, maxWidth:'520px', lineHeight:1.8 }}>
            Tạo thư viện nhạc riêng từ YouTube, lưu bài yêu thích,
            tùy chỉnh giao diện theo phong cách của bạn.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { icon: 'ri-youtube-fill',    label: 'Stream từ YouTube'     },
              { icon: 'ri-heart-fill',      label: 'Bài hát yêu thích'    },
              { icon: 'ri-palette-fill',    label: 'Giao diện Pastel'      },
              { icon: 'ri-repeat-line',     label: 'Phát & Lặp lại'        },
            ].map(f => (
              <span key={f.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: C.tag, border:`1.5px solid ${C.tagBd}`, color: C.tagTxt }}>
                <i className={`${f.icon} text-base`}></i>
                {f.label}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => setPage('login')}
            className="mt-4 px-10 py-4 rounded-2xl text-lg font-bold text-white flex items-center gap-3 shadow-2xl transition-all hover:scale-105 hover:shadow-3xl cursor-pointer"
            style={{ background: C.primary, boxShadow:`0 8px 32px ${C.primaryGlow}` }}
          >
            <i className="ri-headphone-fill text-xl"></i>
            Bắt đầu nghe nhạc
            <i className="ri-arrow-right-line text-xl"></i>
          </button>

          <p style={{ color: C.txtFad, fontSize:'12px', marginTop:'4px' }}>
            ✦ Dành riêng cho bạn • Private Music Space ✦
          </p>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center pb-6 pt-2">
          <p style={{ color: C.txtFad, fontSize:'11px', fontFamily: F.brand, letterSpacing:'0.15em' }}>
            © 2024 LittleLove · Personal Edition
          </p>
        </footer>
      </div>
    );
  }

  // ── FULLSCREEN LOGIN SCREEN ────────────────────────────────
  if (!user && page === 'login') {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: C.bg, fontFamily: F.body }}>
        <audio id="silent-audio" src="/silent.mp3" loop preload="auto" style={{ display: 'none' }}></audio>
        <div id="yt-player" className="fixed top-0 left-0 pointer-events-none z-[-50]" style={{ width: '300px', height: '300px', opacity: 1 }} />

        {/* Decorative background blobs */}
        <div className="absolute top-12 left-16 w-64 h-64 rounded-full pointer-events-none float-anim opacity-40"
          style={{ background:`radial-gradient(circle,${C.borderSel},transparent)` }} />
        <div className="absolute bottom-12 right-20 w-80 h-80 rounded-full pointer-events-none float-anim opacity-30"
          style={{ background:`radial-gradient(circle,${C.primarySolid},transparent)`, animationDelay:'1.5s' }} />

        {/* Login Card */}
        <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10"
          style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 25px 70px rgba(0,0,0,0.12)' }}>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-3xl text-white spin-slow"></i>
            </div>
            <h1 style={{ fontFamily: F.cursive, fontSize:'34px', color: C.primarySolid, lineHeight:1.1 }}>LittleLove</h1>
            <p style={{ fontFamily: F.brand, fontSize:'11px', letterSpacing:'0.25em', color: C.txtFad, textTransform:'uppercase', fontWeight:600, marginTop:'2px' }}>
              Personal Music Space
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Nhập email của bạn"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Mật Khẩu</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>

            {loginErr && <p className="text-xs font-semibold text-red-500">{loginErr}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] mt-2 cursor-pointer"
              style={{ background: C.primary, boxShadow:`0 6px 20px ${C.primaryGlow}` }}
            >
              {loggingIn ? <i className="ri-loader-4-line animate-spin text-lg"></i> : <i className="ri-key-2-line text-lg"></i>}
              Đăng Nhập Nghe Nhạc
            </button>
          </form>

          {/* Back to landing */}
          <button
            onClick={() => setPage('landing')}
            className="mt-4 w-full text-center text-xs py-2 rounded-xl transition hover:opacity-70 cursor-pointer"
            style={{ color: C.txtFad }}
          >
            ← Quay lại trang chủ
          </button>

          <p className="text-center text-[11px] mt-3" style={{ color: C.txtFad }}>
            ✦ Aura Music • Personal Edition ✦
          </p>
        </div>
      </div>
    );
  }




  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden" style={{ background: C.bg, fontFamily: F.body }}>
      <audio id="silent-audio" src="/silent.mp3" loop preload="auto" style={{ display: 'none' }}></audio>
      <div id="yt-player" className="fixed top-0 left-0 pointer-events-none z-[-50]" style={{ width: '300px', height: '300px', opacity: 1 }} />

      {/* ── TOP ROW: sidebar + main ─────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">

      {/* ── SIDEBAR ─────────────────────────────── */}
      {/* Overlay for mobile drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside 
        className={`fixed md:relative z-50 w-64 h-full flex flex-col gap-5 p-6 shrink-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`} 
        style={{ ...glass, borderRight: `1.5px solid ${C.border}`, borderTop:'none', borderBottom:'none', borderLeft:'none', background: C.surface }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
            <i className={`ri-disc-fill text-[22px] text-white ${playing?'spin-slow':''}`}></i>
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: F.cursive, fontSize:'28px', color: C.primarySolid, lineHeight:1.1 }}>LittleLove</span>
            <span style={{ fontFamily: F.brand, fontSize:'10px', letterSpacing:'0.25em', color: C.txtFad, textTransform:'uppercase', fontWeight:600 }}>Personal Music Space</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <p style={{ fontFamily: F.brand, fontSize:'11px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: C.txtFad, padding:'0 12px', marginBottom:'4px' }}>Menu</p>
          {[
            { key:'home',      icon:'ri-home-heart-line', label:'Trang chủ' },
            { key:'library',   icon:'ri-music-2-line',    label:'Thư viện'  },
            { key:'favorites', icon:'ri-heart-3-line',    label:'Yêu thích', badge: favs.length },
          ].map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left shrink-0"
                style={active
                  ? { background: C.tag, color: C.txt, border:`1.5px solid ${C.border}`, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }
                  : { color: C.txtSub, border:'1.5px solid transparent' }
                }
              >
                <i className={`${t.icon} text-base`}></i>
                {t.label}
                {t.badge !== undefined && (
                  <span className="ml-auto text-[11px] font-bold text-white px-2 py-0.5 rounded-full" style={{ background: C.primarySolid }}>{t.badge}</span>
                )}
              </button>
            );
          })}

          <div className="mt-4 mb-2 flex items-center justify-between px-3">
            <p style={{ fontFamily: F.brand, fontSize:'11px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: C.txtFad }}>Danh sách phát</p>
            <button onClick={() => setPlaylistModal(true)} title="Tạo Playlist"
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: C.tag, color: C.txt, border: `1px solid ${C.border}` }}>
              <i className="ri-add-line text-xs"></i>
            </button>
          </div>

          {playlists.map(p => {
            const tabKey = `playlist_${p._id}`;
            const active = tab === tabKey;
            return (
              <button key={p._id} onClick={() => { setTab(tabKey); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 text-left shrink-0"
                style={active
                  ? { background: C.tag, color: C.txt, border:`1.5px solid ${C.border}`, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }
                  : { color: C.txtSub, border:'1.5px solid transparent' }
                }
              >
                <i className={active ? "ri-folder-music-fill text-base" : "ri-folder-music-line text-base"} style={{ color: active ? C.primarySolid : C.txtFad }}></i>
                <span className="truncate flex-1">{p.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer card */}
        <div className="rounded-2xl p-4 text-center" style={{ background: C.tag, border:`1px solid ${C.border}` }}>
          <div className="text-2xl mb-1">🕊️</div>
          <p style={{ fontFamily: F.cursive, fontSize:'17px', color: C.primarySolid }}>Music soothes the soul</p>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="min-h-[70px] pt-3 md:min-h-[66px] md:pt-0 px-2 md:px-8 flex items-center justify-between shrink-0 relative gap-2 md:gap-3" style={{ background: C.surface, backdropFilter:'blur(18px)', borderBottom:`1.5px solid ${C.border}`, paddingSafeArea: 'env(safe-area-inset-top)' }}>
          
          <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none">
            {/* Mobile Hamburger Menu */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1 -ml-1 text-lg rounded-lg" style={{ color: C.txt }}>
              <i className="ri-menu-line"></i>
            </button>

            {/* Search */}
            <div className="relative w-full max-w-[140px] sm:max-w-[180px] md:w-72 z-10">
              <i className="ri-search-line absolute left-3 top-2 text-xs md:text-sm md:left-3.5 md:top-2.5" style={{ color: C.txtFad }}></i>
              <input type="text" placeholder="Tìm kiếm..."
                value={query} onChange={e=>setQuery(e.target.value)}
                className="w-full py-1.5 md:py-2 pl-8 md:pl-10 pr-3 md:pr-4 text-xs md:text-sm rounded-full outline-none transition"
                style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>
          </div>

          {/* User Name slightly moved to the left from center - Hidden on mobile */}
          {user && (
            <div className="hidden md:flex absolute left-[45%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none items-center justify-center">
              <span className="text-3xl lg:text-4xl font-extrabold" style={{ color: C.primarySolid, fontFamily: F.cursive, textShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                {user.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 md:gap-3 z-10 shrink-0">
            {/* Add button */}
            <button onClick={()=>setAddModal(true)}
              className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-bold px-2 py-1.5 md:px-4 md:py-2 rounded-full text-white shadow-md transition-all hover:scale-105"
              style={{ background: C.primary, boxShadow:`0 4px 14px ${C.primaryGlow}` }}
            >
              <i className="ri-youtube-line text-sm md:text-base"></i> <span className="hidden md:inline">Thêm Nhạc</span>
            </button>

            {/* Profile & Theme Customization Button */}
            <button
              onClick={() => setProfileModal(true)}
              title="Tùy chỉnh Hồ Sơ & Màu Sắc Giao Diện"
              className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-semibold px-2 py-1.5 md:px-4 md:py-2 rounded-full transition-all shadow-sm hover:scale-105"
              style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
            >
              <i className="ri-palette-line text-sm md:text-base" style={{ color: C.primarySolid }}></i>
              <span className="hidden lg:inline">Giao Diện &amp; Profile</span>
            </button>

            {/* User Avatar & Name (Original Right Side) */}
            {user ? (
              <div
                onClick={() => setProfileModal(true)}
                className="flex items-center gap-1 md:gap-2.5 pl-1.5 md:pl-3 cursor-pointer group ml-0 md:ml-1"
                style={{ borderLeft:`1.5px solid ${C.border}` }}
                title="Bấm để chỉnh sửa Profile"
              >
                <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user.name} className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover group-hover:scale-105 transition" style={{ border:`2px solid ${C.borderSel}` }}
                />
                <div className="hidden md:flex flex-col leading-tight">
                  <span className="text-xs font-bold group-hover:underline" style={{ color: C.txt }}>{user.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.primarySolid }}>{user.role === 'admin' ? 'Admin ✦' : (user.email === 'unnull@gmail.com' ? 'admin' : 'Member')}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); logout(); }} title="Đăng xuất" className="p-1.5 md:p-2 rounded-full hover:scale-110 transition" style={{ color: C.txtFad }}>
                  <i className="ri-logout-box-r-line text-base hover:text-red-500 transition"></i>
                </button>
              </div>
            ) : (
              <button onClick={()=>setLoginModal(true)}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition"
                style={btn}
              >
                <i className="ri-lock-line"></i> <span className="hidden md:inline">Đăng Nhập</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 p-4 pt-8 md:p-7 md:pt-7 overflow-y-auto">

          {tab === 'home' ? (
            /* ── Hero Banner ─────────────────────── */
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-3xl p-6 md:p-8 mt-4 md:mt-0 shadow-sm min-h-[400px]"
              style={{ background: C.surface, border:`1.5px solid ${C.border}`, boxShadow:'0 8px 40px rgba(0,0,0,0.06)' }}
            >
              {/* Blobs */}
              <div className="absolute top-10 right-20 w-32 h-32 md:w-48 md:h-48 rounded-full pointer-events-none float-anim opacity-50"
                style={{ background:`radial-gradient(circle,${C.borderSel},transparent)` }} />
              <div className="absolute bottom-10 left-20 w-24 h-24 md:w-32 md:h-32 rounded-full pointer-events-none float-anim opacity-30"
                style={{ background:`radial-gradient(circle,${C.primarySolid},transparent)`, animationDelay:'1.5s' }} />

              <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold mb-4 md:mb-6"
                  style={{ background: C.tag, color: C.txt, border:`1px solid ${C.border}` }}>
                  <span style={{ fontFamily: F.cursive }} className="text-[16px] md:text-[18px]">✦ Không gian nhạc cá nhân ✦</span>
                </span>
                <h1 className="leading-tight mb-4 text-3xl md:text-[42px]" style={{ color: C.txt, fontFamily: F.heading, fontWeight:800 }}>
                  Thư giãn &amp; thưởng thức<br/>
                  <span className="text-4xl md:text-[48px]" style={{ fontFamily: F.cursive, color: C.primarySolid, lineHeight:1.4 }}>
                    từng giai điệu ✨
                  </span>
                </h1>
                <p className="text-sm md:text-base mb-6 md:mb-8 leading-relaxed max-w-md" style={{ color: C.txtSub }}>
                  Trang nhạc được tạo riêng cho bạn — khám phá, tạo danh sách phát và đắm chìm vào không gian âm nhạc không giới hạn.
                </p>
                <button onClick={() => setTab('library')}
                  className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all shadow-lg hover:scale-105 hover:-translate-y-1"
                  style={{ background: C.primary, boxShadow:`0 6px 20px ${C.primaryGlow}` }}
                >
                  <i className="ri-music-2-line text-xl"></i> Khám Phá Thư Viện
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── Section heading ─────────────────── */}
              <div className="flex items-center gap-3 mb-4">
                <h2 style={{ color: C.txt, fontFamily: F.heading, fontSize:'22px', fontWeight:700 }}>
                  {tab === 'favorites' ? '🤍 Yêu Thích' : activePlaylist ? `✨ ${activePlaylist.name}` : '✨ Thư Viện Nhạc'}
                </h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.tag, color: C.tagTxt, border:`1px solid ${C.tagBd}` }}>
                  {list.length} bài
                </span>
                {activePlaylist && (
                  <button onClick={() => handleDeletePlaylist(activePlaylist._id)} className="ml-auto text-xs px-3 py-1.5 rounded-full font-bold transition flex items-center"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                    <i className="ri-delete-bin-line mr-1"></i> Xóa Playlist
                  </button>
                )}
              </div>

              {/* ── Song list ───────────────────────── */}
          <div className="flex flex-col gap-2">
            {list.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">🕊️</div>
                <p className="text-sm font-semibold" style={{ color: C.txtFad }}>Chưa có bài hát nào~</p>
              </div>
            ) : list.map((song, i) => {
              const sel = track?.id === song.id;
              return (
                <div key={song.id} onClick={()=>play(song)}
                  className="flex items-center p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200 group gap-2 md:gap-3"
                  style={{
                    background: sel ? C.tag : C.surface,
                    border: `1.5px solid ${sel ? C.borderSel : 'transparent'}`,
                    boxShadow: sel ? '0 4px 18px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <span className="hidden md:flex justify-center items-center text-sm font-bold w-8 shrink-0" style={{ color: C.txtFad }}>
                    {sel && playing
                      ? <i className="ri-volume-up-fill animate-pulse" style={{ color: C.primarySolid }}></i>
                      : i + 1
                    }
                  </span>
                  <img src={song.thumbnail} alt={song.title}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover shrink-0"
                    style={{ border:`2px solid ${sel ? C.border : 'transparent'}` }}
                  />
                  <div className="flex flex-col flex-1 min-w-0 pr-1 md:pr-2">
                    <span className="text-xs md:text-sm font-bold truncate" style={{ color: sel ? C.primarySolid : C.txt }}>{song.title}</span>
                    <span className="text-[10px] md:text-xs truncate" style={{ color: C.txtSub }}>{song.artist}</span>
                  </div>
                  <span className="hidden sm:block text-xs text-right shrink-0 w-12" style={{ color: C.txtFad }}>{song.duration}</span>
                  
                  <div className="flex justify-end items-center gap-1 shrink-0" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setSongToAdd(song)} title="Thêm vào playlist" 
                      className="p-1.5 md:p-2 rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                      style={{ color: C.txtFad }}
                      onMouseEnter={e => e.currentTarget.style.color=C.primarySolid}
                      onMouseLeave={e => e.currentTarget.style.color=C.txtFad}>
                      <i className="ri-play-list-add-line text-sm md:text-base"></i>
                    </button>
                    <button onClick={()=>toggleFav(song.id)} className="p-1.5 md:p-2 rounded-full transition active:scale-95"
                      style={{ color: favs.includes(song.id) ? C.primarySolid : C.txtFad }}>
                      <i className={favs.includes(song.id) ? 'ri-heart-fill text-sm md:text-base' : 'ri-heart-line text-sm md:text-base'}></i>
                    </button>
                    <button
                      onClick={() => {
                        if (activePlaylist) {
                          handleRemoveFromPlaylist(activePlaylist._id, song.id);
                        } else {
                          if (window.confirm(`Xóa "${song.title}" khỏi thư viện?`)) deleteSong(song.id);
                        }
                      }}
                      title={activePlaylist ? "Xóa khỏi playlist" : "Xóa bài hát"}
                      className="p-1.5 md:p-2 rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95"
                      style={{ color: C.txtFad }}
                      onMouseEnter={e => e.currentTarget.style.color='#f43f5e'}
                      onMouseLeave={e => e.currentTarget.style.color=C.txtFad}
                    >
                      <i className={activePlaylist ? "ri-close-line text-base md:text-lg" : "ri-delete-bin-6-line text-sm md:text-base"}></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          </>
          )}
        </div>
      </main>

      </div>{/* ── END TOP ROW (sidebar + main) ── */}

      {/* ── PROFILE & THEME CUSTOMIZATION MODAL ───────────── */}
      {profileModal && (
        <div className="fixed inset-0 flex items-end justify-center z-[60] px-4 pb-[96px] pt-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setProfileModal(false); }}>
          <div className="w-full max-w-lg rounded-3xl p-7 shadow-2xl overflow-y-auto"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, color: C.txt, maxHeight:'calc(100vh - 120px)' }}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1.5px solid ${C.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: C.primary }}>
                  <i className="ri-palette-fill text-xl text-white"></i>
                </div>
                <div>
                  <h3 style={{ fontFamily: F.heading, fontSize:'22px', fontWeight:700, color: C.txt, lineHeight:1.2 }}>
                    Chỉnh Sửa Hồ Sơ &amp; Giao Diện
                  </h3>
                  <p className="text-xs" style={{ color: C.txtSub }}>Tùy biến tên, avatar và bảng màu theo ý thích</p>
                </div>
              </div>
              <button onClick={()=>setProfileModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.tag, color: C.txtFad }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProfileAndTheme} className="flex flex-col gap-6">
              
              {/* SECTION 1: PROFILE EDIT */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: C.primarySolid }}>
                  <i className="ri-user-3-line text-sm"></i> Hồ Sơ Chủ Sở Hữu
                </h4>

                {/* Avatar Preview & URL / File Input */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                  <img
                    src={editAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover shrink-0 shadow-md"
                    style={{ border: `3px solid ${C.borderSel}` }}
                  />
                  <div className="flex flex-col flex-1 gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold" style={{ color: C.txtSub }}>Ảnh đại diện</label>
                      <button
                        type="button"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg text-white shadow-xs hover:opacity-90 transition cursor-pointer"
                        style={{ background: C.primary }}
                      >
                        <i className="ri-folder-image-line"></i> Chọn từ máy
                      </button>
                      <input
                        type="file"
                        ref={avatarFileInputRef}
                        onChange={handleAvatarFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh tại đây (https://...)"
                      value={editAvatar}
                      onChange={e => setEditAvatar(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs outline-none"
                      style={{ background: C.isDark ? '#0f172a' : '#fff', border: `1px solid ${C.border}`, color: C.txt }}
                    />
                  </div>
                </div>

                {/* Quick Avatar Presets */}
                <div>
                  <span className="block text-[11px] font-semibold mb-2" style={{ color: C.txtFad }}>Chọn avatar gợi ý nhanh:</span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {PRESET_AVATARS.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Preset ${idx}`}
                        onClick={() => setEditAvatar(url)}
                        className={`w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition ${editAvatar === url ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{ border: `2px solid ${editAvatar === url ? C.primarySolid : C.border}` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Display Name Input */}
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Tên Hiển Thị</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Nhập tên hiển thị của bạn..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.isDark ? '#0f172a' : C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                    required
                  />
                </div>
              </div>

              {/* SECTION 2: THEME COLOR SELECTION */}
              <div className="flex flex-col gap-4 pt-4" style={{ borderTop: `1.5px solid ${C.border}` }}>
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: C.primarySolid }}>
                  <i className="ri-palette-line text-sm"></i> Tùy Chỉnh Màu Web (Theme)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {Object.values(THEMES).map(t => {
                    const isSelected = themeKey === t.key;
                    return (
                      <div
                        key={t.key}
                        onClick={() => setThemeKey(t.key)}
                        className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border"
                        style={{
                          background: isSelected ? t.tag : (C.isDark ? '#0f172a' : '#fff'),
                          borderColor: isSelected ? t.primarySolid : C.border,
                          boxShadow: isSelected ? `0 4px 14px ${t.primaryGlow}` : 'none'
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm shrink-0"
                          style={{ background: t.primary, color: '#fff' }}
                        >
                          {t.icon}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-xs font-bold truncate" style={{ color: isSelected ? t.primarySolid : C.txt }}>
                            {t.name}
                          </span>
                          <span className="text-[10px]" style={{ color: C.txtFad }}>{isSelected ? '✓ Đang chọn' : 'Bấm để đổi'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex gap-3 pt-3 mt-2" style={{ borderTop: `1.5px solid ${C.border}` }}>
                <button
                  type="button"
                  onClick={() => setProfileModal(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition"
                  style={btn}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}
                >
                  <i className="ri-check-line text-lg"></i>
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LOGIN MODAL ─────────────────────────── */}
      {loginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"
                style={{ background: C.primary }}>
                <i className="ri-heart-lock-fill text-3xl text-white"></i>
              </div>
              <h2 style={{ fontFamily: F.heading, fontSize:'26px', fontWeight:700, color: C.txt, marginBottom:'4px' }}>Chào mừng trở lại</h2>
              <p style={{ fontFamily: F.cursive, fontSize:'18px', color: C.primarySolid }}>your personal music haven 🕊️</p>
            </div>

            <div className="rounded-2xl p-3.5 mb-5 flex items-start gap-2.5"
              style={{ background: C.tag, border:`1px solid ${C.border}` }}>
              <i className="ri-information-fill text-sm mt-0.5" style={{ color: C.primarySolid }}></i>
              <p className="text-xs leading-relaxed" style={{ color: C.txtSub }}>
                Đây là trang cá nhân. <strong style={{ color: C.txt }}>Đăng ký công khai đã bị đóng</strong> — chỉ chủ sở hữu mới có thể đăng nhập.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
              {[
                { label:'Email', type:'email', val: email, set: setEmail },
                { label:'Mật Khẩu', type:'password', val: pwd,   set: setPwd   },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                  />
                </div>
              ))}
              {loginErr && <p className="text-xs font-semibold text-red-500">{loginErr}</p>}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={()=>setLoginModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition" style={btn}>
                  Hủy
                </button>
                <button type="submit" disabled={loggingIn}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: C.primary, boxShadow:`0 6px 18px ${C.primaryGlow}` }}>
                  {loggingIn ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-login-box-line"></i>}
                  Đăng Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD SONG MODAL ─────────────────────── */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setAddModal(false); setAddErr(''); }}}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2" style={{ fontFamily: F.heading, fontSize:'20px', fontWeight:700, color: C.txt }}>
                <i className="ri-music-fill" style={{ color: C.primarySolid }}></i> Thêm Nhạc
              </h3>
              <button onClick={() => { setAddModal(false); setAddErr(''); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.tag, color: C.txtFad }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Source Tabs */}
            <div className="flex gap-2 mb-5 p-1 rounded-2xl" style={{ background: C.tag }}>
              <button
                onClick={() => { setAddTab('youtube'); setAddErr(''); }}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={addTab === 'youtube'
                  ? { background: C.primary, color:'#fff', boxShadow:`0 2px 12px ${C.primaryGlow}` }
                  : { color: C.txtSub }}
              >
                <i className="ri-youtube-fill"></i> Bài Hát
              </button>
              <button
                onClick={() => { setAddTab('spotify'); setAddErr(''); }}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={addTab === 'spotify'
                  ? { background:'#1DB954', color:'#fff', boxShadow:'0 2px 12px rgba(29,185,84,0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-spotify-fill"></i> Spotify
              </button>
              <button
                onClick={() => { setAddTab('playlist'); setAddErr(''); }}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={addTab === 'playlist'
                  ? { background: '#f59e0b', color:'#fff', boxShadow:'0 2px 12px rgba(245, 158, 11, 0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-play-list-2-fill"></i> Playlist (YT)
              </button>
            </div>

            {/* YouTube form */}
            {addTab === 'youtube' && (
              <form onSubmit={addSong} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Đường dẫn YouTube</label>
                  <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={ytUrl} onChange={e=>setYtUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                    autoFocus
                  />
                </div>
                {addErr && <p className="text-xs font-semibold text-red-500">{addErr}</p>}
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => { setAddModal(false); setAddErr(''); }}
                    className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold" style={btn}>
                    Hủy
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg whitespace-nowrap"
                    style={{ background: C.primary, boxShadow:`0 6px 18px ${C.primaryGlow}` }}>
                    {adding ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-add-line"></i>}
                    Thêm &amp; Phát
                  </button>
                </div>
              </form>
            )}

            {/* Spotify form */}
            {addTab === 'spotify' && (
              <form onSubmit={addSpotify} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Đường dẫn Spotify (Bài hát / Playlist)</label>
                  <input type="text" placeholder="https://open.spotify.com/..." value={spotifyUrl} onChange={e=>setSpotifyUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                    autoFocus
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: C.txtFad }}>
                    ℹ️ Copy link bài hát hoặc playlist từ Spotify → chia sẻ → "Copy link"
                  </p>
                </div>
                {addErr && <p className="text-xs font-semibold text-red-500">{addErr}</p>}
                <div className="p-3 rounded-xl text-xs" style={{ background: C.tag, border:`1px solid ${C.border}`, color: C.txtSub }}>
                  <i className="ri-information-line mr-1"></i>
                  Spotify player sẽ hiện trực tiếp — cần tài khoản Spotify để phát toàn bộ.
                </div>
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => { setAddModal(false); setAddErr(''); }}
                    className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold" style={btn}>
                    Hủy
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg whitespace-nowrap"
                    style={{ background:'#1DB954', boxShadow:'0 6px 18px rgba(29,185,84,0.35)' }}>
                    {adding ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-spotify-fill"></i>}
                    Thêm vào Thư Viện
                  </button>
                </div>
              </form>
            )}

            {/* Playlist form */}
            {addTab === 'playlist' && (
              <form onSubmit={addYouTubePlaylist} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Đường dẫn Playlist YouTube</label>
                  <input type="text" placeholder="https://www.youtube.com/playlist?list=..." value={playlistUrl} onChange={e=>setPlaylistUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                    autoFocus
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: C.txtFad }}>
                    ℹ️ Tự động quét toàn bộ bài hát trong Playlist.
                  </p>
                </div>
                {addErr && <p className="text-xs font-semibold text-red-500">{addErr}</p>}
                <div className="flex gap-3 mt-1">
                  <button type="button" onClick={() => { setAddModal(false); setAddErr(''); }}
                    className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold" style={btn}>
                    Hủy
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg whitespace-nowrap"
                    style={{ background: '#f59e0b', boxShadow: '0 6px 18px rgba(245, 158, 11, 0.35)' }}>
                    {adding ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-play-list-add-line"></i>}
                    Thêm Toàn Bộ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE PLAYLIST MODAL ─────────────────────── */}
      {playlistModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setPlaylistModal(false); }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }}>
            <h3 className="flex items-center gap-2 mb-5" style={{ fontFamily: F.heading, fontSize:'20px', fontWeight:700, color: C.txt }}>
              <i className="ri-play-list-add-fill" style={{ color: C.primarySolid }}></i> Tạo Playlist Mới
            </h3>
            
            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Tên danh sách phát</label>
                <input type="text" placeholder="Nhạc chill cuối tuần..." value={newPlaylistName} onChange={e=>setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                  autoFocus required
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setPlaylistModal(false)}
                  className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold" style={btn}>
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: C.primary, boxShadow:`0 6px 18px ${C.primaryGlow}` }}>
                  Tạo mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD TO PLAYLIST MODAL ─────────────────────── */}
      {songToAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSongToAdd(null); }}>
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }}>
            <h3 className="mb-4" style={{ fontFamily: F.heading, fontSize:'18px', fontWeight:700, color: C.txt }}>
              Thêm vào danh sách phát
            </h3>
            
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {playlists.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: C.txtSub }}>Bạn chưa có playlist nào.</p>
              ) : playlists.map(p => {
                const inPlaylist = p.songs.includes(songToAdd.id);
                return (
                    <button key={p._id} onClick={() => inPlaylist ? handleRemoveFromPlaylist(p._id, songToAdd.id) : handleAddToPlaylist(p._id, songToAdd.id)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:opacity-80 active:scale-[0.98] active:opacity-60"
                    style={{ background: C.tag, border:`1px solid ${inPlaylist ? C.primarySolid : C.border}` }}>
                    <span className="text-sm font-semibold truncate" style={{ color: inPlaylist ? C.primarySolid : C.txt }}>{p.name}</span>
                    <i className={inPlaylist ? "ri-check-line text-lg" : "ri-add-line text-lg"} style={{ color: inPlaylist ? C.primarySolid : C.txtSub }}></i>
                  </button>
                );
              })}
            </div>
            
            <button onClick={() => setSongToAdd(null)}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold" style={btn}>
              Đóng
            </button>
          </div>
        </div>
      )}


      {/* ── BOTTOM PLAYER ─────────────────────── */}
      <footer
        className="w-full flex flex-col md:flex-row items-center px-2 md:px-8 justify-center md:justify-between shrink-0 z-50 transition-all h-auto md:h-[88px] py-2.5 md:py-0 gap-2.5 md:gap-0"
        style={{
          background: C.surface,
          backdropFilter: 'blur(24px)',
          borderTop: `1.5px solid ${C.border}`,
          boxShadow: '0 -6px 28px rgba(0,0,0,0.06)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)'
        }}>

        {/* Track Info */}
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-64 md:flex-none min-w-0 justify-start">
          {track ? (
            <>
              <div className="relative shrink-0">
                <img src={track.thumbnail} alt={track.title}
                  className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl object-cover"
                  style={{ border:`2px solid ${C.border}`, boxShadow:'0 4px 14px rgba(0,0,0,0.1)' }}
                />
                {playing && (
                  <div className="absolute inset-0 rounded-lg md:rounded-2xl flex items-center justify-center" style={{ background:'rgba(0,0,0,0.25)' }}>
                    <span className="flex gap-[1px] md:gap-0.5 items-end h-3 md:h-4">
                      {['100%','50%','75%'].map((h,i) => (
                        <span key={i} className="w-[1.5px] md:w-1 rounded-full animate-pulse text-white"
                          style={{ background: '#fff', height:h, animationDelay:`${i*0.2}s` }} />
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] md:text-sm font-bold truncate" style={{ color: C.txt }}>{track.title}</span>
                <span className="text-[9px] md:text-xs truncate" style={{ color: C.txtSub }}>{track.artist}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center" style={{ background: C.tag }}>
                <i className="ri-music-2-line text-sm md:text-xl" style={{ color: C.txtFad }}></i>
              </div>
              <span className="text-[9px] md:text-xs font-semibold" style={{ color: C.txtFad }}>Chưa chọn bài hát~</span>
            </div>
          )}
        </div>

        {/* Controls + Progress */}
        <div className="flex flex-col items-center gap-1.5 md:gap-1.5 w-full md:flex-1 max-w-lg md:px-6">
          <div className="flex items-center justify-between md:justify-center gap-1 md:gap-5 w-full px-4 md:px-0 order-2 md:order-1">
            <button onClick={random} title="Phát ngẫu nhiên" style={{ color: C.txtFad }}>
              <i className="ri-shuffle-line text-sm md:text-lg"></i>
            </button>

                {/* Repeat Mode Button */}
                <button
                  onClick={toggleRepeat}
                  title={
                    repeatMode === 'one'
                      ? 'Đang lặp 1 bài hát'
                      : repeatMode === 'all'
                      ? 'Đang lặp toàn bộ danh sách'
                      : 'Lặp lại: Tắt'
                  }
                  className="relative p-1 transition cursor-pointer"
                  style={{ color: repeatMode !== 'off' ? C.primarySolid : C.txtFad }}
                >
                  <i className={repeatMode === 'one' ? 'ri-repeat-2-line text-sm md:text-lg font-bold' : 'ri-repeat-line text-sm md:text-lg'}></i>
                  {repeatMode === 'one' && (
                    <span className="absolute -top-1 -right-1 text-[7px] md:text-[9px] font-black rounded-full w-2.5 h-2.5 md:w-3.5 md:h-3.5 flex items-center justify-center text-white shadow-xs"
                      style={{ background: C.primarySolid }}>
                      1
                    </span>
                  )}
                  {repeatMode === 'all' && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                      style={{ background: C.primarySolid }}>
                    </span>
                  )}
                </button>

                <button onClick={prevTrack} title="Bài trước" style={{ color: C.txtSub }}>
                  <i className="ri-skip-back-fill text-lg md:text-2xl"></i>
                </button>
                <button onClick={togglePlay}
                  title={playing ? 'Tạm dừng' : 'Phát'}
                  className="w-9 h-9 md:w-12 md:h-12 rounded-full text-white text-sm md:text-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  style={{ background: C.primary, boxShadow:`0 4px 18px ${C.primaryGlow}` }}>
                  <i className={playing ? 'ri-pause-fill' : 'ri-play-fill'}></i>
                </button>
                <button onClick={nextTrack} title="Bài tiếp" style={{ color: C.txtSub }}>
                  <i className="ri-skip-forward-fill text-lg md:text-2xl"></i>
                </button>
                <button onClick={()=>track&&toggleFav(track.id)} title="Yêu thích"
                  style={{ color: track&&favs.includes(track.id) ? C.primarySolid : C.txtFad }}>
                  <i className={track&&favs.includes(track.id) ? 'ri-heart-fill text-lg' : 'ri-heart-line'}></i>
                </button>
                <button onClick={cycleSleepTimer} title={sleepTimer ? `Hẹn giờ tắt: ${sleepTimer} phút (còn ${Math.ceil(sleepTimeLeft/60)} phút)` : 'Hẹn giờ tắt nhạc'}
                  className="relative p-1 transition cursor-pointer"
                  style={{ color: sleepTimer > 0 ? C.primarySolid : C.txtFad }}>
                  <i className={sleepTimer > 0 ? 'ri-timer-fill text-lg' : 'ri-timer-line text-lg'}></i>
                  {sleepTimer > 0 && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white shadow-xs"
                      style={{ background: C.primarySolid }}>
                      {sleepTimer}
                    </span>
                  )}
                </button>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-2 md:gap-3 w-full order-1 md:order-2 px-2 md:px-0">
                <span className="text-[10px] md:text-[11px] font-mono w-7 md:w-9 text-right shrink-0" style={{ color: C.txtFad }}>{fmt(curTime)}</span>
                <input type="range" min="0" max={dur||100} value={curTime} onChange={seek}
                  className="flex-1" style={{ accentColor: C.primarySolid }} />
                <span className="text-[11px] font-mono w-9 shrink-0" style={{ color: C.txtFad }}>{fmt(dur)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end gap-3 w-64 shrink-0">
          <button onClick={toggleMute} style={{ color: muted||vol===0 ? '#f43f5e' : C.txtFad }}>
            <i className={`text-lg ${muted||vol===0 ? 'ri-volume-mute-fill' : vol<50 ? 'ri-volume-down-fill' : 'ri-volume-up-fill'}`}></i>
          </button>
          <input type="range" min="0" max="100" value={muted?0:vol} onChange={changeVol}
            className="w-24" style={{ accentColor: C.primarySolid }} />
        </div>
      </footer>
    </div>
  );
}
