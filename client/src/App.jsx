import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BubbleCanvas from './components/BubbleCanvas';

// ─── Typography ──────────────────────────────────────────
const F = {
  heading: "'Playfair Display', Georgia, serif",
  brand: "'Cormorant Garamond', Georgia, serif",
  cursive: "'Great Vibes', cursive",
  body: "'DM Sans', sans-serif",
};

// ─── Pre-curated Theme Palettes (Mix-Color Animated + Pastel + Dark) ───────────────────
const THEMES = {
  // ── MIX MÀU ĐỘNG (Animated Gradients with Smooth Color Flow) ──
  aurora: {
    key: 'aurora',
    name: 'Cực Quang Aurora Flow',
    icon: '🌌',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #0d9488, #7c3aed, #db2777, #1e3a8a)',
    surface: 'rgba(15, 23, 42, 0.88)',
    border: 'rgba(168, 85, 247, 0.35)',
    borderSel: '#2dd4bf',
    txt: '#f0fdf4',
    txtSub: '#a7f3d0',
    txtFad: '#5eead4',
    primary: 'linear-gradient(135deg, #2dd4bf, #a855f7, #ec4899)',
    primarySolid: '#2dd4bf',
    primaryGlow: 'rgba(45, 212, 191, 0.45)',
    tag: 'rgba(15, 23, 42, 0.65)',
    tagBd: 'rgba(45, 212, 191, 0.35)',
    tagTxt: '#a7f3d0',
    btn: 'rgba(30, 41, 59, 0.85)',
    btnBd: 'rgba(168, 85, 247, 0.45)',
    btnTxt: '#2dd4bf',
    isDark: true
  },
  nebula: {
    key: 'nebula',
    name: 'Tinh Vân Cosmic Wave',
    icon: '🔮',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #3b0764, #701a75, #1e1b4b, #0284c7)',
    surface: 'rgba(24, 15, 46, 0.88)',
    border: 'rgba(217, 70, 239, 0.35)',
    borderSel: '#f472b6',
    txt: '#fdf4ff',
    txtSub: '#e879f9',
    txtFad: '#c084fc',
    primary: 'linear-gradient(135deg, #f472b6, #c084fc, #38bdf8)',
    primarySolid: '#f472b6',
    primaryGlow: 'rgba(244, 114, 182, 0.45)',
    tag: 'rgba(39, 21, 72, 0.65)',
    tagBd: 'rgba(244, 114, 182, 0.35)',
    tagTxt: '#f472b6',
    btn: 'rgba(48, 25, 87, 0.85)',
    btnBd: 'rgba(217, 70, 239, 0.45)',
    btnTxt: '#f472b6',
    isDark: true
  },
  sunset_mix: {
    key: 'sunset_mix',
    name: 'Hoàng Hôn Cyber Flow',
    icon: '🌆',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #7f1d1d, #9a3412, #581c87, #831843)',
    surface: 'rgba(44, 16, 25, 0.88)',
    border: 'rgba(249, 115, 22, 0.35)',
    borderSel: '#ff6b6b',
    txt: '#fff5f5',
    txtSub: '#ffc9c9',
    txtFad: '#ff8787',
    primary: 'linear-gradient(135deg, #ff6b6b, #f97316, #ec4899)',
    primarySolid: '#ff6b6b',
    primaryGlow: 'rgba(255, 107, 107, 0.45)',
    tag: 'rgba(60, 20, 30, 0.65)',
    tagBd: 'rgba(255, 107, 107, 0.35)',
    tagTxt: '#ff8787',
    btn: 'rgba(70, 25, 38, 0.85)',
    btnBd: 'rgba(249, 115, 22, 0.45)',
    btnTxt: '#ff6b6b',
    isDark: true
  },
  ocean_mix: {
    key: 'ocean_mix',
    name: 'Biển Sâu Dạ Quang',
    icon: '💧',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #0c4a6e, #0f766e, #1e3a8a, #0369a1)',
    surface: 'rgba(10, 30, 50, 0.88)',
    border: 'rgba(56, 189, 248, 0.35)',
    borderSel: '#38bdf8',
    txt: '#f0f9ff',
    txtSub: '#7dd3fc',
    txtFad: '#38bdf8',
    primary: 'linear-gradient(135deg, #38bdf8, #2dd4bf, #818cf8)',
    primarySolid: '#38bdf8',
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    tag: 'rgba(15, 42, 70, 0.65)',
    tagBd: 'rgba(56, 189, 248, 0.35)',
    tagTxt: '#7dd3fc',
    btn: 'rgba(20, 50, 80, 0.85)',
    btnBd: 'rgba(56, 189, 248, 0.45)',
    btnTxt: '#38bdf8',
    isDark: true
  },
  fire_mix: {
    key: 'fire_mix',
    name: 'Lửa Phượng Hoàng Blaze',
    icon: '🔥',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #7c2d12, #991b1b, #831843, #713f12)',
    surface: 'rgba(45, 18, 15, 0.88)',
    border: 'rgba(245, 158, 11, 0.35)',
    borderSel: '#fb923c',
    txt: '#fff7ed',
    txtSub: '#fed7aa',
    txtFad: '#fb923c',
    primary: 'linear-gradient(135deg, #f97316, #e11d48, #eab308)',
    primarySolid: '#fb923c',
    primaryGlow: 'rgba(251, 146, 60, 0.45)',
    tag: 'rgba(60, 24, 18, 0.65)',
    tagBd: 'rgba(251, 146, 60, 0.35)',
    tagTxt: '#fed7aa',
    btn: 'rgba(70, 30, 20, 0.85)',
    btnBd: 'rgba(245, 158, 11, 0.45)',
    btnTxt: '#fb923c',
    isDark: true
  },
  prisma_mix: {
    key: 'prisma_mix',
    name: 'Cầu Vồng Prisma Dynamic',
    icon: '🌈',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #4338ca, #6d28d9, #be185d, #b45309, #047857)',
    surface: 'rgba(20, 20, 35, 0.88)',
    border: 'rgba(244, 63, 94, 0.35)',
    borderSel: '#a855f7',
    txt: '#ffffff',
    txtSub: '#e2e8f0',
    txtFad: '#c084fc',
    primary: 'linear-gradient(135deg, #ff2a9d, #a855f7, #00f2fe, #f59e0b)',
    primarySolid: '#c084fc',
    primaryGlow: 'rgba(192, 132, 252, 0.45)',
    tag: 'rgba(30, 30, 50, 0.65)',
    tagBd: 'rgba(192, 132, 252, 0.35)',
    tagTxt: '#e2e8f0',
    btn: 'rgba(40, 40, 65, 0.85)',
    btnBd: 'rgba(168, 85, 247, 0.45)',
    btnTxt: '#c084fc',
    isDark: true
  },

  // ── TONE PASTEL NHẸ NHÀNG ──
  nude: {
    key: 'nude',
    name: 'Pastel Nude (Beige Kem)',
    icon: '🌾',
    category: 'pastel',
    bg: 'linear-gradient(145deg,#f5e8dc 0%,#ead7c5 50%,#f0e0d0 100%)',
    surface: 'rgba(252,245,238,0.92)',
    border: '#e2cbb8',
    borderSel: '#b8876a',
    txt: '#523223',
    txtSub: '#7a4d38',
    txtFad: '#a87d69',
    primary: 'linear-gradient(135deg,#d98a6c,#c47150)',
    primarySolid: '#d98a6c',
    primaryGlow: 'rgba(217,138,108,0.45)',
    tag: '#ebdacb',
    tagBd: '#d8bea9',
    tagTxt: '#6e3c23',
    btn: '#ebdccf',
    btnBd: '#d8bea9',
    btnTxt: '#a25c38',
  },
  pink: {
    key: 'pink',
    name: 'Pastel Rose (Hồng Nhạt)',
    icon: '🌸',
    category: 'pastel',
    bg: 'linear-gradient(145deg,#f9d0e2 0%,#f1bada 50%,#f6cadf 100%)',
    surface: 'rgba(255,242,248,0.92)',
    border: '#e89bbd',
    borderSel: '#cd588e',
    txt: '#4a122a',
    txtSub: '#7c2a4f',
    txtFad: '#aa5a81',
    primary: 'linear-gradient(135deg,#d95d90,#c74378)',
    primarySolid: '#d95d90',
    primaryGlow: 'rgba(217,93,144,0.45)',
    tag: '#f3c4d9',
    tagBd: '#e497b9',
    tagTxt: '#681c3c',
    btn: '#f4c7dc',
    btnBd: '#e497b9',
    btnTxt: '#a83d6a',
  },
  matcha: {
    key: 'matcha',
    name: 'Pastel Matcha (Trà Nhạt)',
    icon: '🌿',
    category: 'pastel',
    bg: 'linear-gradient(145deg,#cbe8cb 0%,#b9dfb9 50%,#c3e4c3 100%)',
    surface: 'rgba(240,250,240,0.92)',
    border: '#91c491',
    borderSel: '#509450',
    txt: '#143317',
    txtSub: '#2e5732',
    txtFad: '#588c5c',
    primary: 'linear-gradient(135deg,#58a658,#438a43)',
    primarySolid: '#58a658',
    primaryGlow: 'rgba(88,166,88,0.45)',
    tag: '#bee2be',
    tagBd: '#94c894',
    tagTxt: '#1f4823',
    btn: '#bee2be',
    btnBd: '#94c894',
    btnTxt: '#38733d',
  },
  lavender: {
    key: 'lavender',
    name: 'Pastel Lavender (Tím Nhạt)',
    icon: '💜',
    category: 'pastel',
    bg: 'linear-gradient(145deg,#d8c7ff 0%,#c7b2ff 50%,#d0bcff 100%)',
    surface: 'rgba(245,240,255,0.92)',
    border: '#b397ee',
    borderSel: '#7e52d6',
    txt: '#2a124a',
    txtSub: '#4f2b7d',
    txtFad: '#7d57ab',
    primary: 'linear-gradient(135deg,#8c57e6,#773fd3)',
    primarySolid: '#8c57e6',
    primaryGlow: 'rgba(140,87,230,0.45)',
    tag: '#cdbbf8',
    tagBd: '#b397ee',
    tagTxt: '#3d1a6d',
    btn: '#cfbefa',
    btnBd: '#b397ee',
    btnTxt: '#6d3ab8',
  },
  peach: {
    key: 'peach',
    name: 'Pastel Peach (Đào Nhạt)',
    icon: '🍑',
    category: 'pastel',
    bg: 'linear-gradient(145deg,#ffd2b3 0%,#fbc097 50%,#fecaa5 100%)',
    surface: 'rgba(255,246,238,0.92)',
    border: '#f5a36c',
    borderSel: '#db5e1d',
    txt: '#471905',
    txtSub: '#7a320e',
    txtFad: '#ab5d33',
    primary: 'linear-gradient(135deg,#e87333,#d45a17)',
    primarySolid: '#e87333',
    primaryGlow: 'rgba(232,115,51,0.45)',
    tag: '#fbc7a3',
    tagBd: '#f3a470',
    tagTxt: '#642407',
    btn: '#fbc7a3',
    btnBd: '#f3a470',
    btnTxt: '#9c4114',
  },

  // ── TONE TỐI & DARK ──
  dark: {
    key: 'dark',
    name: 'Pastel Dusk (Hoàng Hôn)',
    icon: '🌙',
    category: 'dark',
    bg: 'linear-gradient(145deg,#191328 0%,#100b1d 50%,#1d162f 100%)',
    surface: 'rgba(27,21,42,0.92)',
    border: '#4e4e70',
    borderSel: '#9377ed',
    txt: '#ffffff',
    txtSub: '#cfc6ed',
    txtFad: '#9184b9',
    primary: 'linear-gradient(135deg,#9b7fed,#8160e6)',
    primarySolid: '#9b7fed',
    primaryGlow: 'rgba(155,127,237,0.45)',
    tag: '#251c3b',
    tagBd: '#4e4070',
    tagTxt: '#bba7f5',
    btn: '#251c3b',
    btnBd: '#4e4070',
    btnTxt: '#9b7fed',
    isDark: true
  },
  midnight: {
    key: 'midnight',
    name: 'Midnight (Đen Huyền Bí)',
    icon: '🌑',
    category: 'dark',
    bg: 'linear-gradient(145deg,#0a0a0a 0%,#151515 50%,#000000 100%)',
    surface: 'rgba(20,20,20,0.90)',
    border: '#333333',
    borderSel: '#777777',
    txt: '#f5f5f5',
    txtSub: '#aaaaaa',
    txtFad: '#555555',
    primary: 'linear-gradient(135deg,#e0e0e0,#888888)',
    primarySolid: '#cccccc',
    primaryGlow: 'rgba(255,255,255,0.25)',
    tag: '#1a1a1a',
    tagBd: '#333333',
    tagTxt: '#cccccc',
    btn: '#1a1a1a',
    btnBd: '#333333',
    btnTxt: '#ffffff',
    isDark: true
  },
  ocean: {
    key: 'ocean',
    name: 'Deep Ocean (Đại Dương Xanh)',
    icon: '🌊',
    category: 'dark',
    bg: 'linear-gradient(145deg,#071a2b 0%,#0c253d 50%,#051524 100%)',
    surface: 'rgba(14,35,56,0.90)',
    border: '#1f4b75',
    borderSel: '#3d84c6',
    txt: '#e6f2ff',
    txtSub: '#99c2eb',
    txtFad: '#4d88c2',
    primary: 'linear-gradient(135deg,#5dade2,#2874a6)',
    primarySolid: '#5dade2',
    primaryGlow: 'rgba(93,173,226,0.40)',
    tag: '#102c47',
    tagBd: '#1f4b75',
    tagTxt: '#85b9e6',
    btn: '#102c47',
    btnBd: '#1f4b75',
    btnTxt: '#5dade2',
    isDark: true
  },
  cyberpunk: {
    key: 'cyberpunk',
    name: 'Cyberpunk (Neon Mix)',
    icon: '👾',
    category: 'dark',
    bg: 'linear-gradient(145deg,#12041c 0%,#1a0628 50%,#0d0214 100%)',
    surface: 'rgba(30,10,48,0.90)',
    border: '#4a1572',
    borderSel: '#e024b4',
    txt: '#faebff',
    txtSub: '#c88de0',
    txtFad: '#6a3b82',
    primary: 'linear-gradient(135deg,#ff2a9d,#00e5ff)',
    primarySolid: '#ff2a9d',
    primaryGlow: 'rgba(255,42,157,0.50)',
    tag: '#250c38',
    tagBd: '#4a1572',
    tagTxt: '#e024b4',
    btn: '#250c38',
    btnBd: '#4a1572',
    btnTxt: '#00e5ff',
    isDark: true
  }
};



// ─── Cyber Music Fish Component (Chú cá đeo tai nghe phát nhạc) ───
function CyberMusicFish() {
  const [notes, setNotes] = useState([
    { id: 1, symbol: '🎵', left: '15px', delay: '0s' },
    { id: 2, symbol: '🎶', left: '45px', delay: '0.9s' },
    { id: 3, symbol: '✨', left: '75px', delay: '1.8s' },
  ]);
  const [wiggle, setWiggle] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setWiggle(true);
    setTimeout(() => setWiggle(false), 800);
    const symbols = ['🎵', '🎶', '🎼', '✨', '💜'];
    const newNote = {
      id: Date.now(),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      left: `${Math.random() * 60 + 10}px`,
      delay: '0s'
    };
    setNotes(prev => [...prev.slice(-6), newNote]);
  };

  return (
    <div
      onClick={handleClick}
      className={`cyber-fish-container pointer-events-auto ${wiggle ? 'scale-125' : ''}`}
      title="Nhấp vào chú cá DJ đeo tai nghe! 🎧🐟"
    >
      {/* Floating Music Notes & Stars */}
      {notes.map(n => (
        <span
          key={n.id}
          className="cyber-music-note"
          style={{ left: n.left, top: '-5px', animationDelay: n.delay }}
        >
          {n.symbol}
        </span>
      ))}

      {/* SVG Glowing Cyber Fish with Headphones */}
      <svg viewBox="0 0 120 70" className="w-full h-full">
        <defs>
          {/* Neon Body Gradient */}
          <linearGradient id="cyberBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="85%" stopColor="#9d4edd" />
            <stop offset="100%" stopColor="#f72585" />
          </linearGradient>

          {/* Fin Translucent Neon Gradient */}
          <linearGradient id="cyberFin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 242, 254, 0.9)" />
            <stop offset="50%" stopColor="rgba(157, 78, 221, 0.7)" />
            <stop offset="100%" stopColor="rgba(247, 37, 133, 0.35)" />
          </linearGradient>

          {/* Headphone Metallic Gradient */}
          <linearGradient id="headphoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7209b7" />
            <stop offset="50%" stopColor="#3a0ca3" />
            <stop offset="100%" stopColor="#4cc9f0" />
          </linearGradient>
        </defs>

        {/* Tail Fin */}
        <g className="cyber-fish-tail">
          <path d="M 24 35 C 6 18, 2 5, 0 22 C -2 35, 2 48, 0 52 C 6 65, 24 52, 24 35 Z" fill="url(#cyberFin)" stroke="#00f2fe" strokeWidth="0.8" />
          <path d="M 22 35 C 10 25, 6 15, 3 28 C 6 42, 10 48, 22 35 Z" fill="rgba(255, 255, 255, 0.4)" />
        </g>

        {/* Side Fin */}
        <path className="cyber-fish-fin" d="M 52 38 C 45 52, 32 55, 42 40 Z" fill="url(#cyberFin)" stroke="#f72585" strokeWidth="0.8" />

        {/* Top Dorsal Fin */}
        <path d="M 40 22 C 52 10, 70 14, 65 24 Z" fill="url(#cyberFin)" stroke="#00f2fe" strokeWidth="0.8" />

        {/* Fish Main Body */}
        <path
          d="M 20 35 C 28 16, 68 15, 95 32 C 102 35, 102 37, 95 40 C 68 56, 28 54, 20 35 Z"
          fill="url(#cyberBody)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.2"
        />

        {/* Glowing Circuit Scales Lines */}
        <path d="M 42 28 Q 48 35 42 42" stroke="rgba(0, 242, 254, 0.7)" strokeWidth="1.2" fill="none" />
        <path d="M 54 26 Q 60 35 54 44" stroke="rgba(247, 37, 133, 0.7)" strokeWidth="1.2" fill="none" />
        <path d="M 66 28 Q 72 35 66 42" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" fill="none" />

        {/* Belly Glow */}
        <path d="M 30 38 C 45 46, 75 44, 90 37 C 75 49, 45 49, 30 38 Z" fill="rgba(255, 255, 255, 0.35)" />

        {/* Cute Sparkling Eye */}
        <circle cx="86" cy="31" r="5" fill="#0f0c29" stroke="#00f2fe" strokeWidth="1" />
        <circle cx="88" cy="29" r="2" fill="#ffffff" />
        <circle cx="84.5" cy="33" r="1" fill="#4cc9f0" />

        {/* Cute Pink Cheek Blush */}
        <ellipse cx="90" cy="38" rx="3.5" ry="2" fill="rgba(247, 37, 133, 0.6)" />

        {/* 🎧 NEON MUSIC HEADPHONES OVER HEAD */}
        {/* Headphone Band */}
        <path
          d="M 76 22 C 78 12, 92 12, 96 24"
          fill="none"
          stroke="url(#headphoneGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Left Earcup */}
        <g>
          <rect x="73" y="20" width="7" height="15" rx="3.5" fill="#f72585" stroke="#ffffff" strokeWidth="1" />
          <circle cx="76.5" cy="27.5" r="2" fill="#00f2fe" />
        </g>

        {/* Right Earcup (over ear/head) */}
        <g>
          <rect x="92" y="21" width="7" height="15" rx="3.5" fill="#4cc9f0" stroke="#ffffff" strokeWidth="1" />
          <circle cx="95.5" cy="28.5" r="2" fill="#f72585" />
        </g>

        {/* Equalizer frequency glow on headphones */}
        <line x1="70" y1="27" x2="66" y2="27" stroke="#00f2fe" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="24" x2="64" y2="24" stroke="#f72585" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="69" y1="30" x2="65" y2="30" stroke="#4cc9f0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ─── Floating Tooltip Component (Hiển thị nhãn ghi chú phía trên button) ───
function Tooltip({ text, children }) {
  if (!text) return children;
  return (
    <div className="relative group/tooltip inline-flex items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-[100] whitespace-nowrap transition-all duration-150">
        <div
          className="px-2.5 py-1 text-[11px] font-bold rounded-xl text-white shadow-2xl flex items-center gap-1 leading-none"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          {text}
        </div>
        <div
          className="w-2 h-2 -mt-1 rotate-45 shrink-0"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            borderRight: '1px solid rgba(255, 255, 255, 0.18)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        />
      </div>
    </div>
  );
}

// Start with empty library — user adds their own songs
const DEFAULT_SONGS = [];

export default function App() {
  // ── Helper: per-user localStorage keys ──────────────────
  const songsKey = (uid) => `aura_songs_${uid || 'guest'}`;
  const favsKey = (uid) => `aura_favs_${uid || 'guest'}`;

  // Get user ID from localStorage at init time (before user state resolves)
  const initUserId = (() => {
    try { return JSON.parse(localStorage.getItem('aura_user') || 'null')?._id || 'guest'; } catch { return 'guest'; }
  })();

  const [songs, setSongs] = useState(() => {
    try {
      const saved = localStorage.getItem(songsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });

  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [tab, setTab] = useState('home');
  const [favs, setFavs] = useState(() => {
    try {
      const saved = localStorage.getItem(favsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });
  const playlistsKey = uid => `aura_playlists_${uid}`;

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem(playlistsKey(initUserId));
      if (saved !== null) return JSON.parse(saved);
    } catch (e) { }
    return [];
  });

  const [playlistModal, setPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [songToAdd, setSongToAdd] = useState(null); // Which song is currently selected to be added to a playlist

  // Context Menu (Right Click) & Edit Playlist Details State
  const [contextMenu, setContextMenu] = useState(null); // { x, y, playlist }
  const [editPlaylistModal, setEditPlaylistModal] = useState(null); // playlist being edited
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [editPlaylistCover, setEditPlaylistCover] = useState('');
  const playlistCoverInputRef = useRef(null);

  // Custom Theme-Matched Confirm Delete Modal State
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm }

  // Admin Account Management State
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminUserModal, setAdminUserModal] = useState(null); // null, {}, or user object being edited
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRole, setAdminRole] = useState('user');
  const [adminErr, setAdminErr] = useState('');
  const [adminSaving, setAdminSaving] = useState(false);


  const [query, setQuery] = useState('');
  const [curTime, setCurTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(80);
  const [muted, setMuted] = useState(false);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [sleepTimeLeft, setSleepTimeLeft] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [addTab, setAddTab] = useState('youtube'); // 'youtube' | 'spotify' | 'playlist'
  const [ytUrl, setYtUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState('');

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
  const [hoverTab, setHoverTab] = useState(null);

  // Close context menu on window click
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const [loginModal, setLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);


  // Profile Dropdown & Theme Modal States
  const [themeModal, setThemeModal] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const avatarFileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Change Password States
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

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
        if (Array.isArray(res.data)) {
          const backendSongs = res.data.map(dbSong => ({
            id: dbSong.id,
            sourceType: 'youtube',
            youtubeId: dbSong.youtubeId,
            title: dbSong.title,
            artist: dbSong.artist,
            thumbnail: dbSong.thumbnail,
            duration: dbSong.duration,
            inLibrary: dbSong.inLibrary !== undefined ? dbSong.inLibrary : true
          }));

          setSongs(backendSongs);
          localStorage.setItem(songsKey(user._id), JSON.stringify(backendSongs));
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

  // Theme State & Persistent Selection
  const [themeKey, setThemeKeyRaw] = useState(() => {
    return localStorage.getItem('aura_theme_key') || 'aurora';
  });

  const setThemeKey = (key) => {
    setThemeKeyRaw(key);
    localStorage.setItem('aura_theme_key', key);
  };

  const [themeCategory, setThemeCategory] = useState('mix');

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

  // Shuffle Mode State: boolean
  const [isShuffle, setIsShuffle] = useState(false);
  const isShuffleRef = useRef(false);
  isShuffleRef.current = isShuffle;

  // Active playing queue (array of track objects)
  const [playingQueue, setPlayingQueue] = useState([]);

  const activePlaylist = tab.startsWith('playlist_') ? playlists.find(p => p._id === tab.split('_')[1]) : null;

  const list = songs
    .filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
    .filter(s => {
      if (tab === 'favorites') return favs.includes(s.id);
      if (activePlaylist) return activePlaylist.songs.includes(s.id);
      return s.inLibrary !== false;
    });

  const getCurrentTrackList = () => {
    // 1. If currently viewing a specific playlist tab, use songs in that playlist
    if (tab.startsWith('playlist_')) {
      const playlistId = tab.split('_')[1];
      const pl = playlists.find(p => p._id === playlistId);
      if (pl && pl.songs && pl.songs.length > 0) {
        const plSongs = pl.songs
          .map(id => songs.find(s => s.id === id))
          .filter(Boolean);
        if (plSongs.length > 0) return plSongs;
      }
    }

    // 2. If currently viewing Favorites tab, use favorite songs
    if (tab === 'favorites') {
      const favSongs = songs.filter(s => favs.includes(s.id));
      if (favSongs.length > 0) return favSongs;
    }

    // 3. If playingQueue state is active and valid
    if (playingQueue && playingQueue.length > 0) {
      const validQueue = playingQueue.filter(qSong => songs.some(s => s.id === qSong.id));
      if (validQueue.length > 0) return validQueue;
    }

    // 4. Default: current displayed list or library songs
    if (list && list.length > 0) return list;
    const libSongs = songs.filter(s => s.inLibrary !== false);
    return libSongs.length > 0 ? libSongs : songs;
  };

  // Current active theme tokens
  const C = THEMES[themeKey] || THEMES.nude;

  const yt = useRef(null);

  // Sync profile edit state when opening profile dropdown
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditAvatar(user.avatar || '');
    }
  }, [user, profileDropdown]);

  // Click outside to auto-close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    if (profileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [profileDropdown]);

  // Handle change password form submission
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });
    if (!newPwdInput.trim() || newPwdInput.trim().length < 4) {
      setPwdMsg({ text: 'Mật khẩu mới phải từ 4 ký tự trở lên!', type: 'error' });
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setPwdMsg({ text: 'Mật khẩu xác nhận không khớp!', type: 'error' });
      return;
    }

    setPwdSaving(true);
    try {
      const token = user?.token || localStorage.getItem('aura_token');
      if (!token) {
        setPwdMsg({ text: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại!', type: 'error' });
        return;
      }

      const res = await axios.put('/api/auth/change-password', {
        newPassword: newPwdInput.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPwdMsg({ text: res.data?.message || 'Đã lưu mật khẩu mới thành công!', type: 'success' });
      setNewPwdInput('');
      setConfirmPwdInput('');
      setTimeout(() => {
        setShowChangePwd(false);
        setPwdMsg({ text: '', type: '' });
      }, 2000);
    } catch (err) {
      console.error("Change password error:", err);
      const msg = err.response?.data?.message || err.message || 'Lỗi khi cập nhật mật khẩu!';
      setPwdMsg({ text: msg, type: 'error' });
    } finally {
      setPwdSaving(false);
    }
  };

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
    } catch { }
    try {
      const savedFavs = localStorage.getItem(favsKey(user._id));
      if (savedFavs !== null) setFavs(JSON.parse(savedFavs));
      else setFavs([]);
    } catch { }
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init YT Player
  useEffect(() => {
    const init = () => {
      if (yt.current || !window.YT?.Player) return;
      yt.current = new window.YT.Player('yt-player', {
        height: '1', width: '1', videoId: '',
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1 },
        events: {
          onReady: () => yt.current.setVolume(80),
          onStateChange: e => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              try {
                yt.current?.unMute?.();
                yt.current?.setVolume?.(vol || 80);
              } catch (err) { }
            }
            else if (e.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
            }
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
      } catch { }
    }, 500);
    return () => clearInterval(t);
  }, [playing]);

  // Setup fallback loop listener for iOS background
  useEffect(() => {
    let silentAudio = document.getElementById('silent-audio');
    if (!silentAudio) return;
    const handleEnded = () => { silentAudio.currentTime = 0; };
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

  const play = (trk, queue = null) => {
    if (!trk) return;
    setTrack(trk); setPlaying(true);

    if (queue && Array.isArray(queue) && queue.length > 0) {
      setPlayingQueue(queue);
    } else if (tab.startsWith('playlist_') && activePlaylist) {
      const plSongs = activePlaylist.songs.map(id => songs.find(s => s.id === id)).filter(Boolean);
      if (plSongs.length > 0) setPlayingQueue(plSongs);
    } else if (tab === 'favorites') {
      const favSongs = songs.filter(s => favs.includes(s.id));
      if (favSongs.length > 0) setPlayingQueue(favSongs);
    }

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
      try {
        yt.current?.unMute?.();
        yt.current?.setVolume?.(vol || 80);
      } catch (err) { }

      yt.current?.loadVideoById?.(yid);
      yt.current?.playVideo?.();
    } else {
      // If still no yid, just stop
      setPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!track) {
      const q = getCurrentTrackList();
      if (q && q[0]) play(q[0], q);
      return;
    }
    if (playing) {
      yt.current?.pauseVideo?.();
      setPlaying(false);
    } else {
      try {
        yt.current?.unMute?.();
        yt.current?.setVolume?.(vol || 80);
      } catch (err) { }
      yt.current?.playVideo?.();
      setPlaying(true);
    }
  };

  const nextTrack = () => {
    const q = getCurrentTrackList();
    if (!q || q.length === 0) return;

    if (isShuffleRef.current) {
      let candidates = q.filter(s => s.id !== track?.id);
      if (candidates.length === 0) candidates = q;
      const nextSong = candidates[Math.floor(Math.random() * candidates.length)];
      play(nextSong, q);
    } else {
      const i = q.findIndex(s => s.id === track?.id);
      const nextIndex = i < 0 ? 0 : (i + 1) % q.length;
      play(q[nextIndex], q);
    }
  };

  const nextTrackRef = useRef();
  nextTrackRef.current = nextTrack;


  const prevTrack = () => {
    const q = getCurrentTrackList();
    if (!q || q.length === 0) return;

    const i = q.findIndex(s => s.id === track?.id);
    const prevIndex = i < 0 ? 0 : (i - 1 + q.length) % q.length;
    play(q[prevIndex], q);
  };

  const random = () => {
    const currentList = getCurrentTrackList();
    if (!currentList || currentList.length === 0) return;

    let candidates = currentList.filter(s => s.id !== track?.id);
    if (candidates.length === 0) candidates = currentList;

    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    setIsShuffle(true);
    play(selected, currentList);
  };

  const toggleShuffle = () => {
    if (!isShuffle) {
      setIsShuffle(true);
      random();
    } else {
      setIsShuffle(false);
    }
  };

  // Background playback control for mobile
  useEffect(() => {
    if ('mediaSession' in navigator && track) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artist: track.artist,
        artwork: [{ src: track.thumbnail, sizes: '512x512', type: 'image/jpeg' }]
      });
      try {
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      } catch (err) { }
      navigator.mediaSession.setActionHandler('play', () => {
        const audio = document.getElementById('silent-audio');
        if (audio) audio.play().catch(() => { });
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

  const seek = e => { const t = +e.target.value; setCurTime(t); yt.current?.seekTo?.(t, true); };
  const changeVol = e => { const v = +e.target.value; setVol(v); setMuted(v === 0); yt.current?.setVolume?.(v); };
  const toggleMute = () => {
    if (muted) { setMuted(false); yt.current?.setVolume?.(vol || 80); }
    else { setMuted(true); yt.current?.setVolume?.(0); }
  };

  const toggleFav = id => {
    setFavs(p => {
      const updated = p.includes(id) ? p.filter(x => x !== id) : [...p, id];
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
        }).catch(() => { });
      }
      return updated;
    });
    if (track?.id === id) {
      setTrack(null);
      setPlaying(false);
      yt.current?.stopVideo?.();
    }
    axios.delete('/api/music/' + id).catch(() => { });
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
    } catch (err) {
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
    } catch (e) { }
    localStorage.removeItem('aura_user');
    localStorage.removeItem('aura_token');
  };

  // Save Profile updates (from profile dropdown under avatar)
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (user) {
      setProfileSaving(true);
      setProfileSavedMsg('');
      const updated = {
        ...user,
        name: editName.trim() || user.name,
        avatar: editAvatar.trim() || user.avatar
      };
      setUser(updated);
      localStorage.setItem('aura_user', JSON.stringify(updated));

      try {
        await axios.put('/api/auth/profile', {
          name: updated.name,
          avatar: updated.avatar
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfileSavedMsg('Đã lưu hồ sơ thành công!');
        setTimeout(() => setProfileSavedMsg(''), 2500);
      } catch (err) {
        console.error("Failed to save profile to server", err);
        setProfileSavedMsg('Lỗi khi lưu lên máy chủ');
      } finally {
        setProfileSaving(false);
      }
    }
  };

  // Save Theme updates (from theme modal in center of screen)
  const handleSaveTheme = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('aura_theme_key', themeKey);
    setThemeModal(false);
  };

  const addSong = async e => {
    e.preventDefault(); if (!ytUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      const m = ytUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
      const vid = m?.[2]?.length === 11 ? m[2] : null;
      if (!vid) throw new Error('Đường dẫn YouTube không hợp lệ!');
      const isPlaylistTab = tab.startsWith('playlist_');
      const existingSong = songs.find(song => song.youtubeId === vid);
      let s;
      if (existingSong) {
        s = existingSong;
      } else {
        s = { id: 's' + Date.now(), sourceType: 'youtube', youtubeId: vid, title: 'YouTube Song', artist: 'YouTube Creator', thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`, duration: '3:30', inLibrary: !isPlaylistTab };
        try { const o = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`); s.title = o.data?.title || s.title; s.artist = o.data?.author_name || s.artist; } catch { }
        setSongs(p => {
          const updated = [s, ...p];
          if (user) {
            localStorage.setItem(songsKey(user._id), JSON.stringify(updated));
            axios.post('/api/music', { ...s, addedBy: user._id, inLibrary: s.inLibrary }).catch(() => { });
          }
          return updated;
        });
      }
      setAddModal(false); setYtUrl(''); play(s);

      if (isPlaylistTab) {
        handleAddToPlaylist(tab.split('_')[1], s.id);
      }
    } catch (err) { setAddErr(err.message || 'Lỗi không xác định.'); }
    finally { setAdding(false); }
  };

  const addSpotify = async e => {
    e.preventDefault(); if (!spotifyUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      const isPlaylistTab = tab.startsWith('playlist_');
      const res = await axios.post('/api/music/spotify-playlist', {
        playlistUrl: spotifyUrl,
        addedBy: user?._id || null,
        inLibrary: !isPlaylistTab
      });

      const newSongs = res.data;
      if (!newSongs || newSongs.length === 0) throw new Error("Không lấy được bài hát nào từ Spotify.");

      const finalSongs = newSongs.map(ns => {
        const existing = songs.find(s => s.youtubeId === ns.youtubeId && ns.youtubeId && !ns.youtubeId.startsWith('unknown_'));
        if (existing) return existing;
        return { ...ns, inLibrary: !isPlaylistTab };
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
    } catch (err) { setAddErr(err.response?.data?.message || err.message || 'Lỗi không xác định.'); }
    finally { setAdding(false); }
  };

  const addYouTubePlaylist = async e => {
    e.preventDefault(); if (!playlistUrl.trim()) return;
    setAdding(true); setAddErr('');
    try {
      const isPlaylistTab = tab.startsWith('playlist_');
      const res = await axios.post('/api/music/playlist', {
        playlistUrl,
        addedBy: user?._id || null,
        inLibrary: !isPlaylistTab
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
    } catch (err) {
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
    } catch (err) {
      console.error(err);
      alert('Lỗi tạo playlist: ' + (err.response?.data?.message || err.message));
    }
  };

  const executeDeletePlaylist = async id => {
    try {
      await axios.delete(`/api/playlists/${id}`);
      setPlaylists(p => {
        const up = p.filter(x => x._id !== id);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
      if (tab === `playlist_${id}`) setTab('home');
    } catch (err) { console.error(err); }
  };

  const confirmDeletePlaylist = (id, name) => {
    setConfirmModal({
      title: 'Xóa Danh Sách Phát',
      message: `Bạn có chắc chắn muốn xóa danh sách phát "${name}" không? Tất cả các thiết lập của danh sách phát này sẽ bị xóa.`,
      onConfirm: () => executeDeletePlaylist(id)
    });
  };

  const confirmDeleteSong = (song) => {
    setConfirmModal({
      title: 'Xóa Bài Hát',
      message: `Bạn có chắc chắn muốn xóa bài hát "${song.title}" khỏi thư viện không?`,
      onConfirm: () => deleteSong(song.id)
    });
  };

  // Toggle Pin Playlist (Ghim lên đầu)
  const handleTogglePinPlaylist = id => {
    setPlaylists(prev => {
      const updated = prev.map(p => p._id === id ? { ...p, pinned: !p.pinned } : p);
      const uid = user?._id || 'guest';
      localStorage.setItem(playlistsKey(uid), JSON.stringify(updated));

      if (user) {
        const target = updated.find(p => p._id === id);
        axios.put(`/api/playlists/${id}`, { pinned: target.pinned }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).catch(() => {
          axios.put(`/api/playlists/${id}`, { pinned: target.pinned }).catch(() => { });
        });
      }
      return updated;
    });
  };

  // Save Edit Playlist Name & Cover
  const handleSaveEditPlaylist = e => {
    if (e) e.preventDefault();
    if (!editPlaylistModal) return;
    const id = editPlaylistModal._id;
    const newName = editPlaylistName.trim() || editPlaylistModal.name;
    const newCover = editPlaylistCover;

    setPlaylists(prev => {
      const updated = prev.map(p => p._id === id ? { ...p, name: newName, cover: newCover } : p);
      const uid = user?._id || 'guest';
      localStorage.setItem(playlistsKey(uid), JSON.stringify(updated));

      if (user) {
        axios.put(`/api/playlists/${id}`, { name: newName, cover: newCover }, {
          headers: { Authorization: `Bearer ${user.token}` }
        }).catch(() => {
          axios.put(`/api/playlists/${id}`, { name: newName, cover: newCover }).catch(() => { });
        });
      }
      return updated;
    });

    setEditPlaylistModal(null);
  };

  // ── ADMIN USER MANAGEMENT HANDLERS ───────────────────
  const isSuperAdminAccount = (acc) => Boolean(acc && (acc.email === 'admin@gmail.com' || acc.email === 'unnull@gmail.com' || acc._id === 'admin-owner' || acc._id === 'user-unnull' || acc.name?.toLowerCase() === 'tyn'));
  const isCurrentSuperAdmin = isSuperAdminAccount(user);
  const isAdmin = Boolean(user && (user.role === 'admin' || isCurrentSuperAdmin));

  const fetchAdminUsers = () => {
    axios.get('/api/admin/users').then(res => {
      if (Array.isArray(res.data)) {
        setAdminUsers(res.data);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    if (tab === 'admin' && isAdmin) {
      fetchAdminUsers();
    }
  }, [tab, isAdmin]);

  const handleSaveAdminUser = async (e) => {
    e.preventDefault();
    setAdminErr('');
    setAdminSaving(true);
    try {
      if (adminUserModal?._id) {
        await axios.put(`/api/admin/users/${adminUserModal._id}`, {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: adminRole
        });
      } else {
        await axios.post('/api/admin/users', {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: adminRole
        });
      }
      await fetchAdminUsers();
      setAdminUserModal(null);
    } catch (err) {
      setAdminErr(err.response?.data?.message || err.message || 'Lỗi lưu tài khoản vào DB.');
    } finally {
      setAdminSaving(false);
    }
  };

  const handleToggleLockUser = async (u) => {
    try {
      await axios.put(`/api/admin/users/${u._id}`, { isLocked: !u.isLocked });
      fetchAdminUsers();
    } catch (err) {
      alert('Lỗi khóa tài khoản: ' + err.message);
    }
  };

  const handleDeleteUser = (u) => {
    setConfirmModal({
      title: 'Xóa Tài Khoản',
      message: `Bạn có chắc chắn muốn xóa tài khoản "${u.name}" (${u.email}) khỏi cơ sở dữ liệu không?`,
      onConfirm: async () => {
        try {
          await axios.delete(`/api/admin/users/${u._id}`);
          fetchAdminUsers();
        } catch (err) {
          alert('Lỗi xóa tài khoản: ' + err.message);
        }
      }
    });
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
    } catch (err) { console.error(err); }
  };

  const handleRemoveFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await axios.put(`/api/playlists/${playlistId}/remove`, { songId });
      setPlaylists(p => {
        const up = p.map(x => x._id === playlistId ? res.data : x);
        localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
        return up;
      });
    } catch (err) { console.error(err); }
  };

  const fmt = s => isNaN(s) || s < 0 ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const glass = { background: C.surface, backdropFilter: 'blur(20px)', border: `1.5px solid ${C.border}` };
  const btn = { background: C.btn, color: C.btnTxt, border: `1.5px solid ${C.btnBd}` };

  // ── LANDING PAGE ──────────────────────────────────────────
  if (!user && page === 'landing') {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden flex flex-col" style={{ background: C.bg, fontFamily: F.body }}>
        <audio id="silent-audio" src="/silent.mp3" loop preload="auto" style={{ display: 'none' }}></audio>
        <div id="yt-player" className="fixed top-0 left-0 pointer-events-none z-[-50]" style={{ width: '300px', height: '300px', opacity: 1 }} />

        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background: `radial-gradient(circle at 30% 30%,${C.primarySolid},transparent 70%)`, transform: 'translate(-30%,-30%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 float-anim"
          style={{ background: `radial-gradient(circle at 70% 70%,${C.borderSel},transparent 70%)`, transform: 'translate(30%,30%)', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
          style={{ background: `radial-gradient(circle,${C.primarySolid},transparent)`, transform: 'translate(-50%,-50%)' }} />

        {/* Nav bar */}
        <header className="relative z-10 flex items-center justify-between px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-xl text-white spin-slow"></i>
            </div>
            <span style={{ fontFamily: F.cursive, fontSize: '26px', color: C.primarySolid, lineHeight: 1 }}>LittleLove</span>
          </div>
          <button
            onClick={() => setPage('login')}
            title="Bấm để đăng nhập tài khoản nghe nhạc"
            className="px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: C.primary, color: '#fff', boxShadow: `0 4px 16px ${C.primaryGlow}` }}
          >
            Đăng nhập
          </button>
        </header>

        {/* Hero section */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 py-16 gap-8">
          {/* Spinning disc icon */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl mb-2"
            style={{ background: C.primary, boxShadow: `0 20px 60px ${C.primaryGlow}` }}>
            <i className="ri-disc-fill text-6xl text-white spin-slow"></i>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-2">
            <h1 style={{ fontFamily: F.cursive, fontSize: 'clamp(48px,8vw,88px)', color: C.primarySolid, lineHeight: 1.05 }}>
              LittleLove
            </h1>
            <p style={{ fontFamily: F.brand, fontSize: 'clamp(13px,2vw,18px)', color: C.txtSub, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              Không gian âm nhạc cá nhân của bạn
            </p>
          </div>

          {/* Description */}
          <p style={{ fontFamily: F.body, fontSize: 'clamp(14px,1.8vw,17px)', color: C.txtSub, maxWidth: '520px', lineHeight: 1.8 }}>
            Tạo thư viện nhạc riêng từ YouTube, lưu bài yêu thích,
            tùy chỉnh giao diện theo phong cách của bạn.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { icon: 'ri-youtube-fill', label: 'Stream từ YouTube' },
              { icon: 'ri-heart-fill', label: 'Bài hát yêu thích' },
              { icon: 'ri-palette-fill', label: 'Giao diện Pastel' },
              { icon: 'ri-repeat-line', label: 'Phát & Lặp lại' },
            ].map(f => (
              <span key={f.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: C.tag, border: `1.5px solid ${C.tagBd}`, color: C.tagTxt }}>
                <i className={`${f.icon} text-base`}></i>
                {f.label}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => setPage('login')}
            title="Đăng nhập ngay để khám phá không gian nhạc cá nhân"
            className="mt-4 px-10 py-4 rounded-2xl text-lg font-bold text-white flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 hover:shadow-3xl cursor-pointer"
            style={{ background: C.primary, boxShadow: `0 8px 32px ${C.primaryGlow}` }}
          >
            <i className="ri-headphone-fill text-xl"></i>
            Bắt đầu nghe nhạc
            <i className="ri-arrow-right-line text-xl"></i>
          </button>

          <p style={{ color: C.txtFad, fontSize: '12px', marginTop: '4px' }}>
            ✦ Dành riêng cho bạn • Private Music Space ✦
          </p>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center pb-6 pt-2">
          <p style={{ color: C.txtFad, fontSize: '11px', fontFamily: F.brand, letterSpacing: '0.15em' }}>
            © 2026 LittleLove · Personal Edition
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
          style={{ background: `radial-gradient(circle,${C.borderSel},transparent)` }} />
        <div className="absolute bottom-12 right-20 w-80 h-80 rounded-full pointer-events-none float-anim opacity-30"
          style={{ background: `radial-gradient(circle,${C.primarySolid},transparent)`, animationDelay: '1.5s' }} />

        {/* Login Card */}
        <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10"
          style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 25px 70px rgba(0,0,0,0.12)' }}>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-3xl text-white spin-slow"></i>
            </div>
            <h1 style={{ fontFamily: F.cursive, fontSize: '34px', color: C.primarySolid, lineHeight: 1.1 }}>LittleLove</h1>
            <p style={{ fontFamily: F.brand, fontSize: '11px', letterSpacing: '0.25em', color: C.txtFad, textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
              Unnull Music Space
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Email / Tên đăng nhập</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Nhập email hoặc tên đăng nhập"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
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
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>

            {loginErr && <p className="text-xs font-semibold text-red-500">{loginErr}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] mt-2 cursor-pointer"
              style={{ background: C.primary, boxShadow: `0 6px 20px ${C.primaryGlow}` }}
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
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${C.isAnimated ? 'animated-gradient-bg' : ''}`} style={{ background: C.bg, fontFamily: F.body }}>
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
          className={`fixed md:relative z-50 w-72 h-full flex flex-col gap-5 p-6 shrink-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          style={{ ...glass, borderRight: `1.5px solid ${C.border}`, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', background: C.surface }}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
              <i className={`ri-disc-fill text-[22px] text-white ${playing ? 'spin-slow' : ''}`}></i>
            </div>
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: F.cursive, fontSize: '28px', color: C.primarySolid, lineHeight: 1.1 }}>LittleLove</span>
              <span style={{ fontFamily: F.brand, fontSize: '10px', letterSpacing: '0.25em', color: C.txtFad, textTransform: 'uppercase', fontWeight: 600 }}>Unnull Music Space</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto px-2 py-1 custom-scrollbar">
            <p style={{ fontFamily: F.brand, fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.txtFad, padding: '0 8px', marginBottom: '2px' }}>Menu</p>
            {[
              {
                key: 'home',
                icon: 'ri-home-heart-fill',
                label: 'Trang chủ',
                sub: 'Trang nhạc cá nhân',
                color: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                tooltip: 'Mở trang chủ'
              },
              {
                key: 'library',
                icon: 'ri-music-2-fill',
                label: 'Thư viện',
                sub: `Thư viện • ${songs.filter(s => s.inLibrary !== false).length} bài`,
                color: 'linear-gradient(135deg, #a855f7, #ec4899)',
                tooltip: 'Xem toàn bộ thư viện nhạc'
              },
              {
                key: 'favorites',
                icon: 'ri-heart-fill',
                label: 'Yêu thích',
                sub: `Playlist • ${favs.length} bài`,
                color: 'linear-gradient(135deg, #450af5, #8e2de2)',
                tooltip: 'Xem các bài hát đã yêu thích'
              },
              ...(isAdmin ? [{
                key: 'admin',
                icon: 'ri-shield-user-fill',
                label: 'Quản lý Account',
                sub: 'Quản trị hệ thống & DB',
                color: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                tooltip: 'Mở trang quản lý tài khoản & phân quyền người dùng'
              }] : [])
            ].map(t => {
              const active = tab === t.key;
              const isHovered = hoverTab === t.key;
              const isHighlighted = active || isHovered;
              return (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setIsMobileMenuOpen(false); }}
                  onMouseEnter={() => setHoverTab(t.key)}
                  onMouseLeave={() => setHoverTab(null)}
                  title={t.tooltip}
                  className="flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-left shrink-0 cursor-pointer active:scale-95"
                  style={isHighlighted
                    ? {
                      background: C.tag,
                      color: C.txt,
                      border: `1.5px solid ${active ? (C.borderSel || C.primarySolid) : (C.borderSel || C.primarySolid)}`,
                      boxShadow: isHovered
                        ? `0 8px 24px ${C.primaryGlow || 'rgba(0,0,0,0.25)'}, 0 2px 10px rgba(0,0,0,0.15)`
                        : `0 4px 16px ${C.primaryGlow || 'rgba(0,0,0,0.15)'}`
                    }
                    : {
                      background: 'transparent',
                      color: C.txtSub,
                      border: '1.5px solid transparent'
                    }
                  }
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform"
                    style={{ background: t.color }}
                  >
                    <i className={`${t.icon} text-lg`}></i>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 leading-tight">
                    <span className="text-sm font-bold truncate" style={{ color: isHighlighted ? C.primarySolid : C.txt }}>
                      {t.label}
                    </span>
                    <span className="text-[11px] font-medium truncate mt-0.5" style={{ color: C.txtSub }}>
                      {t.sub}
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="mt-4 mb-2 flex items-center justify-between px-3">
              <p style={{ fontFamily: F.brand, fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.txtFad }}>Danh sách phát</p>
              <button onClick={() => setPlaylistModal(true)} title="Tạo danh sách phát mới"
                className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                style={{ background: C.tag, color: C.txt, border: `1px solid ${C.border}` }}>
                <i className="ri-add-line text-xs"></i>
              </button>
            </div>

            {playlists.slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(p => {
              const tabKey = `playlist_${p._id}`;
              const active = tab === tabKey;
              const isHovered = hoverTab === tabKey;
              const isHighlighted = active || isHovered;

              const firstSongId = p.songs?.[0];
              const firstSong = firstSongId ? songs.find(s => s.id === firstSongId) : null;
              const coverThumb = p.cover || firstSong?.thumbnail;

              return (
                <button
                  key={p._id}
                  onClick={() => { setTab(tabKey); setIsMobileMenuOpen(false); }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: Math.min(e.clientX, window.innerWidth - 230),
                      y: Math.min(e.clientY, window.innerHeight - 200),
                      playlist: p
                    });
                  }}
                  onMouseEnter={() => setHoverTab(tabKey)}
                  onMouseLeave={() => setHoverTab(null)}
                  title={`Mở danh sách phát: ${p.name} (Bấm chuột phải để hiện menu tùy chọn)`}
                  className="flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-left shrink-0 cursor-pointer active:scale-95 relative"
                  style={isHighlighted
                    ? {
                      background: C.tag,
                      color: C.txt,
                      border: `1.5px solid ${active ? (C.borderSel || C.primarySolid) : (C.borderSel || C.primarySolid)}`,
                      boxShadow: isHovered
                        ? `0 8px 24px ${C.primaryGlow || 'rgba(0,0,0,0.25)'}, 0 2px 10px rgba(0,0,0,0.15)`
                        : `0 4px 16px ${C.primaryGlow || 'rgba(0,0,0,0.15)'}`
                    }
                    : {
                      background: 'transparent',
                      color: C.txtSub,
                      border: '1.5px solid transparent'
                    }
                  }
                >
                  {coverThumb ? (
                    <img
                      src={coverThumb}
                      alt={p.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm"
                      style={{ border: `1.5px solid ${isHighlighted ? (C.borderSel || C.primarySolid) : C.border}` }}
                    />
                  ) : (
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ background: isHighlighted ? C.primary : 'linear-gradient(135deg, #475569, #334155)' }}
                    >
                      <i className={isHighlighted ? "ri-folder-music-fill text-lg" : "ri-folder-music-line text-lg"}></i>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1 leading-tight">
                    <span className="text-sm font-bold truncate flex items-center gap-1" style={{ color: isHighlighted ? C.primarySolid : C.txt }}>
                      {p.name}
                    </span>
                    <span className="text-[11px] font-medium truncate mt-0.5 flex items-center gap-1" style={{ color: C.txtSub }}>
                      {p.pinned && <i className="ri-pushpin-fill text-[11px] text-green-500 shrink-0"></i>}
                      Playlist • {p.songs ? p.songs.length : 0} bài
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer card */}
          <div className="rounded-2xl p-4 text-center" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
            <div className="text-2xl mb-1">🕊️</div>
            <p style={{ fontFamily: F.cursive, fontSize: '17px', color: C.primarySolid }}>Music soothes the soul</p>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <header className="min-h-[72px] md:min-h-[66px] px-3 md:px-8 flex items-center justify-between shrink-0 relative z-40 gap-2 md:gap-3"
            style={{
              background: C.surface,
              backdropFilter: 'blur(18px)',
              borderBottom: `1.5px solid ${C.border}`,
              paddingTop: 'max(14px, env(safe-area-inset-top))',
              paddingBottom: '10px'
            }}>

            <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-none">
              {/* Mobile Hamburger Menu */}
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1 -ml-1 text-lg rounded-lg" style={{ color: C.txt }}>
                <i className="ri-menu-line"></i>
              </button>

              {/* Search */}
              <div className="relative w-full max-w-[140px] sm:max-w-[180px] md:w-72 z-10">
                <i className="ri-search-line absolute left-3 top-2 text-xs md:text-sm md:left-3.5 md:top-2.5" style={{ color: C.txtFad }}></i>
                <input type="text" placeholder="Tìm kiếm..."
                  value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full py-1.5 md:py-2 pl-8 md:pl-10 pr-3 md:pr-4 text-xs md:text-sm rounded-full outline-none transition"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
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
              <button onClick={() => setAddModal(true)}
                title="Thêm bài hát mới từ YouTube hoặc Spotify"
                className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-bold px-2 py-1.5 md:px-4 md:py-2 rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
              >
                <i className="ri-youtube-line text-sm md:text-base"></i> <span className="hidden md:inline">Thêm Nhạc</span>
              </button>

              {/* Theme Customization Button (Khung chỉnh sửa giao diện ở giữa màn hình) */}
              <button
                onClick={() => setThemeModal(true)}
                title="Tùy chỉnh Giao Diện & Bảng Màu"
                className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-semibold px-2.5 py-1.5 md:px-4 md:py-2 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
              >
                <i className="ri-palette-line text-sm md:text-base" style={{ color: C.primarySolid }}></i>
                <span className="hidden lg:inline">Chỉnh Sửa Giao Diện</span>
              </button>

              {/* User Avatar Dropdown (Xổ xuống 1 bảng ngay dưới ảnh đại diện) */}
              {user ? (
                <div className="relative z-50" ref={profileDropdownRef}>
                  <div
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-1.5 md:gap-2.5 pl-1.5 md:pl-3 cursor-pointer group ml-0 md:ml-1 select-none"
                    style={{ borderLeft: `1.5px solid ${C.border}` }}
                    title="Bấm để chỉnh sửa hồ sơ cá nhân"
                  >
                    <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={user.name} className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover group-hover:scale-105 transition" style={{ border: `2px solid ${C.borderSel}` }}
                    />
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className="text-xs font-bold group-hover:underline" style={{ color: C.txt }}>{user.name}</span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: isAdmin ? '#f59e0b' : C.primarySolid }}>
                        {isAdmin ? 'Admin ✦' : 'Member'}
                      </span>
                    </div>
                    <i className={`ri-chevron-down-s-line text-sm transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''}`} style={{ color: C.txtFad }}></i>
                  </div>

                  {/* Dropdown Bảng Sửa Hồ Sơ Cá Nhân ngay bên dưới Avatar */}
                  {profileDropdown && (
                    <>
                      {/* Transparent backdrop overlay to dismiss on outside click */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileDropdown(false)}
                      />

                      <div
                        className="absolute right-0 top-full mt-2.5 z-50 w-80 md:w-88 rounded-3xl p-5 shadow-2xl overflow-hidden transition-all duration-200"
                        style={{
                          background: C.isDark ? '#1e293b' : '#fffcf9',
                          border: `1.5px solid ${C.border}`,
                          color: C.txt,
                          boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
                        }}
                      >
                        {/* Profile Header */}
                        <div className="relative mb-4 pb-3 border-b" style={{ borderColor: C.border }}>
                          <div className="flex items-center gap-3.5">
                            {/* Avatar with Click to Change */}
                            <div className="relative group/avatar cursor-pointer shrink-0" onClick={() => avatarFileInputRef.current?.click()} title="Bấm để đổi ảnh đại diện">
                              <img
                                src={editAvatar || user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                                alt={user.name}
                                className="w-14 h-14 rounded-full object-cover shadow-md transition group-hover/avatar:opacity-85"
                                style={{ border: `2.5px solid ${C.borderSel}` }}
                              />
                              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition">
                                <i className="ri-camera-switch-line text-white text-base"></i>
                              </div>
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-bold truncate" style={{ color: C.txt }}>{user.name}</span>
                              <span className="text-xs truncate font-mono" style={{ color: C.txtSub }}>{user.email}</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                  {isAdmin ? 'Admin ✦' : 'Member'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Edit Form */}
                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 mb-4">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: C.txtSub }}>
                              Tên Hiển Thị
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              placeholder="Nhập tên hiển thị..."
                              className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold outline-none transition"
                              style={{ background: C.isDark ? '#0f172a' : C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                              required
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => avatarFileInputRef.current?.click()}
                              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95"
                              style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                            >
                              <i className="ri-folder-image-line text-sm" style={{ color: C.primarySolid }}></i>
                              <span>Đổi Ảnh</span>
                            </button>
                            <input
                              type="file"
                              ref={avatarFileInputRef}
                              onChange={handleAvatarFileUpload}
                              accept="image/*"
                              className="hidden"
                            />

                            <button
                              type="submit"
                              disabled={profileSaving}
                              className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                              style={{ background: C.primary, boxShadow: `0 3px 12px ${C.primaryGlow}` }}
                            >
                              <i className="ri-save-3-line text-sm"></i>
                              <span>{profileSaving ? 'Đang lưu...' : 'Lưu Hồ Sơ'}</span>
                            </button>
                          </div>
                          {profileSavedMsg && (
                            <p className="text-[11px] font-bold text-emerald-500 text-center">
                              ✓ {profileSavedMsg}
                            </p>
                          )}
                        </form>

                        {/* Quick Menu Actions */}
                        <div className="pt-3 border-t flex flex-col gap-1.5" style={{ borderColor: C.border }}>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => { setTab('admin'); setProfileDropdown(false); }}
                              className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition hover:opacity-90 cursor-pointer"
                              style={{ background: C.tag, color: C.txt }}
                            >
                              <i className="ri-shield-user-line text-amber-500 text-sm"></i>
                              <span>Quản Lý Admin</span>
                            </button>
                          )}

                          {/* Change Password Toggle Button */}
                          <button
                            type="button"
                            onClick={() => { setShowChangePwd(!showChangePwd); setPwdMsg({ text: '', type: '' }); }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-between transition hover:opacity-90 cursor-pointer"
                            style={{ background: C.tag, color: C.txt }}
                          >
                            <div className="flex items-center gap-2.5">
                              <i className="ri-lock-password-line text-sm text-amber-500"></i>
                              <span>Đổi Mật Khẩu</span>
                            </div>
                            <i className={`ri-chevron-${showChangePwd ? 'up' : 'down'}-s-line text-xs`} style={{ color: C.txtFad }}></i>
                          </button>

                          {/* Change Password Form */}
                          {showChangePwd && (
                            <form onSubmit={handleChangePassword} className="p-3 rounded-2xl flex flex-col gap-2.5 border my-1 animate-in fade-in duration-150" style={{ background: C.isDark ? '#0f172a' : C.surface, borderColor: C.border }}>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.txtSub }}>
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  placeholder="Nhập mật khẩu mới..."
                                  value={newPwdInput}
                                  onChange={e => setNewPwdInput(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold outline-none transition"
                                  style={{ background: C.isDark ? '#1e293b' : C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.txtSub }}>
                                  Xác nhận mật khẩu
                                </label>
                                <input
                                  type="password"
                                  placeholder="Nhập lại mật khẩu..."
                                  value={confirmPwdInput}
                                  onChange={e => setConfirmPwdInput(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold outline-none transition"
                                  style={{ background: C.isDark ? '#1e293b' : C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                                  required
                                />
                              </div>

                              {pwdMsg.text && (
                                <p className={`text-[11px] font-bold text-center ${pwdMsg.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                  {pwdMsg.text}
                                </p>
                              )}

                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => { setShowChangePwd(false); setPwdMsg({ text: '', type: '' }); }}
                                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer"
                                  style={{ background: C.tag, border: `1px solid ${C.border}`, color: C.txt }}
                                >
                                  Hủy
                                </button>
                                <button
                                  type="submit"
                                  disabled={pwdSaving}
                                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
                                  style={{ background: C.primary }}
                                >
                                  <span>{pwdSaving ? 'Đang lưu...' : 'Xác Nhận'}</span>
                                </button>
                              </div>
                            </form>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (user?._id || user?.email) {
                                navigator.clipboard.writeText(user._id || user.email);
                                alert('Đã sao chép ID / Email người dùng vào bộ nhớ tạm!');
                              }
                            }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition hover:opacity-90 cursor-pointer"
                            style={{ background: C.tag, color: C.txt }}
                          >
                            <i className="ri-file-copy-line text-sm" style={{ color: C.primarySolid }}></i>
                            <span>Sao Chép ID Người Dùng</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { setProfileDropdown(false); logout(); }}
                            className="w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition hover:bg-red-500/10 text-red-500 cursor-pointer mt-1"
                            style={{ border: `1px solid rgba(239, 68, 68, 0.2)` }}
                          >
                            <i className="ri-logout-box-r-line text-sm"></i>
                            <span>Đăng Xuất Tài Khoản</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button onClick={() => setLoginModal(true)}
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

            {tab === 'admin' && isAdmin ? (
              /* ── ADMIN MANAGEMENT VIEW ─────────────────── */
              <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2.5" style={{ fontFamily: F.heading, color: C.txt }}>
                      <i className="ri-shield-user-fill" style={{ color: C.primarySolid }}></i>
                      Quản Lý Tài Khoản Người Dùng (Admin)
                    </h2>
                    <p className="text-xs mt-1" style={{ color: C.txtSub }}>
                      Thêm, sửa, xóa, phân quyền và khóa tài khoản trực tiếp vào cơ sở dữ liệu MongoDB.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setAdminUserModal({});
                      setAdminName('');
                      setAdminEmail('');
                      setAdminPassword('');
                      setAdminRole('user');
                      setAdminErr('');
                    }}
                    title="Bấm để thêm tài khoản mới vào cơ sở dữ liệu"
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                    style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}
                  >
                    <i className="ri-user-add-fill text-sm"></i>
                    <span>Thêm Tài Khoản Mới</span>
                  </button>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl flex items-center gap-4 shadow-sm" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-blue-500 bg-blue-500/10">
                      <i className="ri-user-3-line"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold" style={{ color: C.txt }}>{adminUsers.length}</span>
                      <span className="text-xs" style={{ color: C.txtFad }}>Tổng số tài khoản DB</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl flex items-center gap-4 shadow-sm" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-amber-500 bg-amber-500/10">
                      <i className="ri-vip-crown-line"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold" style={{ color: C.txt }}>{adminUsers.filter(u => u.role === 'admin' || u.email === 'admin@gmail.com' || u.email === 'unnull@gmail.com').length}</span>
                      <span className="text-xs" style={{ color: C.txtFad }}>Quản trị viên (Admin)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl flex items-center gap-4 shadow-sm" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl text-red-500 bg-red-500/10">
                      <i className="ri-lock-2-line"></i>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-red-500">{adminUsers.filter(u => u.isLocked).length}</span>
                      <span className="text-xs" style={{ color: C.txtFad }}>Tài khoản đang khóa</span>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.txtFad }}></i>
                  <input
                    type="text"
                    placeholder="Tìm kiếm tài khoản theo tên hoặc email..."
                    value={adminSearch}
                    onChange={e => setAdminSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs font-semibold outline-none transition"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  />
                </div>

                {/* Users List */}
                <div className="flex flex-col gap-3">
                  {adminUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">🛡️</div>
                      <p className="text-sm font-semibold" style={{ color: C.txtFad }}>Đang tải danh sách tài khoản từ DB...</p>
                    </div>
                  ) : adminUsers
                    .filter(u => !adminSearch || u.name?.toLowerCase().includes(adminSearch.toLowerCase()) || u.email?.toLowerCase().includes(adminSearch.toLowerCase()))
                    .map(u => {
                      const isUserAdmin = u.role === 'admin' || u.email === 'admin@gmail.com' || u.email === 'unnull@gmail.com';
                      return (
                        <div
                          key={u._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl gap-4 transition hover:opacity-95"
                          style={{ background: C.tag, border: `1px solid ${u.isLocked ? '#ef4444' : C.border}` }}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                              alt={u.name}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs"
                              style={{ border: `2px solid ${C.border}` }}
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold truncate" style={{ color: C.txt }}>{u.name}</span>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${isUserAdmin ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-xs' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                  {isUserAdmin ? 'Admin ✦' : 'Member'}
                                </span>
                                {u.isLocked && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
                                    🔒 ĐÃ KHÓA
                                  </span>
                                )}
                              </div>
                              <span className="text-xs truncate font-mono mt-0.5" style={{ color: C.txtSub }}>{u.email}</span>
                            </div>
                          </div>

                          {/* Controls */}
                          {isSuperAdminAccount(u) && !isCurrentSuperAdmin ? (
                            <span
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed select-none shadow-xs"
                              style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                              title="Tài khoản Super Admin tối cao (Bảo vệ cố định)"
                            >
                              <i className="ri-shield-keyhole-fill text-sm"></i>
                              <span>Super Admin (Bảo vệ)</span>
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => {
                                  setAdminUserModal(u);
                                  setAdminName(u.name || '');
                                  setAdminEmail(u.email || '');
                                  setAdminPassword('');
                                  setAdminRole(u.role || 'user');
                                  setAdminErr('');
                                }}
                                title="Chỉnh sửa thông tin tài khoản"
                                className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                                style={{ background: C.surface, color: C.txt, border: `1px solid ${C.border}` }}
                              >
                                <i className="ri-edit-line"></i> Sửa
                              </button>

                              {!isSuperAdminAccount(u) && (
                                <>
                                  <button
                                    onClick={() => handleToggleLockUser(u)}
                                    title={u.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản không cho đăng nhập'}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                                    style={{
                                      background: u.isLocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                      color: u.isLocked ? '#22c55e' : '#f59e0b',
                                      border: `1.5px solid ${u.isLocked ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                                    }}
                                  >
                                    <i className={u.isLocked ? "ri-lock-unlock-line" : "ri-lock-2-line"}></i>
                                    {u.isLocked ? 'Mở Khóa' : 'Khóa'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    title="Xóa vĩnh viễn tài khoản khỏi cơ sở dữ liệu"
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1 text-red-500"
                                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
                                  >
                                    <i className="ri-delete-bin-line"></i> Xóa
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : tab === 'home' ? (
              /* ── Hero Banner ─────────────────────── */
              <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-3xl p-6 md:p-8 mt-4 md:mt-0 shadow-sm min-h-[400px]"
                style={{ background: C.surface, border: `1.5px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
              >
                {/* 3D Glowing Glass Bubbles Canvas (Hiệu ứng bọt nước bong bóng 3D lung linh) */}
                <BubbleCanvas />

                {/* Blobs */}
                <div className="absolute top-10 right-20 w-32 h-32 md:w-48 md:h-48 rounded-full pointer-events-none float-anim opacity-50"
                  style={{ background: `radial-gradient(circle,${C.borderSel},transparent)` }} />
                <div className="absolute bottom-10 left-20 w-24 h-24 md:w-32 md:h-32 rounded-full pointer-events-none float-anim opacity-30"
                  style={{ background: `radial-gradient(circle,${C.primarySolid},transparent)`, animationDelay: '1.5s' }} />

                <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-bold mb-4 md:mb-6"
                    style={{ background: C.tag, color: C.txt, border: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: F.cursive }} className="text-[16px] md:text-[18px]">✦ Không gian nhạc cá nhân ✦</span>
                  </span>
                  <h1 className="leading-tight mb-4 text-3xl md:text-[42px]" style={{ color: C.txt, fontFamily: F.heading, fontWeight: 800 }}>
                    Thư giãn &amp; thưởng thức<br />
                    <span className="text-4xl md:text-[48px]" style={{ fontFamily: F.cursive, color: C.primarySolid, lineHeight: 1.4 }}>
                      từng giai điệu ✨
                    </span>
                  </h1>
                  <p className="text-sm md:text-base mb-6 md:mb-8 leading-relaxed max-w-md" style={{ color: C.txtSub }}>
                    Trang nhạc được tạo riêng cho bạn — khám phá, tạo danh sách phát và đắm chìm vào không gian âm nhạc không giới hạn.
                  </p>
                  <button onClick={() => setTab('library')}
                    className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all shadow-lg hover:scale-105 hover:-translate-y-1"
                    style={{ background: C.primary, boxShadow: `0 6px 20px ${C.primaryGlow}` }}
                  >
                    <i className="ri-music-2-line text-xl"></i> Khám Phá Thư Viện
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ── Section heading ─────────────────── */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <h2 style={{ color: C.txt, fontFamily: F.heading, fontSize: '22px', fontWeight: 700 }}>
                    {tab === 'favorites' ? '🤍 Yêu Thích' : activePlaylist ? `✨ ${activePlaylist.name}` : '✨ Thư Viện Nhạc'}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.tag, color: C.tagTxt, border: `1px solid ${C.tagBd}` }}>
                    {list.length} bài
                  </span>
                  {list.length > 0 && (
                    <button
                      onClick={random}
                      title="Phát ngẫu nhiên tất cả bài hát trong danh sách này"
                      className="text-xs px-3 py-1.5 rounded-full font-bold transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                      style={{ background: C.tag, color: C.primarySolid, border: `1.5px solid ${C.border}` }}
                    >
                      <i className="ri-shuffle-line text-sm"></i>
                      <span>Phát ngẫu nhiên</span>
                    </button>
                  )}
                  {activePlaylist && (
                    <button onClick={() => confirmDeletePlaylist(activePlaylist._id, activePlaylist.name)}
                      title="Xóa vĩnh viễn danh sách phát này"
                      className="ml-auto text-xs px-3 py-1.5 rounded-full font-bold transition flex items-center cursor-pointer hover:scale-105 active:scale-95"
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
                      <div key={song.id} onClick={() => play(song, list)}
                        title={`Bấm để phát: ${song.title} - ${song.artist}`}
                        className="flex items-center p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200 group gap-2 md:gap-3 hover:opacity-95"
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
                          style={{ border: `2px solid ${sel ? C.border : 'transparent'}` }}
                        />
                        <div className="flex flex-col flex-1 min-w-0 pr-1 md:pr-2">
                          <span className="text-xs md:text-sm font-bold truncate" style={{ color: sel ? C.primarySolid : C.txt }}>{song.title}</span>
                          <span className="text-[10px] md:text-xs truncate" style={{ color: C.txtSub }}>{song.artist}</span>
                        </div>
                        <span className="hidden sm:block text-xs text-right shrink-0 w-12" style={{ color: C.txtFad }}>{song.duration}</span>

                        <div className="flex justify-end items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSongToAdd(song)} title="Thêm bài hát này vào danh sách phát"
                            className="p-1.5 md:p-2 rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95 cursor-pointer hover:scale-110"
                            style={{ color: C.txtFad }}
                            onMouseEnter={e => e.currentTarget.style.color = C.primarySolid}
                            onMouseLeave={e => e.currentTarget.style.color = C.txtFad}>
                            <i className="ri-play-list-add-line text-sm md:text-base"></i>
                          </button>
                          <button onClick={() => toggleFav(song.id)}
                            title={favs.includes(song.id) ? "Bỏ yêu thích bài hát này" : "Thêm bài hát này vào yêu thích"}
                            className="p-1.5 md:p-2 rounded-full transition active:scale-95 cursor-pointer hover:scale-110"
                            style={{ color: favs.includes(song.id) ? C.primarySolid : C.txtFad }}>
                            <i className={favs.includes(song.id) ? 'ri-heart-fill text-sm md:text-base' : 'ri-heart-line text-sm md:text-base'}></i>
                          </button>
                          <button
                            onClick={() => {
                              if (activePlaylist) {
                                handleRemoveFromPlaylist(activePlaylist._id, song.id);
                              } else {
                                confirmDeleteSong(song);
                              }
                            }}
                            title={activePlaylist ? "Xóa bài hát khỏi playlist này" : "Xóa vĩnh viễn bài hát khỏi thư viện"}
                            className="p-1.5 md:p-2 rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95 cursor-pointer hover:scale-110"
                            style={{ color: C.txtFad }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                            onMouseLeave={e => e.currentTarget.style.color = C.txtFad}
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

      {/* ── THEME CUSTOMIZATION MODAL (KHUNG CHỈNH SỬA GIAO DIỆN Ở GIỮA MÀN HÌNH) ───────────── */}
      {themeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setThemeModal(false); }}>
          <div className="w-full max-w-lg rounded-3xl p-6 md:p-7 shadow-2xl overflow-y-auto"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, color: C.txt, maxHeight: '90vh' }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: `1.5px solid ${C.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: C.primary }}>
                  <i className="ri-palette-fill text-xl text-white"></i>
                </div>
                <div>
                  <h3 style={{ fontFamily: F.heading, fontSize: '22px', fontWeight: 700, color: C.txt, lineHeight: 1.2 }}>
                    Chỉnh Sửa Giao Diện &amp; Phối Màu
                  </h3>
                  <p className="text-xs" style={{ color: C.txtSub }}>Tùy biến bảng màu và hiệu ứng giao diện theo sở thích</p>
                </div>
              </div>
              <button onClick={() => setThemeModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition hover:opacity-80" style={{ background: C.tag, color: C.txtFad }}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSaveTheme} className="flex flex-col gap-5">
              {/* Category Filter Tabs */}
              <div className="flex gap-1 p-1 rounded-2xl" style={{ background: C.isDark ? 'rgba(15, 23, 42, 0.7)' : C.tag, border: `1px solid ${C.border}` }}>
                {[
                  { key: 'mix', label: '✨ Mix Màu Dynamic', icon: 'ri-sparkles-line' },
                  { key: 'pastel', label: '🌸 Pastel', icon: 'ri-contrast-drop-line' },
                  { key: 'dark', label: '🌙 Tone Tối', icon: 'ri-moon-line' },
                ].map(cat => {
                  const active = themeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setThemeCategory(cat.key)}
                      className="flex-1 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      style={active
                        ? { background: C.primary, color: '#fff', boxShadow: `0 2px 10px ${C.primaryGlow}` }
                        : { color: C.txtSub }}
                    >
                      <i className={cat.icon}></i>
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Theme Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {Object.values(THEMES)
                  .filter(t => t.category === themeCategory)
                  .map(t => {
                    const isSelected = themeKey === t.key;
                    return (
                      <div
                        key={t.key}
                        onClick={() => setThemeKey(t.key)}
                        className="flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group"
                        style={{
                          background: isSelected ? (t.tag || C.tag) : (C.isDark ? '#0f172a' : '#fff'),
                          borderColor: isSelected ? (t.primarySolid || C.primarySolid) : C.border,
                          boxShadow: isSelected ? `0 4px 16px ${t.primaryGlow || C.primaryGlow}` : 'none'
                        }}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm shrink-0 ${t.isAnimated ? 'theme-preview-swatch' : ''}`}
                          style={{ background: t.isAnimated ? t.bg : t.primary, color: '#fff' }}
                        >
                          {t.icon}
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                          <span className="text-xs font-bold truncate" style={{ color: isSelected ? (t.primarySolid || C.primarySolid) : C.txt }}>
                            {t.name}
                          </span>
                          {t.isAnimated ? (
                            <span className="text-[9px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
                              <i className="ri-pulse-fill text-[10px] animate-pulse"></i> Chuyển màu động
                            </span>
                          ) : (
                            <span className="text-[10px]" style={{ color: C.txtFad }}>{isSelected ? '✓ Đang chọn' : 'Bấm để chọn'}</span>
                          )}
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: t.primarySolid || C.primarySolid }}></div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex gap-3 pt-3 mt-2" style={{ borderTop: `1.5px solid ${C.border}` }}>
                <button
                  type="button"
                  onClick={() => setThemeModal(false)}
                  className="flex-1 py-3 px-5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 hover:opacity-90"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95 shadow-lg hover:scale-105"
                  style={{ background: C.primary, boxShadow: `0 6px 20px ${C.primaryGlow}` }}
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
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)' }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md"
                style={{ background: C.primary }}>
                <i className="ri-heart-lock-fill text-3xl text-white"></i>
              </div>
              <h2 style={{ fontFamily: F.heading, fontSize: '26px', fontWeight: 700, color: C.txt, marginBottom: '4px' }}>Chào mừng trở lại</h2>
              <p style={{ fontFamily: F.cursive, fontSize: '18px', color: C.primarySolid }}>your personal music haven 🕊️</p>
            </div>

            <div className="rounded-2xl p-3.5 mb-5 flex items-start gap-2.5"
              style={{ background: C.tag, border: `1px solid ${C.border}` }}>
              <i className="ri-information-fill text-sm mt-0.5" style={{ color: C.primarySolid }}></i>
              <p className="text-xs leading-relaxed" style={{ color: C.txtSub }}>
                Đây là trang cá nhân. <strong style={{ color: C.txt }}>Đăng ký công khai đã bị đóng</strong> — chỉ chủ sở hữu mới có thể đăng nhập.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
              {[
                { label: 'Email', type: 'email', val: email, set: setEmail },
                { label: 'Mật Khẩu', type: 'password', val: pwd, set: setPwd },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>{f.label}</label>
                  <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  />
                </div>
              ))}
              {loginErr && <p className="text-xs font-semibold text-red-500">{loginErr}</p>}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setLoginModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition" style={btn}>
                  Hủy
                </button>
                <button type="submit" disabled={loggingIn}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
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
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) { setAddModal(false); setAddErr(''); } }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="flex items-center gap-2" style={{ fontFamily: F.heading, fontSize: '20px', fontWeight: 700, color: C.txt }}>
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
                  ? { background: C.primary, color: '#fff', boxShadow: `0 2px 12px ${C.primaryGlow}` }
                  : { color: C.txtSub }}
              >
                <i className="ri-youtube-fill"></i> Bài Hát
              </button>
              <button
                onClick={() => { setAddTab('spotify'); setAddErr(''); }}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={addTab === 'spotify'
                  ? { background: '#1DB954', color: '#fff', boxShadow: '0 2px 12px rgba(29,185,84,0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-spotify-fill"></i> Spotify
              </button>
              <button
                onClick={() => { setAddTab('playlist'); setAddErr(''); }}
                className="flex-1 py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                style={addTab === 'playlist'
                  ? { background: '#f59e0b', color: '#fff', boxShadow: '0 2px 12px rgba(245, 158, 11, 0.4)' }
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
                  <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={ytUrl} onChange={e => setYtUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
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
                    style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
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
                  <input type="text" placeholder="https://open.spotify.com/..." value={spotifyUrl} onChange={e => setSpotifyUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                    autoFocus
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: C.txtFad }}>
                    ℹ️ Copy link bài hát hoặc playlist từ Spotify → chia sẻ → "Copy link"
                  </p>
                </div>
                {addErr && <p className="text-xs font-semibold text-red-500">{addErr}</p>}
                <div className="p-3 rounded-xl text-xs" style={{ background: C.tag, border: `1px solid ${C.border}`, color: C.txtSub }}>
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
                    style={{ background: '#1DB954', boxShadow: '0 6px 18px rgba(29,185,84,0.35)' }}>
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
                  <input type="text" placeholder="https://www.youtube.com/playlist?list=..." value={playlistUrl} onChange={e => setPlaylistUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
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
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setPlaylistModal(false); }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <h3 className="flex items-center gap-2 mb-5" style={{ fontFamily: F.heading, fontSize: '20px', fontWeight: 700, color: C.txt }}>
              <i className="ri-play-list-add-fill" style={{ color: C.primarySolid }}></i> Tạo Playlist Mới
            </h3>

            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Tên danh sách phát</label>
                <input type="text" placeholder="Nhạc chill cuối tuần..." value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
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
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
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
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSongToAdd(null); }}>
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <h3 className="mb-4" style={{ fontFamily: F.heading, fontSize: '18px', fontWeight: 700, color: C.txt }}>
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
                    style={{ background: C.tag, border: `1px solid ${inPlaylist ? C.primarySolid : C.border}` }}>
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
                  style={{ border: `2px solid ${C.border}`, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                />
                {playing && (
                  <div className="absolute inset-0 rounded-lg md:rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    <span className="flex gap-[1px] md:gap-0.5 items-end h-3 md:h-4">
                      {['100%', '50%', '75%'].map((h, i) => (
                        <span key={i} className="w-[1.5px] md:w-1 rounded-full animate-pulse text-white"
                          style={{ background: '#fff', height: h, animationDelay: `${i * 0.2}s` }} />
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
            <Tooltip text={isShuffle ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'}>
              <button
                onClick={toggleShuffle}
                className="relative p-1 transition cursor-pointer hover:scale-110 active:scale-95"
                style={{ color: isShuffle ? C.primarySolid : C.txtFad }}
              >
                <i className="ri-shuffle-line text-sm md:text-lg"></i>
                {isShuffle && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                    style={{ background: C.primarySolid }}>
                  </span>
                )}
              </button>
            </Tooltip>

            {/* Repeat Mode Button */}
            <Tooltip text={repeatMode === 'one' ? 'Đang lặp 1 bài' : repeatMode === 'all' ? 'Đang lặp danh sách' : 'Lặp lại danh sách'}>
              <button
                onClick={toggleRepeat}
                className="relative p-1 transition cursor-pointer hover:scale-110 active:scale-95"
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
            </Tooltip>

            <Tooltip text="Bài phía trước">
              <button onClick={prevTrack} className="transition-transform hover:scale-110 active:scale-95 cursor-pointer" style={{ color: C.txtSub }}>
                <i className="ri-skip-back-fill text-lg md:text-2xl"></i>
              </button>
            </Tooltip>

            <Tooltip text={playing ? 'Tạm dừng' : 'Bật phát nhạc'}>
              <button onClick={togglePlay}
                className="w-9 h-9 md:w-12 md:h-12 rounded-full text-white text-sm md:text-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: C.primary, boxShadow: `0 4px 18px ${C.primaryGlow}` }}>
                <i className={playing ? 'ri-pause-fill' : 'ri-play-fill'}></i>
              </button>
            </Tooltip>

            <Tooltip text="Bài tiếp theo">
              <button onClick={nextTrack} className="transition-transform hover:scale-110 active:scale-95 cursor-pointer" style={{ color: C.txtSub }}>
                <i className="ri-skip-forward-fill text-lg md:text-2xl"></i>
              </button>
            </Tooltip>

            <Tooltip text={track && favs.includes(track.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
              <button onClick={() => track && toggleFav(track.id)}
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                style={{ color: track && favs.includes(track.id) ? C.primarySolid : C.txtFad }}>
                <i className={track && favs.includes(track.id) ? 'ri-heart-fill text-lg' : 'ri-heart-line'}></i>
              </button>
            </Tooltip>

            <Tooltip text={sleepTimer ? `Hẹn giờ: ${sleepTimer} phút` : 'Hẹn giờ tắt nhạc'}>
              <button onClick={cycleSleepTimer}
                className="relative p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                style={{ color: sleepTimer > 0 ? C.primarySolid : C.txtFad }}>
                <i className={sleepTimer > 0 ? 'ri-timer-fill text-lg' : 'ri-timer-line text-lg'}></i>
                {sleepTimer > 0 && (
                  <span className="absolute -top-1 -right-2 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white shadow-xs"
                    style={{ background: C.primarySolid }}>
                    {sleepTimer}
                  </span>
                )}
              </button>
            </Tooltip>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 md:gap-3 w-full order-1 md:order-2 px-2 md:px-0">
            <span className="text-[10px] md:text-[11px] font-mono w-7 md:w-9 text-right shrink-0" style={{ color: C.txtFad }}>{fmt(curTime)}</span>
            <input type="range" min="0" max={dur || 100} value={curTime} onChange={seek}
              className="flex-1 cursor-pointer" style={{ accentColor: C.primarySolid }} />
            <span className="text-[11px] font-mono w-9 shrink-0" style={{ color: C.txtFad }}>{fmt(dur)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end gap-3 w-64 shrink-0">
          <Tooltip text={muted || vol === 0 ? 'Bật lại âm thanh' : 'Tắt tiếng'}>
            <button onClick={toggleMute}
              className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              style={{ color: muted || vol === 0 ? '#f43f5e' : C.txtFad }}>
              <i className={`text-lg ${muted || vol === 0 ? 'ri-volume-mute-fill' : vol < 50 ? 'ri-volume-down-fill' : 'ri-volume-up-fill'}`}></i>
            </button>
          </Tooltip>
          <input type="range" min="0" max="100" value={muted ? 0 : vol} onChange={changeVol}
            className="w-24 cursor-pointer" style={{ accentColor: C.primarySolid }} />
        </div>
      </footer>

      {/* ── CONTEXT MENU FOR PLAYLIST (RIGHT CLICK) ─────────────────── */}
      {contextMenu && (
        <div
          className="fixed z-[120] w-56 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl transition-all"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            background: C.isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 252, 249, 0.95)',
            border: `1.5px solid ${C.border}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b mb-1 flex items-center gap-2" style={{ borderColor: C.border }}>
            <i className="ri-folder-music-fill text-sm" style={{ color: C.primarySolid }}></i>
            <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{contextMenu.playlist.name}</span>
          </div>

          {/* 1. Ghim / Bỏ ghim */}
          <button
            onClick={() => {
              handleTogglePinPlaylist(contextMenu.playlist._id);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
            style={{ color: C.txt }}
            onMouseEnter={e => e.currentTarget.style.background = C.tag}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className={contextMenu.playlist.pinned ? "ri-pushpin-fill text-sm text-green-500" : "ri-pushpin-line text-sm"} style={{ color: contextMenu.playlist.pinned ? '#22c55e' : C.txtSub }}></i>
            <span>{contextMenu.playlist.pinned ? 'Bỏ ghim danh sách phát' : 'Ghim danh sách phát lên đầu'}</span>
          </button>

          {/* 2. Edit playlist */}
          <button
            onClick={() => {
              setEditPlaylistName(contextMenu.playlist.name);
              setEditPlaylistCover(contextMenu.playlist.cover || '');
              setEditPlaylistModal(contextMenu.playlist);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
            style={{ color: C.txt }}
            onMouseEnter={e => e.currentTarget.style.background = C.tag}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className="ri-edit-2-line text-sm" style={{ color: C.txtSub }}></i>
            <span>Chỉnh sửa thông tin</span>
          </button>

          {/* 3. Play playlist */}
          <button
            onClick={() => {
              const playlistSongs = songs.filter(s => contextMenu.playlist.songs.includes(s.id));
              if (playlistSongs.length > 0) {
                play(playlistSongs[0], playlistSongs);
              }
              setTab(`playlist_${contextMenu.playlist._id}`);
              setContextMenu(null);
            }}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors text-left cursor-pointer"
            style={{ color: C.txt }}
            onMouseEnter={e => e.currentTarget.style.background = C.tag}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className="ri-play-circle-line text-sm" style={{ color: C.primarySolid }}></i>
            <span>Phát danh sách này</span>
          </button>

          <div className="my-1 border-t" style={{ borderColor: C.border }} />

          {/* 4. Delete playlist */}
          <button
            onClick={() => {
              const target = contextMenu.playlist;
              setContextMenu(null);
              confirmDeletePlaylist(target._id, target.name);
            }}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors text-left text-red-500 cursor-pointer"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className="ri-delete-bin-line text-sm text-red-500"></i>
            <span>Xóa danh sách phát</span>
          </button>
        </div>
      )}

      {/* ── EDIT PLAYLIST DETAILS MODAL ─────────────────── */}
      {editPlaylistModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[130] p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget) setEditPlaylistModal(null); }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl transition-all"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2" style={{ fontFamily: F.heading, fontSize: '20px', fontWeight: 700, color: C.txt }}>
                <i className="ri-edit-2-fill" style={{ color: C.primarySolid }}></i> Chỉnh Sửa Danh Sách Phát
              </h3>
              <button onClick={() => setEditPlaylistModal(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-70 cursor-pointer" style={btn}>
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveEditPlaylist} className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Cover image picker */}
                <div className="relative group shrink-0 w-28 h-28 rounded-2xl overflow-hidden cursor-pointer shadow-md"
                  style={{ border: `2px solid ${C.borderSel || C.primarySolid}` }}
                  onClick={() => playlistCoverInputRef.current?.click()}
                  title="Bấm để tải ảnh đại diện mới cho danh sách phát"
                >
                  {editPlaylistCover ? (
                    <img src={editPlaylistCover} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white" style={{ background: C.primary }}>
                      <i className="ri-folder-music-fill text-3xl mb-1"></i>
                      <span className="text-[10px] font-bold">Chưa có ảnh</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition duration-200">
                    <i className="ri-camera-fill text-2xl mb-1"></i>
                    <span className="text-[10px] font-bold">Đổi ảnh bìa</span>
                  </div>
                  <input type="file" ref={playlistCoverInputRef} accept="image/*" className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setEditPlaylistCover(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {/* Name input */}
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Tên danh sách phát</label>
                  <input type="text" value={editPlaylistName} onChange={e => setEditPlaylistName(e.target.value)}
                    placeholder="Nhập tên playlist..."
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                    autoFocus required
                  />
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color: C.txtFad }}>
                    💡 Tùy chỉnh tên và tải ảnh bìa riêng cho danh sách phát cá nhân.
                  </p>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setEditPlaylistModal(null)}
                  className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition active:scale-95" style={btn}>
                  Hủy
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
                  <i className="ri-save-line"></i> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADMIN CREATE / EDIT USER MODAL ─────────────────── */}
      {adminUserModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[140] p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(14px)' }}
          onClick={e => { if (e.target === e.currentTarget && !adminSaving) setAdminUserModal(null); }}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl transition-all relative overflow-hidden"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

            {/* Flapping Bird Loading Overlay (Hình chim vỗ cánh đang xử lý) */}
            {adminSaving && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-in fade-in duration-200 text-white">
                <div className="text-5xl animate-bounce mb-3">🕊️</div>
                <span className="text-sm font-bold tracking-wide">Đang xử lý dữ liệu...</span>
                <span className="text-[11px] text-white/70 mt-1">Vui lòng chờ trong giây lát</span>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2" style={{ fontFamily: F.heading, fontSize: '20px', fontWeight: 700, color: C.txt }}>
                <i className="ri-user-settings-fill" style={{ color: C.primarySolid }}></i>
                {adminUserModal._id ? 'Chỉnh Sửa Tài Khoản DB' : 'Thêm Tài Khoản Mới DB'}
              </h3>
              <button type="button" disabled={adminSaving} onClick={() => setAdminUserModal(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-70 cursor-pointer" style={btn}>
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveAdminUser} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Họ &amp; Tên người dùng</label>
                <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)}
                  placeholder="Nguyễn Văn A..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  required
                  disabled={adminSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Địa chỉ Email</label>
                <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                  placeholder="user@gmail.com..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  required
                  disabled={adminSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>
                  {adminUserModal._id ? 'Mật khẩu mới (Để trống nếu không đổi)' : 'Mật khẩu'}
                </label>
                <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                  placeholder={adminUserModal._id ? '••••••••' : 'Nhập mật khẩu...'}
                  className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  required={!adminUserModal._id}
                  disabled={adminSaving}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Quyền Hạn (Role)</label>
                {(adminUserModal?.email === 'admin@gmail.com' || adminUserModal?.email === 'unnull@gmail.com' || adminUserModal?._id === 'admin-owner' || adminUserModal?._id === 'user-unnull') ? (
                  <div className="w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between"
                    style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
                    <span>✦ Super Admin Tối Cao</span>
                    <span className="text-[10px] font-normal opacity-80">(Bảo vệ cố định)</span>
                  </div>
                ) : (
                  <select value={adminRole} onChange={e => setAdminRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold outline-none transition cursor-pointer"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                    disabled={adminSaving}
                  >
                    <option value="user">Member (Người dùng nghe nhạc)</option>
                    <option value="admin">Admin (Quản trị viên hệ thống)</option>
                  </select>
                )}
              </div>

              {adminErr && <p className="text-xs font-semibold text-red-500 mt-1">{adminErr}</p>}

              <div className="flex gap-3 mt-3">
                <button type="button" disabled={adminSaving} onClick={() => setAdminUserModal(null)}
                  className="w-28 shrink-0 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95 disabled:opacity-50" style={btn}>
                  Hủy
                </button>
                <button type="submit" disabled={adminSaving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95 disabled:opacity-50"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
                  {adminSaving ? (
                    <>
                      <span className="text-sm animate-bounce inline-block">🕊️</span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i> Lưu vào DB
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOM THEME-MATCHED CONFIRM DELETE MODAL ─────────────────── */}
      {confirmModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[150] p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirmModal(null); }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-7 shadow-2xl text-center flex flex-col items-center gap-4 transition-all"
            style={{
              background: C.isDark ? '#1e293b' : '#fffcf9',
              border: `1.5px solid ${C.border}`,
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}
          >
            {/* Warning Trash Icon Badge */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-red-500 shadow-md"
              style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)' }}
            >
              <i className="ri-delete-bin-6-line text-2xl"></i>
            </div>

            {/* Title & Message */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg font-bold" style={{ fontFamily: F.heading, color: C.txt }}>
                {confirmModal.title || 'Xác nhận xóa'}
              </h3>
              <p className="text-xs leading-relaxed font-medium" style={{ color: C.txtSub }}>
                {confirmModal.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
                style={btn}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(null);
                  if (action) action();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 6px 18px rgba(239, 68, 68, 0.35)'
                }}
              >
                <i className="ri-delete-bin-line text-sm"></i>
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
