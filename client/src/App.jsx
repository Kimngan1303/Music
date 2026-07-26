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
    bg:          'linear-gradient(145deg,#fdf9f6 0%,#f9f3ee 50%,#fdf6f1 100%)',
    surface:     'rgba(255,253,251,0.88)',
    border:      '#eeddd1',
    borderSel:   '#d4b09a',
    txt:         '#7c5442',
    txtSub:      '#b08070',
    txtFad:      '#d9c4b8',
    primary:     'linear-gradient(135deg,#e8b8a2,#d9967c)',
    primarySolid:'#e8b8a2',
    primaryGlow: 'rgba(232,184,162,0.40)',
    tag:         '#fdf3ed',
    tagBd:       '#eeddd1',
    tagTxt:      '#a06040',
    btn:         'rgba(253,249,246,0.92)',
    btnBd:       '#eeddd1',
    btnTxt:      '#c8906a',
  },
  pink: {
    key: 'pink',
    name: 'Pastel Rose (Hồng Nhạt)',
    icon: '🌸',
    bg:          'linear-gradient(145deg,#fff5f9 0%,#fdeef5 50%,#fff8fb 100%)',
    surface:     'rgba(255,255,255,0.90)',
    border:      '#fad5e8',
    borderSel:   '#f4a8cc',
    txt:         '#8b4060',
    txtSub:      '#c97090',
    txtFad:      '#f0b8d0',
    primary:     'linear-gradient(135deg,#f5b8d0,#eda8c4)',
    primarySolid:'#f5b8d0',
    primaryGlow: 'rgba(245,184,208,0.45)',
    tag:         '#fff0f6',
    tagBd:       '#fad5e8',
    tagTxt:      '#b06080',
    btn:         '#fff5f9',
    btnBd:       '#fad5e8',
    btnTxt:      '#d488a8',
  },
  matcha: {
    key: 'matcha',
    name: 'Pastel Matcha (Xanh Trà Nhạt)',
    icon: '🌿',
    bg:          'linear-gradient(145deg,#f4faf4 0%,#ecf6ec 50%,#f6fbf6 100%)',
    surface:     'rgba(255,255,255,0.90)',
    border:      '#c8e6c8',
    borderSel:   '#9ed09e',
    txt:         '#3a6040',
    txtSub:      '#6a9e72',
    txtFad:      '#aad4ae',
    primary:     'linear-gradient(135deg,#a8d8a8,#8fc88f)',
    primarySolid:'#a8d8a8',
    primaryGlow: 'rgba(168,216,168,0.45)',
    tag:         '#f0faf0',
    tagBd:       '#c8e6c8',
    tagTxt:      '#4a8050',
    btn:         '#f4faf4',
    btnBd:       '#c8e6c8',
    btnTxt:      '#6aac72',
  },
  lavender: {
    key: 'lavender',
    name: 'Pastel Lavender (Tím Nhạt)',
    icon: '💜',
    bg:          'linear-gradient(145deg,#f7f4ff 0%,#f2eeff 50%,#f9f7ff 100%)',
    surface:     'rgba(255,255,255,0.90)',
    border:      '#e0d4f8',
    borderSel:   '#c4b0f0',
    txt:         '#5c4080',
    txtSub:      '#9070c0',
    txtFad:      '#c8b8e8',
    primary:     'linear-gradient(135deg,#c8b0e8,#b89cd8)',
    primarySolid:'#c8b0e8',
    primaryGlow: 'rgba(200,176,232,0.45)',
    tag:         '#f5f0ff',
    tagBd:       '#e0d4f8',
    tagTxt:      '#7858a8',
    btn:         '#f7f4ff',
    btnBd:       '#e0d4f8',
    btnTxt:      '#a888d0',
  },
  peach: {
    key: 'peach',
    name: 'Pastel Peach (Đào Nhạt)',
    icon: '🍑',
    bg:          'linear-gradient(145deg,#fff8f2 0%,#fef0e4 50%,#fffaf5 100%)',
    surface:     'rgba(255,255,255,0.90)',
    border:      '#fdd8bc',
    borderSel:   '#f8b898',
    txt:         '#7a4020',
    txtSub:      '#c07850',
    txtFad:      '#f0c0a0',
    primary:     'linear-gradient(135deg,#f8c4a0,#f4aa80)',
    primarySolid:'#f8c4a0',
    primaryGlow: 'rgba(248,196,160,0.45)',
    tag:         '#fff5ee',
    tagBd:       '#fdd8bc',
    tagTxt:      '#a85c30',
    btn:         '#fff8f2',
    btnBd:       '#fdd8bc',
    btnTxt:      '#d08860',
  },
  dark: {
    key: 'dark',
    name: 'Pastel Dusk (Hoàng Hôn)',
    icon: '🌙',
    bg:          'linear-gradient(145deg,#2a2540 0%,#221e38 50%,#2e2845 100%)',
    surface:     'rgba(48,42,68,0.90)',
    border:      '#4a4268',
    borderSel:   '#9b8fd4',
    txt:         '#ece8f8',
    txtSub:      '#c0b8e0',
    txtFad:      '#7870a8',
    primary:     'linear-gradient(135deg,#b8a8e8,#a090d8)',
    primarySolid:'#b8a8e8',
    primaryGlow: 'rgba(184,168,232,0.40)',
    tag:         '#3a3458',
    tagBd:       '#4a4268',
    tagTxt:      '#c0b0e8',
    btn:         '#3a3458',
    btnBd:       '#4a4268',
    btnTxt:      '#b8a8e8',
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
  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_songs');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_SONGS;
  });

  const [track,      setTrack]      = useState(null);
  const [playing,    setPlaying]    = useState(false);
  const [tab,        setTab]        = useState('home');
  const [favs,       setFavs]       = useState(() => {
    try {
      const saved = localStorage.getItem('aura_favs');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [query,      setQuery]      = useState('');
  const [curTime,    setCurTime]    = useState(0);
  const [dur,        setDur]        = useState(0);
  const [vol,        setVol]        = useState(80);
  const [muted,      setMuted]      = useState(false);
  const [addModal,   setAddModal]   = useState(false);
  const [ytUrl,      setYtUrl]      = useState('');
  const [adding,     setAdding]     = useState(false);
  const [addErr,     setAddErr]     = useState('');

  // User Auth & Profile State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      let userData = saved ? JSON.parse(saved) : {
        _id: 'admin-owner',
        name: 'Chủ sở hữu (Admin)',
        email: 'admin@auramusic.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'admin'
      };
      const customProfile = localStorage.getItem('aura_custom_profile');
      if (customProfile) {
        const cp = JSON.parse(customProfile);
        if (cp.name) userData.name = cp.name;
        if (cp.avatar) userData.avatar = cp.avatar;
      }
      return userData;
    } catch {
      return null;
    }
  });

  // Page routing: 'landing' | 'login' | 'app'
  // Always start at landing page on fresh visit
  const [page, setPage] = useState('landing');

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

  // Fetch songs from API if DB connected (otherwise use persisted songs)
  useEffect(() => {
    axios.get('/api/music').then(r => {
      if (r.data?.length) {
        const formatted = r.data.map(x => ({
          id: x._id || x.youtubeId, youtubeId: x.youtubeId, title: x.title, artist: x.artist,
          thumbnail: x.thumbnail || `https://img.youtube.com/vi/${x.youtubeId}/hqdefault.jpg`,
          duration: x.duration || '3:30'
        }));
        setSongs(formatted);
        localStorage.setItem('aura_songs', JSON.stringify(formatted));
      }
    }).catch(() => {});
  }, []);

  // Init YT Player
  useEffect(() => {
    const init = () => {
      if (yt.current || !window.YT?.Player) return;
      yt.current = new window.YT.Player('yt-player', {
        height:'0', width:'0', videoId:'',
        playerVars: { autoplay:1, controls:0, disablekb:1, fs:0, rel:0 },
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
                nextTrack();
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

  const play = trk => {
    setTrack(trk); setPlaying(true);
    yt.current?.loadVideoById?.(trk.youtubeId);
  };

  const togglePlay = () => {
    if (!track) { if (songs[0]) play(songs[0]); return; }
    if (playing) { yt.current?.pauseVideo?.(); setPlaying(false); }
    else         { yt.current?.playVideo?.();  setPlaying(true);  }
  };

  const nextTrack = () => {
    if (songs.length === 0) return;
    const i = songs.findIndex(s => s.id === track?.id);
    play(songs[(i + 1) % songs.length]);
  };

  const prevTrack = () => {
    if (songs.length === 0) return;
    const i = songs.findIndex(s => s.id === track?.id);
    play(songs[(i - 1 + songs.length) % songs.length]);
  };

  const random = () => {
    if (songs.length === 0) return;
    play(songs[Math.floor(Math.random() * songs.length)]);
  };

  const seek  = e => { const t = +e.target.value; setCurTime(t); yt.current?.seekTo?.(t, true); };
  const changeVol = e => { const v = +e.target.value; setVol(v); setMuted(v===0); yt.current?.setVolume?.(v); };
  const toggleMute = () => {
    if (muted) { setMuted(false); yt.current?.setVolume?.(vol||80); }
    else       { setMuted(true);  yt.current?.setVolume?.(0); }
  };

  const toggleFav = id => setFavs(p => {
    const updated = p.includes(id) ? p.filter(x=>x!==id) : [...p,id];
    localStorage.setItem('aura_favs', JSON.stringify(updated));
    return updated;
  });

  const deleteSong = id => {
    setSongs(p => {
      const updated = p.filter(s => s.id !== id);
      localStorage.setItem('aura_songs', JSON.stringify(updated));
      return updated;
    });
    setFavs(p => {
      const updated = p.filter(x => x !== id);
      localStorage.setItem('aura_favs', JSON.stringify(updated));
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
        try {
          const customProfile = localStorage.getItem('aura_custom_profile');
          if (customProfile) {
            const cp = JSON.parse(customProfile);
            if (cp.name) loggedInUser.name = cp.name;
            if (cp.avatar) loggedInUser.avatar = cp.avatar;
          }
        } catch (err) {}

        setUser(loggedInUser);
        localStorage.setItem('aura_user', JSON.stringify(loggedInUser));
        localStorage.setItem('aura_token', loggedInUser.token);
        setLoginModal(false);
        setPage('app');
      }
    } catch(err) { setLoginErr(err.response?.data?.message || 'Thông tin không chính xác.'); }
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
  const handleSaveProfileAndTheme = (e) => {
    e.preventDefault();
    if (user) {
      const updated = {
        ...user,
        name: editName.trim() || user.name,
        avatar: editAvatar.trim() || user.avatar
      };
      setUser(updated);
      localStorage.setItem('aura_custom_profile', JSON.stringify({ name: updated.name, avatar: updated.avatar }));
      localStorage.setItem('aura_user', JSON.stringify(updated));
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
      let s = { id:'s'+Date.now(), youtubeId:vid, title:'YouTube Song', artist:'YouTube Creator', thumbnail:`https://img.youtube.com/vi/${vid}/hqdefault.jpg`, duration:'3:30' };
      try { const o = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`); s.title = o.data?.title||s.title; s.artist = o.data?.author_name||s.artist; } catch {}
      setSongs(p => {
        const updated = [s, ...p];
        localStorage.setItem('aura_songs', JSON.stringify(updated));
        return updated;
      });
      setAddModal(false); setYtUrl(''); play(s);
    } catch(err) { setAddErr(err.message||'Lỗi không xác định.'); }
    finally { setAdding(false); }
  };

  const fmt = s => isNaN(s)||s<0 ? '0:00' : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  const list = songs
    .filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
    .filter(s => tab==='favorites' ? favs.includes(s.id) : true);

  const glass = { background: C.surface, backdropFilter: 'blur(20px)', border: `1.5px solid ${C.border}` };
  const btn   = { background: C.btn, color: C.btnTxt, border: `1.5px solid ${C.btnBd}` };

  // ── LANDING PAGE ──────────────────────────────────────────
  if (!user && page === 'landing') {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden flex flex-col" style={{ background: C.bg, fontFamily: F.body }}>
        <div id="yt-player" className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none" />

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
            <span style={{ fontFamily: F.cursive, fontSize:'26px', color: C.primarySolid, lineHeight:1 }}>AuraMusic</span>
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
              AuraMusic
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
            © 2024 AuraMusic · Personal Edition
          </p>
        </footer>
      </div>
    );
  }

  // ── FULLSCREEN LOGIN SCREEN ────────────────────────────────
  if (!user && page === 'login') {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-4 relative overflow-hidden" style={{ background: C.bg, fontFamily: F.body }}>
        <div id="yt-player" className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none" />

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
            <h1 style={{ fontFamily: F.cursive, fontSize:'34px', color: C.primarySolid, lineHeight:1.1 }}>AuraMusic</h1>
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
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: C.bg, fontFamily: F.body }}>
      <div id="yt-player" className="absolute -top-[9999px] -left-[9999px] opacity-0 pointer-events-none" />

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="w-60 flex flex-col gap-5 p-6 shrink-0" style={{ ...glass, borderRight: `1.5px solid ${C.border}`, borderTop:'none', borderBottom:'none', borderLeft:'none' }}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
            <i className={`ri-disc-fill text-[22px] text-white ${playing?'spin-slow':''}`}></i>
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: F.cursive, fontSize:'28px', color: C.primarySolid, lineHeight:1.1 }}>AuraMusic</span>
            <span style={{ fontFamily: F.brand, fontSize:'10px', letterSpacing:'0.25em', color: C.txtFad, textTransform:'uppercase', fontWeight:600 }}>Personal Music Space</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <p style={{ fontFamily: F.brand, fontSize:'11px', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color: C.txtFad, padding:'0 12px', marginBottom:'4px' }}>Menu</p>
          {[
            { key:'home',      icon:'ri-home-heart-line', label:'Trang chủ' },
            { key:'library',   icon:'ri-music-2-line',    label:'Thư viện'  },
            { key:'favorites', icon:'ri-heart-3-line',    label:'Yêu thích', badge: favs.length },
          ].map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={()=>setTab(t.key)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left"
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
        </nav>

        {/* Sidebar footer card */}
        <div className="rounded-2xl p-4 text-center" style={{ background: C.tag, border:`1px solid ${C.border}` }}>
          <div className="text-2xl mb-1">🕊️</div>
          <p style={{ fontFamily: F.cursive, fontSize:'17px', color: C.primarySolid }}>Music soothes the soul</p>
        </div>
      </aside>

      {/* ── MAIN ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden pb-24">

        {/* Header */}
        <header className="h-[66px] px-8 flex items-center justify-between shrink-0" style={{ background: C.surface, backdropFilter:'blur(18px)', borderBottom:`1.5px solid ${C.border}` }}>
          {/* Search */}
          <div className="relative w-72">
            <i className="ri-search-line absolute left-3.5 top-2.5 text-sm" style={{ color: C.txtFad }}></i>
            <input type="text" placeholder="Tìm bài hát, nghệ sĩ..."
              value={query} onChange={e=>setQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-sm rounded-full outline-none transition"
              style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Add button */}
            <button onClick={()=>setAddModal(true)}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full text-white shadow-md transition-all"
              style={{ background: C.primary, boxShadow:`0 4px 14px ${C.primaryGlow}` }}
            >
              <i className="ri-youtube-line text-base"></i> Thêm Nhạc
            </button>

            {/* Profile & Theme Customization Button */}
            <button
              onClick={() => setProfileModal(true)}
              title="Tùy chỉnh Hồ Sơ & Màu Sắc Giao Diện"
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all shadow-sm"
              style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
            >
              <i className="ri-palette-line text-base" style={{ color: C.primarySolid }}></i>
              <span>Giao Diện &amp; Profile</span>
            </button>

            {/* User Avatar & Name */}
            {user ? (
              <div
                onClick={() => setProfileModal(true)}
                className="flex items-center gap-2.5 pl-3 cursor-pointer group"
                style={{ borderLeft:`1.5px solid ${C.border}` }}
                title="Bấm để chỉnh sửa Profile"
              >
                <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={user.name} className="w-9 h-9 rounded-full object-cover group-hover:scale-105 transition" style={{ border:`2px solid ${C.borderSel}` }}
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold group-hover:underline" style={{ color: C.txt }}>{user.name}</span>
                  <span className="text-[10px] font-semibold uppercase" style={{ color: C.primarySolid }}>Admin ✦</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); logout(); }} title="Đăng xuất" className="p-2 rounded-full" style={{ color: C.txtFad }}>
                  <i className="ri-logout-box-r-line text-base"></i>
                </button>
              </div>
            ) : (
              <button onClick={()=>setLoginModal(true)}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition"
                style={btn}
              >
                <i className="ri-lock-line"></i> Đăng Nhập
              </button>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 p-7 overflow-y-auto">

          {/* ── Hero Banner ─────────────────────── */}
          <div className="relative rounded-3xl overflow-hidden mb-7 p-8"
            style={{ background: C.surface, border:`1.5px solid ${C.border}`, boxShadow:'0 8px 40px rgba(0,0,0,0.06)' }}
          >
            {/* Blobs */}
            <div className="absolute top-6 right-10 w-36 h-36 rounded-full pointer-events-none float-anim opacity-50"
              style={{ background:`radial-gradient(circle,${C.borderSel},transparent)` }} />
            <div className="absolute bottom-4 right-40 w-20 h-20 rounded-full pointer-events-none float-anim opacity-30"
              style={{ background:`radial-gradient(circle,${C.primarySolid},transparent)`, animationDelay:'1.5s' }} />

            <div className="relative z-10 max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: C.tag, color: C.txt, border:`1px solid ${C.border}` }}>
                <span style={{ fontFamily: F.cursive, fontSize:'16px' }}>✦ Không gian nhạc cá nhân ✦</span>
              </span>
              <h1 className="leading-tight mb-1" style={{ color: C.txt, fontFamily: F.heading, fontSize:'36px', fontWeight:800 }}>
                Thư giãn &amp; thưởng thức
              </h1>
              <p style={{ fontFamily: F.cursive, fontSize:'38px', color: C.primarySolid, marginBottom:'12px', lineHeight:1.3 }}>
                từng giai điệu ✨
              </p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: C.txtSub }}>
                Trang nhạc được tạo riêng cho bạn — chọn bài hát yêu thích hoặc thêm nhạc từ YouTube bất kỳ lúc nào.
              </p>
              <button onClick={random}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all shadow-lg"
                style={{ background: C.primary, boxShadow:`0 6px 20px ${C.primaryGlow}` }}
              >
                <i className="ri-shuffle-line text-lg"></i> Phát Ngẫu Nhiên
              </button>
            </div>
          </div>

          {/* ── Section heading ─────────────────── */}
          <div className="flex items-center gap-3 mb-4">
            <h2 style={{ color: C.txt, fontFamily: F.heading, fontSize:'22px', fontWeight:700 }}>
              {tab==='favorites' ? '🤍 Yêu Thích' : '🎵 Thư Viện Nhạc'}
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.tag, color: C.tagTxt, border:`1px solid ${C.tagBd}` }}>
              {list.length} bài
            </span>
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
                  className="grid items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 group"
                  style={{
                    gridTemplateColumns:'36px 52px 1fr 72px 96px',
                    background: sel ? C.tag : C.surface,
                    border: `1.5px solid ${sel ? C.borderSel : 'transparent'}`,
                    boxShadow: sel ? '0 4px 18px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <span className="flex justify-center items-center text-sm font-bold" style={{ color: C.txtFad }}>
                    {sel && playing
                      ? <i className="ri-volume-up-fill animate-pulse" style={{ color: C.primarySolid }}></i>
                      : i + 1
                    }
                  </span>
                  <img src={song.thumbnail} alt={song.title}
                    className="w-12 h-12 rounded-xl object-cover"
                    style={{ border:`2px solid ${sel ? C.border : 'transparent'}` }}
                  />
                  <div className="flex flex-col ml-3 overflow-hidden pr-2">
                    <span className="text-sm font-bold truncate" style={{ color: sel ? C.primarySolid : C.txt }}>{song.title}</span>
                    <span className="text-xs truncate" style={{ color: C.txtSub }}>{song.artist}</span>
                  </div>
                  <span className="text-xs text-right" style={{ color: C.txtFad }}>{song.duration}</span>
                  <div className="flex justify-end items-center gap-0.5" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>toggleFav(song.id)} className="p-2 rounded-full transition"
                      style={{ color: favs.includes(song.id) ? C.primarySolid : C.txtFad }}>
                      <i className={favs.includes(song.id) ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Xóa "${song.title}" khỏi thư viện?`)) deleteSong(song.id);
                      }}
                      title="Xóa bài hát"
                      className="p-2 rounded-full transition opacity-0 group-hover:opacity-100"
                      style={{ color: C.txtFad }}
                      onMouseEnter={e => e.currentTarget.style.color='#f43f5e'}
                      onMouseLeave={e => e.currentTarget.style.color=C.txtFad}
                    >
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── PROFILE & THEME CUSTOMIZATION MODAL ───────────── */}
      {profileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}>
          <div className="w-full max-w-lg rounded-3xl p-7 shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, color: C.txt }}>
            
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
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background:'rgba(0,0,0,0.4)', backdropFilter:'blur(14px)' }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border:`1.5px solid ${C.border}`, boxShadow:'0 20px 60px rgba(0,0,0,0.18)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2" style={{ fontFamily: F.heading, fontSize:'20px', fontWeight:700, color: C.txt }}>
                <i className="ri-youtube-fill text-red-400 text-2xl"></i> Thêm Nhạc YouTube
              </h3>
              <button onClick={()=>setAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.tag, color: C.txtFad }}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={addSong} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Đường dẫn YouTube</label>
                <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={ytUrl} onChange={e=>setYtUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: C.tag, border:`1.5px solid ${C.border}`, color: C.txt }}
                />
              </div>
              {addErr && <p className="text-xs font-semibold text-red-500">{addErr}</p>}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={()=>setAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={btn}>
                  Hủy
                </button>
                <button type="submit" disabled={adding}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: C.primary, boxShadow:`0 6px 18px ${C.primaryGlow}` }}>
                  {adding ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-add-line"></i>}
                  Thêm &amp; Phát
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BOTTOM PLAYER ─────────────────────── */}
      <footer className="fixed bottom-0 left-0 w-full h-[88px] flex items-center px-8 justify-between z-50"
        style={{ background: C.surface, backdropFilter:'blur(24px)', borderTop:`1.5px solid ${C.border}`, boxShadow:'0 -6px 28px rgba(0,0,0,0.06)' }}>

        {/* Track Info */}
        <div className="flex items-center gap-4 w-64 shrink-0">
          {track ? (
            <>
              <div className="relative shrink-0">
                <img src={track.thumbnail} alt={track.title}
                  className="w-14 h-14 rounded-2xl object-cover"
                  style={{ border:`2px solid ${C.border}`, boxShadow:'0 4px 14px rgba(0,0,0,0.1)' }}
                />
                {playing && (
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background:'rgba(0,0,0,0.25)' }}>
                    <span className="flex gap-0.5 items-end h-4">
                      {['100%','50%','75%'].map((h,i) => (
                        <span key={i} className="w-1 rounded-full animate-pulse text-white"
                          style={{ background: '#fff', height:h, animationDelay:`${i*0.2}s` }} />
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate" style={{ color: C.txt }}>{track.title}</span>
                <span className="text-xs truncate" style={{ color: C.txtSub }}>{track.artist}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C.tag }}>
                <i className="ri-music-2-line text-xl" style={{ color: C.txtFad }}></i>
              </div>
              <span className="text-xs font-semibold" style={{ color: C.txtFad }}>Chưa chọn bài hát~</span>
            </div>
          )}
        </div>

        {/* Controls + Progress */}
        <div className="flex flex-col items-center gap-1.5 flex-1 max-w-lg px-6">
          <div className="flex items-center gap-5">
            <button onClick={random} title="Phát ngẫu nhiên" style={{ color: C.txtFad }}>
              <i className="ri-shuffle-line text-lg"></i>
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
              <i className={repeatMode === 'one' ? 'ri-repeat-2-line text-lg font-bold' : 'ri-repeat-line text-lg'}></i>
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center text-white shadow-xs"
                  style={{ background: C.primarySolid }}>
                  1
                </span>
              )}
              {repeatMode === 'all' && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: C.primarySolid }}>
                </span>
              )}
            </button>

            <button onClick={prevTrack} title="Bài trước" style={{ color: C.txtSub }}>
              <i className="ri-skip-back-fill text-2xl"></i>
            </button>
            <button onClick={togglePlay}
              title={playing ? 'Tạm dừng' : 'Phát'}
              className="w-12 h-12 rounded-full text-white text-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              style={{ background: C.primary, boxShadow:`0 4px 18px ${C.primaryGlow}` }}>
              <i className={playing ? 'ri-pause-fill' : 'ri-play-fill'}></i>
            </button>
            <button onClick={nextTrack} title="Bài tiếp" style={{ color: C.txtSub }}>
              <i className="ri-skip-forward-fill text-2xl"></i>
            </button>
            <button onClick={()=>track&&toggleFav(track.id)} title="Yêu thích"
              style={{ color: track&&favs.includes(track.id) ? C.primarySolid : C.txtFad }}>
              <i className={track&&favs.includes(track.id) ? 'ri-heart-fill text-lg' : 'ri-heart-line'}></i>
            </button>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] font-mono w-9 text-right shrink-0" style={{ color: C.txtFad }}>{fmt(curTime)}</span>
            <input type="range" min="0" max={dur||100} value={curTime} onChange={seek}
              className="flex-1" style={{ accentColor: C.primarySolid }} />
            <span className="text-[11px] font-mono w-9 shrink-0" style={{ color: C.txtFad }}>{fmt(dur)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center justify-end gap-3 w-64 shrink-0">
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
