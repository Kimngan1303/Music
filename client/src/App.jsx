import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import BubbleCanvas from './components/BubbleCanvas';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';


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
  blue_pastel: {
    key: 'blue_pastel',
    name: 'Pastel Sky Blue (Xanh Dương)',
    icon: '💎',
    category: 'pastel',
    bg: 'linear-gradient(145deg, #c7e8ff 0%, #b5dfff 50%, #c1e4ff 100%)',
    surface: 'rgba(240, 248, 255, 0.92)',
    border: '#93c5fd',
    borderSel: '#3b82f6',
    txt: '#0f2942',
    txtSub: '#1e40af',
    txtFad: '#3b82f6',
    primary: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    primarySolid: '#3b82f6',
    primaryGlow: 'rgba(59, 130, 246, 0.45)',
    tag: '#dbeafe',
    tagBd: '#93c5fd',
    tagTxt: '#1e3a8a',
    btn: '#dbeafe',
    btnBd: '#93c5fd',
    btnTxt: '#2563eb',
  },
  red_pastel: {
    key: 'red_pastel',
    name: 'Pastel Red Soft (Đỏ Nhạt)',
    icon: '🍓',
    category: 'pastel',
    bg: 'linear-gradient(145deg, #fecdd3 0%, #fda4af 50%, #fecdd3 100%)',
    surface: 'rgba(255, 241, 242, 0.92)',
    border: '#fda4af',
    borderSel: '#f43f5e',
    txt: '#4c0519',
    txtSub: '#881337',
    txtFad: '#e11d48',
    primary: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    primarySolid: '#f43f5e',
    primaryGlow: 'rgba(244, 63, 94, 0.45)',
    tag: '#ffe4e6',
    tagBd: '#fda4af',
    tagTxt: '#9f1239',
    btn: '#ffe4e6',
    btnBd: '#fda4af',
    btnTxt: '#e11d48',
  },

  // ── GIAO DIỆN THEO MÙA & NGÀY LỄ ──
  christmas: {
    key: 'christmas',
    name: 'Giáng Sinh & Tuyết Trắng',
    icon: '🎄',
    category: 'seasonal',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #064e3b, #991b1b, #047857, #7f1d1d)',
    surface: 'rgba(15, 35, 25, 0.90)',
    border: 'rgba(239, 68, 68, 0.4)',
    borderSel: '#10b981',
    txt: '#f0fdf4',
    txtSub: '#fca5a5',
    txtFad: '#34d399',
    primary: 'linear-gradient(135deg, #ef4444, #10b981, #f59e0b)',
    primarySolid: '#ef4444',
    primaryGlow: 'rgba(239, 68, 68, 0.45)',
    tag: 'rgba(20, 50, 35, 0.7)',
    tagBd: 'rgba(239, 68, 68, 0.4)',
    tagTxt: '#86efac',
    btn: 'rgba(30, 60, 45, 0.85)',
    btnBd: 'rgba(16, 185, 129, 0.45)',
    btnTxt: '#ef4444',
    isDark: true
  },
  tet_holiday: {
    key: 'tet_holiday',
    name: 'Tết Nguyên Đán & Mùa Xuân',
    icon: '🧧',
    category: 'seasonal',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #991b1b, #b45309, #dc2626, #d97706)',
    surface: 'rgba(45, 15, 15, 0.90)',
    border: 'rgba(251, 191, 36, 0.4)',
    borderSel: '#f59e0b',
    txt: '#fffbeb',
    txtSub: '#fde68a',
    txtFad: '#f87171',
    primary: 'linear-gradient(135deg, #e11d48, #f59e0b, #fbbf24)',
    primarySolid: '#f59e0b',
    primaryGlow: 'rgba(245, 158, 11, 0.45)',
    tag: 'rgba(60, 20, 20, 0.7)',
    tagBd: 'rgba(245, 158, 11, 0.4)',
    tagTxt: '#fde68a',
    btn: 'rgba(70, 25, 25, 0.85)',
    btnBd: 'rgba(245, 158, 11, 0.45)',
    btnTxt: '#fbbf24',
    isDark: true
  },
  mid_autumn: {
    key: 'mid_autumn',
    name: 'Trung Thu Đêm Rằm',
    icon: '🥮',
    category: 'seasonal',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #1e1b4b, #431407, #311042, #78350f)',
    surface: 'rgba(25, 20, 40, 0.90)',
    border: 'rgba(251, 191, 36, 0.4)',
    borderSel: '#fbbf24',
    txt: '#fffbeb',
    txtSub: '#fde047',
    txtFad: '#c084fc',
    primary: 'linear-gradient(135deg, #fbbf24, #c084fc, #f97316)',
    primarySolid: '#fbbf24',
    primaryGlow: 'rgba(251, 191, 36, 0.45)',
    tag: 'rgba(35, 25, 55, 0.7)',
    tagBd: 'rgba(251, 191, 36, 0.4)',
    tagTxt: '#fde047',
    btn: 'rgba(40, 30, 60, 0.85)',
    btnBd: 'rgba(251, 191, 36, 0.45)',
    btnTxt: '#fbbf24',
    isDark: true
  },
  halloween: {
    key: 'halloween',
    name: 'Halloween Đêm Bí Ngô',
    icon: '🎃',
    category: 'seasonal',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #431407, #581c87, #7c2d12, #3b0764)',
    surface: 'rgba(28, 15, 38, 0.90)',
    border: 'rgba(249, 115, 22, 0.4)',
    borderSel: '#a855f7',
    txt: '#faf5ff',
    txtSub: '#fed7aa',
    txtFad: '#e879f9',
    primary: 'linear-gradient(135deg, #ea580c, #a855f7, #f97316)',
    primarySolid: '#f97316',
    primaryGlow: 'rgba(249, 115, 22, 0.45)',
    tag: 'rgba(40, 20, 48, 0.7)',
    tagBd: 'rgba(249, 115, 22, 0.4)',
    tagTxt: '#fed7aa',
    btn: 'rgba(45, 22, 55, 0.85)',
    btnBd: 'rgba(168, 85, 247, 0.45)',
    btnTxt: '#f97316',
    isDark: true
  },
  autumn_season: {
    key: 'autumn_season',
    name: 'Mùa Thu Lá Vàng',
    icon: '🍁',
    category: 'seasonal',
    bg: 'linear-gradient(145deg, #fef3c7 0%, #fde68a 50%, #fef08a 100%)',
    surface: 'rgba(255, 251, 235, 0.92)',
    border: '#fcd34d',
    borderSel: '#d97706',
    txt: '#451a03',
    txtSub: '#78350f',
    txtFad: '#b45309',
    primary: 'linear-gradient(135deg, #d97706, #f59e0b)',
    primarySolid: '#d97706',
    primaryGlow: 'rgba(217, 119, 6, 0.45)',
    tag: '#fef3c7',
    tagBd: '#fcd34d',
    tagTxt: '#92400e',
    btn: '#fef3c7',
    btnBd: '#fcd34d',
    btnTxt: '#d97706',
  },
  summer_season: {
    key: 'summer_season',
    name: 'Mùa Hè Biển Rực Rỡ',
    icon: '🏖️',
    category: 'seasonal',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #0284c7, #0d9488, #eab308, #0284c7)',
    surface: 'rgba(15, 35, 45, 0.90)',
    border: 'rgba(56, 189, 248, 0.4)',
    borderSel: '#38bdf8',
    txt: '#f0f9ff',
    txtSub: '#7dd3fc',
    txtFad: '#fde047',
    primary: 'linear-gradient(135deg, #38bdf8, #facc15, #14b8a6)',
    primarySolid: '#38bdf8',
    primaryGlow: 'rgba(56, 189, 248, 0.45)',
    tag: 'rgba(15, 45, 60, 0.7)',
    tagBd: 'rgba(56, 189, 248, 0.4)',
    tagTxt: '#7dd3fc',
    btn: 'rgba(20, 55, 75, 0.85)',
    btnBd: 'rgba(56, 189, 248, 0.45)',
    btnTxt: '#38bdf8',
    isDark: true
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
    name: 'Cyberpunk Neon Flow',
    icon: '👾',
    category: 'mix',
    isAnimated: true,
    bg: 'linear-gradient(-45deg, #4a1572, #ff2a9d, #00e5ff, #1a0628)',
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

const DYNAMIC_UNLOCK_MILESTONES = {
  ocean_mix: { reqMinutes: 0, label: 'Mở sẵn (Mặc định)' },
  nebula: { reqMinutes: 3000, label: '50 giờ' },
  aurora: { reqMinutes: 9000, label: '150 giờ' },
  cyberpunk: { reqMinutes: 18000, label: '300 giờ' },
  sunset_mix: { reqMinutes: 30000, label: '500 giờ' },
  fire_mix: { reqMinutes: 45000, label: '750 giờ' },
  prisma_mix: { reqMinutes: 60000, label: '1000 giờ (Cực Phẩm 👑)' }
};

const fmtActiveTime = (totalSeconds) => {
  const s = totalSeconds || 0;
  if (s < 60) return `${s} giây`;
  if (s < 3600) return `${Math.floor(s / 60)} phút ${s % 60} giây`;
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  return `${hrs} giờ ${mins} phút`;
};

const getSeasonalPlayBtnClass = (tKey) => {
  if (tKey === 'summer_season') return 'sun-play-btn';
  if (tKey === 'tet_holiday') return 'tet-play-btn';
  if (tKey === 'halloween') return 'halloween-play-btn';
  if (tKey === 'autumn_season') return 'autumn-play-btn';
  if (tKey === 'christmas') return 'christmas-play-btn';
  if (tKey === 'mid_autumn') return 'mid-autumn-play-btn';
  return '';
};

const getThemeLockStatus = (theme, activeSeconds, isAdminUser) => {
  const tKey = theme.key;
  const now = new Date();
  const m = now.getMonth(); // 0 = Jan, 11 = Dec
  const d = now.getDate();

  // 1. DYNAMIC THEMES (Tích lũy thời gian hoạt động online - totalActiveTime)
  if (theme.category === 'mix') {
    const milestone = DYNAMIC_UNLOCK_MILESTONES[tKey] || { reqMinutes: 0, label: 'Miễn phí' };
    const activeMinutes = Math.floor((activeSeconds || 0) / 60);
    const isTimeReached = activeMinutes >= milestone.reqMinutes;
    const isLocked = !isTimeReached && !isAdminUser;
    const remainingMins = Math.max(0, milestone.reqMinutes - activeMinutes);

    return {
      isLocked,
      isDateActive: isTimeReached,
      reqMinutes: milestone.reqMinutes,
      milestoneLabel: milestone.label,
      remainingText: remainingMins > 60 ? `Còn ${(remainingMins / 60).toFixed(1)}h` : `Còn ${remainingMins}p`,
      type: 'dynamic'
    };
  }

  // 2. SEASONAL THEMES (Ngày lễ & Mùa)
  if (theme.category === 'seasonal') {
    let isDateActive = true;
    let periodText = '';
    let holidayLabel = '';

    if (tKey === 'christmas') {
      isDateActive = (m === 11 && d >= 15);
      periodText = '15/12 - 31/12';
      holidayLabel = 'Giáng Sinh';
    } else if (tKey === 'tet_holiday') {
      isDateActive = ((m === 0 && d >= 15) || m === 1);
      periodText = '15/01 - 28/02';
      holidayLabel = 'Tết Nguyên Đán';
    } else if (tKey === 'mid_autumn') {
      isDateActive = (m === 8);
      periodText = 'Tháng 9';
      holidayLabel = 'Trung Thu';
    } else if (tKey === 'halloween') {
      isDateActive = (m === 9 && d >= 15);
      periodText = '15/10 - 31/10';
      holidayLabel = 'Halloween';
    } else if (tKey === 'autumn_season') {
      isDateActive = (m >= 8 && m <= 10);
      periodText = 'Tháng 9 - 11';
      holidayLabel = 'Mùa Thu';
    } else if (tKey === 'summer_season') {
      isDateActive = (m >= 5 && m <= 7);
      periodText = 'Tháng 6 - 8';
      holidayLabel = 'Mùa Hè';
    }

    const isLocked = !isDateActive && !isAdminUser;
    return {
      isLocked,
      isDateActive,
      periodText,
      holidayLabel,
      type: 'seasonal'
    };
  }

  return { isLocked: false, isDateActive: true, type: 'standard' };
};

const getSystemNotifications = (userObj, isAdminUser) => {
  const list = [];
  const activeSecs = userObj?.totalActiveTime || 0;
  const activeMins = Math.floor(activeSecs / 60);

  // 1. Seasonal notifications (Mùa & Ngày Lễ)
  const seasonalThemes = Object.values(THEMES).filter(t => t.category === 'seasonal');
  seasonalThemes.forEach(t => {
    const status = getThemeLockStatus(t, activeSecs, isAdminUser);
    if (status.isDateActive) {
      list.push({
        id: `notif_seasonal_${t.key}`,
        themeKey: t.key,
        themeName: t.name,
        icon: t.icon,
        title: `Mùa & Dịp Lễ: ${t.name}`,
        message: `Đang diễn ra dịp ${status.holidayLabel || 'Lễ'} (${status.periodText}). Nhấp vào để áp dụng ngay!`,
        tag: 'Dịp Lễ',
        tagBg: 'rgba(244, 114, 182, 0.15)',
        tagColor: '#ec4899',
        type: 'seasonal'
      });
    }
  });

  // 2. Dynamic Unlock notifications (Mở khóa theo thời gian)
  Object.entries(DYNAMIC_UNLOCK_MILESTONES).forEach(([tKey, milestone]) => {
    const t = THEMES[tKey];
    if (!t) return;

    if (activeMins >= milestone.reqMinutes || (isAdminUser && milestone.reqMinutes > 0)) {
      let msg = `Bạn đã tích lũy ${milestone.label} thời gian hoạt động online! Giao diện đã được mở khóa.`;
      if (milestone.reqMinutes === 60000) {
        msg = `👑 MỐC KHỦNG 1000 GIỜ! Bạn đã chinh phục giao diện Cực Phẩm Cầu Vồng Prisma Dynamic!`;
      } else if (milestone.reqMinutes === 0) {
        msg = `Giao diện mặc định dành cho tân thủ trải nghiệm không gian âm nhạc.`;
      }

      list.push({
        id: `notif_dynamic_${tKey}`,
        themeKey: tKey,
        themeName: t.name,
        icon: t.icon,
        title: milestone.reqMinutes === 0 ? `✨ Giao diện: ${t.name}` : `🎉 Mở khóa: ${t.name}`,
        message: msg,
        tag: milestone.reqMinutes === 0 ? 'Tân thủ' : milestone.label,
        tagBg: 'rgba(245, 158, 11, 0.15)',
        tagColor: '#f59e0b',
        type: 'dynamic'
      });
    }
  });

  return list;
};

const getLeaderboardBadge = (totalSecs) => {
  const mins = Math.floor((totalSecs || 0) / 60);
  if (mins >= 60000) return { label: '👑 1000h Master', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' };
  if (mins >= 45000) return { label: '🔥 750h Lửa', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
  if (mins >= 30000) return { label: '🌆 500h Sunset', color: '#f97316', bg: 'rgba(249,115,22,0.15)' };
  if (mins >= 18000) return { label: '👾 300h Cyber', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' };
  if (mins >= 9000) return { label: '🌌 150h Aurora', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' };
  if (mins >= 3000) return { label: '🔮 50h Tinh Vân', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' };
  return { label: '🌱 Tân thủ', color: '#10b981', bg: 'rgba(16,185,129,0.15)' };
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

// ─── Precision Center-Aligned SVG Icons ───
// 24x24 SVG coordinate system with origin (0,0) at center (viewBox="-12 -12 24 24")
function PlayIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M-4 -6 C-4 -6.6 -3.3 -7.0 -2.7 -6.6 L5.7 -0.6 C6.3 -0.2 6.3 0.2 5.7 0.6 L-2.7 6.6 C-3.3 7.0 -4 6.6 -4 6 Z" />
    </svg>
  );
}

function PauseIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="-4.5" y="-6" width="3" height="12" rx="1" />
      <rect x="1.5" y="-6" width="3" height="12" rx="1" />
    </svg>
  );
}

// ─── Floating Tooltip Component (Hiển thị nhãn ghi chú phía trên button) ───
function Tooltip({ text, children, className = "" }) {
  if (!text) return children;
  return (
    <div className={`relative group/tooltip ${className || 'inline-flex items-center justify-center'}`}>
      {children}
      <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover/tooltip:flex flex-col items-center pointer-events-none z-[120] whitespace-nowrap transition-all duration-150">
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

// Helper: Parse LRC timestamp string [mm:ss.xx] into array of { time: seconds, text: string }
const parseLrc = (lrcText) => {
  if (!lrcText || typeof lrcText !== 'string') return [];
  const lines = lrcText.split('\n');
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;

  lines.forEach(line => {
    const matches = [...line.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = line.replace(timeRegex, '').trim();
      matches.forEach(m => {
        const min = parseInt(m[1], 10);
        const sec = parseInt(m[2], 10);
        const ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0;
        const totalSeconds = min * 60 + sec + ms / 1000;
        if (text) {
          result.push({ time: totalSeconds, text });
        }
      });
    }
  });

  return result.sort((a, b) => a.time - b.time);
};

// Start with empty library — user adds their own songs
const DEFAULT_SONGS = [];

export default function App() {
  // User Auth & Profile State (Declared at top of component to prevent TDZ ReferenceError)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      if (!saved) return null;
      let userData = JSON.parse(saved);
      return userData;
    } catch {
      return null;
    }
  });

  const isSuperAdminAccount = (acc) => Boolean(acc && (acc.email === 'admin@gmail.com' || acc.email === 'unnull@gmail.com' || acc._id === 'admin-owner' || acc._id === 'user-unnull' || acc.name?.toLowerCase() === 'tyn'));
  const isCurrentSuperAdmin = isSuperAdminAccount(user);
  const isAdmin = Boolean(user && (user.role === 'admin' || isCurrentSuperAdmin));

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
  const [curTime, setCurTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [listenPartyRoom, setListenPartyRoom] = useState(null);
  const [isListenPartyHost, setIsListenPartyHost] = useState(false);
  const [buffering, setBuffering] = useState(false);
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
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const isCreatingPlaylistRef = useRef(false);
  const [songToAdd, setSongToAdd] = useState(null); // Which song is currently selected to be added to a playlist

  // Lyrics State & Auto-Sync
  const [lyricsModal, setLyricsModal] = useState(false);
  const [lyricsData, setLyricsData] = useState(null); // { synced: [{time, text}], plain: string, isSynced: boolean, isCustom: boolean }
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsErr, setLyricsErr] = useState('');
  const [lyricsEditMode, setLyricsEditMode] = useState(false);
  const [customLyricsInput, setCustomLyricsInput] = useState('');
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const lyricsContainerRef = useRef(null);
  const activeLyricRef = useRef(null);

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
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminUserModal, setAdminUserModal] = useState(null); // null, {}, or user object being edited
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAvatar, setAdminAvatar] = useState('');
  const [adminRole, setAdminRole] = useState('user');
  const [adminErr, setAdminErr] = useState('');
  const [adminSaving, setAdminSaving] = useState(false);
  const [directEditUser, setDirectEditUser] = useState(null);
  const [selectedDayStat, setSelectedDayStat] = useState(null);
  const adminListAvatarInputRef = useRef(null);
  const adminFormAvatarInputRef = useRef(null);

  // User Profile Preview Modal State (from Leaderboard Online)
  const [viewUserProfileModal, setViewUserProfileModal] = useState(null); // { user, rank }

  // Social, Direct Messaging & Listen Together States
  const [chatModal, setChatModal] = useState({ open: false, activeUser: null, tab: 'chat' }); // tab: 'chat' | 'friends' | 'listen_party'
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  // Helper to get token config
  const getAuthConfig = () => {
    const savedT = localStorage.getItem('aura_token') || localStorage.getItem('token') || '';
    return savedT ? { headers: { Authorization: `Bearer ${savedT}` } } : {};
  };

  // Fetch Friends List
  const fetchFriendsList = async () => {
    try {
      const res = await axios.get('/api/social/friends', getAuthConfig());
      if (res.data) setFriendsList(res.data);
    } catch (e) { }
  };

  // Fetch Chat Messages
  const fetchChatMessages = async (targetUser) => {
    try {
      const targetId = targetUser ? (targetUser._id || targetUser.id) : 'public';
      const res = await axios.get(`/api/social/messages/${targetId}`, getAuthConfig());
      if (res.data && Array.isArray(res.data)) {
        setChatMessages(res.data);
      }
    } catch (e) { }
  };

  // Send Direct Message or Share Song Card with Messenger-style "Đang gửi..." & "Đã gửi" status
  const handleSendMessage = async (textToSend, songToShare = null) => {
    if (!textToSend && !songToShare) return;

    const tempId = 'temp_' + Date.now();
    const currentName = user?.name || (user?.email ? user.email.split('@')[0] : 'Thành viên');
    const currentAvatar = user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const targetId = chatModal.activeUser ? (chatModal.activeUser._id || chatModal.activeUser.id) : 'public';

    // Optimistic message UI item for Messenger status
    const tempMsg = {
      _id: tempId,
      senderId: user?._id || user?.id || 'current_user',
      senderName: currentName,
      senderAvatar: currentAvatar,
      recipientId: targetId,
      text: textToSend,
      sharedSong: songToShare ? {
        title: getCleanSongTitle(songToShare),
        artist: songToShare.artist || 'Artist',
        thumbnail: songToShare.thumbnail,
        youtubeId: songToShare.youtubeId,
        id: songToShare.id || songToShare._id
      } : null,
      status: 'sending',
      createdAt: new Date()
    };

    setChatMessages(prev => [...prev, tempMsg]);
    setChatInputText('');

    try {
      const res = await axios.post('/api/social/messages', {
        recipientId: targetId,
        senderName: currentName,
        senderAvatar: currentAvatar,
        text: textToSend,
        sharedSong: tempMsg.sharedSong
      }, getAuthConfig());

      if (res.data) {
        setChatMessages(prev => prev.map(m => m._id === tempId ? { ...res.data, status: 'sent' } : m));
      }
    } catch (err) {
      setChatMessages(prev => prev.map(m => m._id === tempId ? { ...m, status: 'sent' } : m));
    }
  };

  // Pending Friend Requests State & Polling
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);

  const fetchPendingFriendRequests = async () => {
    try {
      const res = await axios.get('/api/social/friend-requests/pending', getAuthConfig());
      if (res.data && Array.isArray(res.data)) {
        setPendingFriendRequests(res.data);
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchPendingFriendRequests();
    const interval = setInterval(fetchPendingFriendRequests, 5000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Unread Direct Messages Notification Badges & Alerts
  const [unreadDirectMessages, setUnreadDirectMessages] = useState([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const seenMsgIdsRef = useRef(new Set());

  const fetchUnreadDirectMessages = async () => {
    try {
      const res = await axios.get('/api/social/recent-direct-messages', getAuthConfig());
      if (res.data && Array.isArray(res.data)) {
        const curUserId = user?._id || user?.id || '';
        const unreadList = res.data.filter(m => m.senderId !== curUserId);

        // Alert user if a new direct message arrived
        unreadList.forEach(m => {
          if (!seenMsgIdsRef.current.has(m._id)) {
            seenMsgIdsRef.current.add(m._id);
            if (!chatModal.open || (chatModal.activeUser?._id !== m.senderId && chatModal.activeUser?.id !== m.senderId)) {
              showToast(`💬 ${m.senderName || 'Ai đó'}: "${m.text || 'Đã chia sẻ 1 bài hát'}"`, 'info', 'Tin nhắn mới');
            }
          }
        });

        setUnreadDirectMessages(unreadList);
        setUnreadChatCount(unreadList.length);
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchUnreadDirectMessages();
    const interval = setInterval(fetchUnreadDirectMessages, 3500);
    return () => clearInterval(interval);
  }, [user?._id, chatModal.open]);

  // Active User Search for Friend Request
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [searchUserLoading, setSearchUserLoading] = useState(false);

  const handleSearchUsers = async (queryStr) => {
    setSearchUserQuery(queryStr);
    if (!queryStr || !queryStr.trim()) {
      setSearchUserResults([]);
      return;
    }
    setSearchUserLoading(true);
    try {
      const res = await axios.get(`/api/social/search-users?q=${encodeURIComponent(queryStr.trim())}`, getAuthConfig());
      if (res.data && Array.isArray(res.data)) {
        setSearchUserResults(res.data);
      }
    } catch (e) { }
    setSearchUserLoading(false);
  };

  // Handle Send Friend Request
  const handleSendFriendRequest = async (targetUser, action = 'request') => {
    try {
      const targetId = targetUser?._id || targetUser?.id;
      const res = await axios.post('/api/social/friend-request', { targetUserId: targetId, action }, getAuthConfig());
      showToast(res.data.message || 'Thao tác kết bạn thành công!', 'success', 'Kết bạn');
      fetchFriendsList();
    } catch (err) {
      showToast(err.response?.data?.message || 'Thao tác kết bạn thành công! ✨', 'success', 'Kết bạn');
      fetchFriendsList();
    }
  };

  // Read Conversations Tracker
  const [readConversationMsgIds, setReadConversationMsgIds] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_read_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const markConversationRead = (msgId) => {
    if (!msgId) return;
    setReadConversationMsgIds(prev => {
      if (prev.includes(msgId)) return prev;
      const next = [...prev, msgId];
      localStorage.setItem('aura_read_conversations', JSON.stringify(next));
      return next;
    });
  };

  // Pending Room Invites State & Polling
  const [pendingListenInvites, setPendingListenInvites] = useState([]);
  const seenInviteIdsRef = useRef(new Set());

  const fetchPendingListenInvites = async () => {
    try {
      const res = await axios.get('/api/social/listen-room/invites/pending', getAuthConfig());
      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(inv => {
          if (!seenInviteIdsRef.current.has(inv.id)) {
            seenInviteIdsRef.current.add(inv.id);
            showToast(`🎧 ${inv.hostName} đã mời bạn tham gia Phòng Nghe Nhạc Cùng Nhau!`, 'info', 'Mời Nghe Chung');
          }
        });
        setPendingListenInvites(res.data);
      }
    } catch (e) { }
  };

  useEffect(() => {
    fetchPendingListenInvites();
    const interval = setInterval(fetchPendingListenInvites, 4000);
    return () => clearInterval(interval);
  }, [user?._id]);

  // Send Listen Together Room Invite to a target user
  const handleInviteListenParty = async (targetUser) => {
    try {
      const targetId = targetUser?._id || targetUser?.id;
      const hostName = user?.name || (user?.email ? user.email.split('@')[0] : 'Host');
      const myRoomId = listenPartyRoom?.roomId || `room_${user?._id || user?.id || 'host'}`;

      // Ensure host room is initialized
      await handleSyncListenParty('create');

      // Send backend room notification invite
      await axios.post('/api/social/listen-room/invite', {
        targetUserId: targetId,
        roomId: myRoomId
      }, getAuthConfig());

      // Send interactive invitation card message directly into chat stream
      await axios.post('/api/social/messages', {
        recipientId: targetId,
        text: `🎧 ${hostName} đã gửi lời mời Nghe Nhạc Cùng Nhau`,
        listenInvite: {
          roomId: myRoomId,
          hostId: user?._id || user?.id || 'host',
          hostName: hostName,
          hostAvatar: user?.avatar
        }
      }, getAuthConfig());

      // Automatically open chat modal with active user so invitation card is visible immediately
      setChatModal({ open: true, activeUser: targetUser, tab: 'chat' });
      fetchChatMessages(targetUser);

      showToast(`Đã gửi lời mời nghe nhạc tới ${targetUser?.name || 'thành viên'}! 🎧`, 'success', 'Mời Nghe Nhạc');
    } catch (err) {
      showToast('Lỗi gửi lời mời nghe nhạc', 'error');
    }
  };

  // Leave Listen Together Room
  const handleLeaveListenParty = async () => {
    const activeRoomId = listenPartyRoom?.roomId;
    setListenPartyRoom(null);
    setIsListenPartyHost(false);
    try {
      if (activeRoomId) {
        await axios.post('/api/social/listen-room/sync', {
          roomId: activeRoomId,
          action: 'leave'
        }, getAuthConfig());
      }
    } catch (e) { }
    showToast('Đã rời phòng nghe nhạc chung. Bạn đã tự do điều khiển nhạc độc lập! 🎵', 'info', 'Rời Phòng');
  };

  // Helper to determine if current user is Host
  const checkIfHost = (roomObj) => {
    if (!roomObj || !roomObj.hostId) return false;
    const myId = String(user?._id || user?.id || '');
    const myEmail = String(user?.email || '').toLowerCase();
    const hId = String(roomObj.hostId);
    return (myId && hId === myId) || (myEmail && hId.toLowerCase() === myEmail);
  };

  const updateRoomState = (roomObj) => {
    if (roomObj && roomObj.roomId) {
      setListenPartyRoom(roomObj);
      const isHost = checkIfHost(roomObj);
      setIsListenPartyHost(isHost);
    } else {
      setListenPartyRoom(null);
      setIsListenPartyHost(false);
    }
  };

  // Listen Together Room Sync
  const handleSyncListenParty = async (actionType = 'sync', customTrack = null, customRoomId = null, extraData = {}) => {
    try {
      const targetRoomId = customRoomId || listenPartyRoom?.roomId;
      if (!targetRoomId && actionType !== 'create') return;

      const res = await axios.post('/api/social/listen-room/sync', {
        roomId: targetRoomId || `room_${user?._id || user?.id || 'host'}`,
        track: customTrack || trackRef.current || track,
        curTime: curTimeRef.current || curTime,
        isPlaying: playingRef.current !== undefined ? playingRef.current : playing,
        action: actionType,
        hostId: extraData?.hostId,
        hostName: extraData?.hostName
      }, getAuthConfig());

      if (res.data && res.data.room) {
        updateRoomState(res.data.room);
      } else if (actionType === 'leave') {
        updateRoomState(null);
      }
    } catch (e) { }
  };

  // Polling for chat updates when modal is open
  useEffect(() => {
    if (!chatModal.open) return;
    fetchFriendsList();
    fetchChatMessages(chatModal.activeUser);

    const interval = setInterval(() => {
      fetchChatMessages(chatModal.activeUser);
    }, 2500);

    return () => clearInterval(interval);
  }, [chatModal.open, chatModal.activeUser?._id, chatModal.tab]);

  // Player & Room state refs for smooth non-flickering interval
  const playingRef = useRef(playing);
  const trackRef = useRef(track);
  const curTimeRef = useRef(curTime);
  const listenPartyRoomRef = useRef(listenPartyRoom);
  const isListenPartyHostRef = useRef(isListenPartyHost);

  useEffect(() => { playingRef.current = playing; }, [playing]);
  useEffect(() => { trackRef.current = track; }, [track]);
  useEffect(() => { curTimeRef.current = curTime; }, [curTime]);
  useEffect(() => { listenPartyRoomRef.current = listenPartyRoom; }, [listenPartyRoom]);
  useEffect(() => { isListenPartyHostRef.current = isListenPartyHost; }, [isListenPartyHost]);

  // Real-time Listen Together Room & Audio Sync Engine (Smooth Non-flickering)
  useEffect(() => {
    const curRoomId = listenPartyRoom?.roomId;
    if (!curRoomId) return;

    const interval = setInterval(async () => {
      try {
        const activeRoom = listenPartyRoomRef.current;
        if (!activeRoom || !activeRoom.roomId) return;

        if (isListenPartyHostRef.current) {
          // Host continuously broadcasts current playback timeline & status to server
          await handleSyncListenParty('sync');
        } else {
          // Member fetches Host's latest state
          const res = await axios.get(`/api/social/listen-room/${activeRoom.roomId}`);
          if (res.data && res.data.active && res.data.room) {
            updateRoomState(res.data.room);
          }
        }
      } catch (e) { }
    }, 1200);

    return () => clearInterval(interval);
  }, [listenPartyRoom?.roomId, isListenPartyHost]);

  // Audio Sync for joined Listen Together Room members
  useEffect(() => {
    if (!listenPartyRoom || isListenPartyHost || !listenPartyRoom.track) return;
    const roomT = listenPartyRoom.track;

    // 1. Sync Song selection
    if (!track || (track.id !== roomT.id && track.youtubeId !== roomT.youtubeId)) {
      play(roomT);
      showToast(`🎧 Host ${listenPartyRoom.hostName} đang phát bài hát mới!`, 'info', 'Đồng Bộ Nhạc');
    }

    // 2. Sync Play/Pause status from Host
    if (listenPartyRoom.isPlaying !== undefined && listenPartyRoom.isPlaying !== playing) {
      if (listenPartyRoom.isPlaying) {
        yt.current?.playVideo?.();
        setPlaying(true);
      } else {
        yt.current?.pauseVideo?.();
        setPlaying(false);
      }
    }

    // 3. Sync Timeline Seek position if drift > 3.5 seconds
    if (typeof listenPartyRoom.curTime === 'number' && typeof curTime === 'number') {
      if (Math.abs(curTime - listenPartyRoom.curTime) > 3.5) {
        yt.current?.seekTo?.(listenPartyRoom.curTime, true);
      }
    }
  }, [listenPartyRoom?.updatedAt, listenPartyRoom?.track?.id, listenPartyRoom?.isPlaying]);


  const [query, setQuery] = useState(''); // Header global online search query
  const [localFilterQuery, setLocalFilterQuery] = useState(''); // Spotify-style local song filter query
  const [sidebarQuery, setSidebarQuery] = useState(''); // Spotify-style sidebar playlist filter query
  const [showSidebarSearch, setShowSidebarSearch] = useState(false);
  const [vol, setVol] = useState(() => {
    const saved = localStorage.getItem('aura_volume');
    return saved !== null ? Math.min(100, Math.max(0, parseInt(saved, 10))) : 80;
  });
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem('aura_muted') === 'true';
  });

  const volRef = useRef(vol);
  const mutedRef = useRef(muted);

  const applyVolume = () => {
    try {
      if (mutedRef.current || volRef.current === 0) {
        yt.current?.mute?.();
        yt.current?.setVolume?.(0);
      } else {
        yt.current?.unMute?.();
        yt.current?.setVolume?.(volRef.current);
      }
    } catch { }
  };
  const [sleepTimer, setSleepTimer] = useState(0);
  const [sleepTimeLeft, setSleepTimeLeft] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const [addTab, setAddTab] = useState('youtube'); // 'youtube' | 'spotify' | 'playlist'
  const [ytUrl, setYtUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState('');

  // User Auth & Profile State moved to top of App component to prevent TDZ ReferenceError


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
  const [lockedThemeNotice, setLockedThemeNotice] = useState('');
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const avatarFileInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Change Password States
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });

  // Batch Select States
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [confirmBatchDeleteModal, setConfirmBatchDeleteModal] = useState(false);

  // Pagination State for Song List (to prevent lag when rendering 800+ songs)
  const [songPage, setSongPage] = useState(1);
  const [showAllSongs, setShowAllSongs] = useState(false);
  const SONGS_PER_PAGE = 40;

  // Toast Popup Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success', title: '' });

  const showToast = (message, type = 'success', title = '') => {
    let defaultTitle = 'Thành công 🎉';
    if (type === 'error') defaultTitle = 'Thông báo lỗi ⚠️';
    else if (type === 'info') defaultTitle = 'Đang phát nhạc 🎵';
    else if (type === 'warning') defaultTitle = 'Lưu ý ⚠️';

    setToast({
      show: true,
      message,
      type,
      title: title || defaultTitle
    });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Fetch Lyrics for current track
  const fetchLyrics = async (targetTrack) => {
    if (!targetTrack) return;
    setLyricsLoading(true);
    setLyricsErr('');
    setLyricsData(null);
    setActiveLyricIndex(-1);

    const uid = user?._id || 'guest';
    const localCustomKey = `aura_lyrics_${uid}_${targetTrack.id || targetTrack._id || targetTrack.youtubeId}`;
    const savedCustom = localStorage.getItem(localCustomKey);

    if (savedCustom) {
      const parsedLrc = parseLrc(savedCustom);
      const isSynced = parsedLrc.length > 0;
      setLyricsData({
        synced: parsedLrc,
        plain: savedCustom,
        isSynced,
        isCustom: true
      });
      setCustomLyricsInput(savedCustom);
      setLyricsLoading(false);
      return;
    }

    // 1. Try Backend lyrics endpoint first
    try {
      const res = await axios.get(`/api/music/lyrics?title=${encodeURIComponent(targetTrack.title)}&artist=${encodeURIComponent(targetTrack.artist || '')}`);
      if (res.data && (res.data.syncedLyrics || res.data.plainLyrics)) {
        const synced = parseLrc(res.data.syncedLyrics);
        const isSynced = synced.length > 0;
        setLyricsData({
          synced,
          plain: res.data.plainLyrics || res.data.syncedLyrics || '',
          isSynced,
          isCustom: false,
          source: res.data.source || ''
        });
        setCustomLyricsInput(res.data.syncedLyrics || res.data.plainLyrics || '');
        setLyricsLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend lyrics API fallback to direct LRCLIB...");
    }

    // 2. Direct Frontend Gemini AI & LRCLIB fallback search
    try {
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (geminiKey) {
        const promptText = `Extract exact track_name and artist_name as JSON {"track_name": "...", "artist_name": "..."} from title "${targetTrack.title}" and artist "${targetTrack.artist || ''}". Output JSON only.`;
        
        const aiRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
        }, { timeout: 3500 });

        const reply = aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          const parsed = JSON.parse(reply.replace(/```json|```/g, '').trim());
          if (parsed?.track_name) {
            const aiQuery = `${parsed.track_name} ${parsed.artist_name || ''}`.trim();
            const lrclibDirectRes = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(aiQuery)}`);
            if (lrclibDirectRes.data && Array.isArray(lrclibDirectRes.data) && lrclibDirectRes.data.length > 0) {
              const match = lrclibDirectRes.data.find(item => item.syncedLyrics && item.syncedLyrics.trim()) ||
                            lrclibDirectRes.data.find(item => item.plainLyrics && item.plainLyrics.trim()) ||
                            lrclibDirectRes.data[0];
              if (match && (match.syncedLyrics || match.plainLyrics)) {
                const synced = parseLrc(match.syncedLyrics);
                setLyricsData({
                  synced,
                  plain: match.plainLyrics || match.syncedLyrics || '',
                  isSynced: synced.length > 0,
                  isCustom: false
                });
                setCustomLyricsInput(match.syncedLyrics || match.plainLyrics || '');
                setLyricsLoading(false);
                return;
              }
            }
          }
        }
      }
    } catch (e) { }

    // 3. Direct Frontend LRCLIB fallback search (with Artist vs Title position detection)
    try {
      const cleanT = (targetTrack.title || '').replace(/[\(\[\{](official|mv|video|audio|lyric|remix|lofi|tiktok).*?[\)\]\}]/gi, '').trim();
      const parts = cleanT.split(/–|—|-|:|\|/).map(p => p.trim()).filter(Boolean);
      const cleanA = (targetTrack.artist || '').toLowerCase();

      let candidates = [];
      if (parts.length >= 2) {
        if (cleanA && parts[0].toLowerCase().includes(cleanA)) {
          candidates.push(parts.slice(1).join(' ')); // Right side is song title
          candidates.push(parts[0]);
        } else {
          candidates.push(parts[0]); // Left side is song title
          candidates.push(parts.slice(1).join(' '));
        }
      } else {
        candidates.push(cleanT);
      }

      const queries = [];
      for (const cand of candidates) {
        const base = cand.replace(/[\(\[\{].*?[\)\]\}]/g, '').replace(/ft\..*|feat\..*/gi, '').trim();
        const words = base.split(' ').filter(Boolean);
        const shortT = words.length <= 3 ? words.join(' ') : (words.length <= 6 ? words.slice(0, 4).join(' ') : words.slice(0, 5).join(' '));
        if (shortT) queries.push(shortT);
        if (base) queries.push(base);
      }

      const uniqueQueries = queries.filter((v, i, a) => v && a.indexOf(v) === i);

      for (const qStr of uniqueQueries) {
        const lrclibDirectRes = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(qStr)}`);
        if (lrclibDirectRes.data && Array.isArray(lrclibDirectRes.data) && lrclibDirectRes.data.length > 0) {
          const match = lrclibDirectRes.data.find(item => item.syncedLyrics && item.syncedLyrics.trim()) ||
                        lrclibDirectRes.data.find(item => item.plainLyrics && item.plainLyrics.trim()) ||
                        lrclibDirectRes.data[0];
          if (match && (match.syncedLyrics || match.plainLyrics)) {
            const synced = parseLrc(match.syncedLyrics);
            const isSynced = synced.length > 0;
            setLyricsData({
              synced,
              plain: match.plainLyrics || match.syncedLyrics || '',
              isSynced,
              isCustom: false
            });
            setCustomLyricsInput(match.syncedLyrics || match.plainLyrics || '');
            setLyricsLoading(false);
            return;
          }
        }
      }
    } catch (e) { }

    setLyricsErr('Không tìm thấy lời bài hát tự động. Bạn có thể tự dán lời bài hát bên dưới!');
    setLyricsLoading(false);
  };

  useEffect(() => {
    if (lyricsModal && track) {
      fetchLyrics(track);
    }
  }, [track?.id, track?.youtubeId, lyricsModal]);

  // Auto-highlight & auto-scroll lyric line during playback
  useEffect(() => {
    if (!lyricsData || !lyricsData.isSynced || lyricsData.synced.length === 0) return;
    const synced = lyricsData.synced;

    let currentIndex = -1;
    for (let i = 0; i < synced.length; i++) {
      if (curTime >= synced[i].time - 0.3) {
        currentIndex = i;
      } else {
        break;
      }
    }

    if (currentIndex !== activeLyricIndex) {
      setActiveLyricIndex(currentIndex);
      if (activeLyricRef.current) {
        activeLyricRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [curTime, lyricsData]);

  const handleSaveCustomLyrics = () => {
    if (!track) return;
    const uid = user?._id || 'guest';
    const localCustomKey = `aura_lyrics_${uid}_${track.id || track._id || track.youtubeId}`;

    if (!customLyricsInput.trim()) {
      localStorage.removeItem(localCustomKey);
      fetchLyrics(track);
    } else {
      localStorage.setItem(localCustomKey, customLyricsInput.trim());
      const parsedLrc = parseLrc(customLyricsInput.trim());
      setLyricsData({
        synced: parsedLrc,
        plain: customLyricsInput.trim(),
        isSynced: parsedLrc.length > 0,
        isCustom: true
      });
      showToast('Đã lưu lời bài hát tùy chỉnh!', 'success', 'Lời Bài Hát 🎵');
    }
    setLyricsEditMode(false);
  };

  const getCleanSongTitle = (targetTrack) => {
    if (!targetTrack || !targetTrack.title) return '';
    let title = targetTrack.title;
    const cleanA = (targetTrack.artist || '').toLowerCase();

    let cleaned = title.replace(/[\(\[\{](official|mv|video|audio|lyric|live|remix|lofi|tiktok|full).*?[\)\]\}]/gi, '');

    const parts = cleaned.split(/–|—|-|:|\|/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      if (cleanA && parts[0].toLowerCase().includes(cleanA)) {
        cleaned = parts.slice(1).join(' ');
      } else if (cleanA && parts[parts.length - 1].toLowerCase().includes(cleanA)) {
        cleaned = parts.slice(0, -1).join(' ');
      } else {
        cleaned = parts[1] || parts[0];
      }
    }

    cleaned = cleaned.replace(/ft\..*|feat\..*/gi, '').trim();
    return cleaned || targetTrack.title;
  };

  // Helper to compress avatar image to ~15KB - 25KB WebP/JPEG (max 250x250)
  const compressImage = (file, maxWidth = 250, maxHeight = 250, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Scroll Position State for Sticky Header Navigation
  const [mainScrollTop, setMainScrollTop] = useState(0);

  // System OS Picture-in-Picture Window State & Height Tracking (With Ref Sync for Stale Closure Prevention)
  const [pipWindow, setPipWindow] = useState(null);
  const pipWindowRef = useRef(null);
  const [pipHeight, setPipHeight] = useState(380);

  const updatePipWindow = (win) => {
    pipWindowRef.current = win;
    setPipWindow(win);
  };

  // Mobile iOS / Android Video Picture-in-Picture State & Refs
  const mobileCanvasRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [mobilePipActive, setMobilePipActive] = useState(false);
  const mobilePipActiveRef = useRef(false);

  const updateMobilePipActive = (active) => {
    mobilePipActiveRef.current = active;
    setMobilePipActive(active);
  };

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
      const authToken = user?.token || localStorage.getItem('aura_token');
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${authToken}` } }).then(res => {
        const dbProfile = res.data;
        const updatedUser = { ...user, token: authToken, name: dbProfile.name, avatar: dbProfile.avatar, favorites: dbProfile.favorites, totalActiveTime: dbProfile.totalActiveTime };
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

  // Reset song page when tab or search query changes
  useEffect(() => {
    setSongPage(1);
  }, [tab, query]);

  // ── HEARTBEAT: Ping server every 5s to update lastSeen & totalActiveTime ──
  useEffect(() => {
    const authToken = user?.token || localStorage.getItem('aura_token');
    if (!authToken) return;

    const sendHeartbeat = () => {
      const token = user?.token || localStorage.getItem('aura_token');
      if (!token) return;
      axios.post('/api/auth/heartbeat', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data?.totalActiveTime !== undefined) {
          setUser(prev => prev ? ({ ...prev, totalActiveTime: res.data.totalActiveTime }) : prev);
        }
      }).catch(() => { });
    };

    sendHeartbeat(); // ping immediately on login/mount

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const hbInterval = setInterval(sendHeartbeat, 5000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(hbInterval);
    };
  }, [user?.token, user?._id]);

  // Local active timer (increments active time by 1s every second for smooth UI count)
  useEffect(() => {
    const timer = setInterval(() => {
      setUser(prev => {
        if (!prev) return prev;
        const curActive = prev.totalActiveTime || 0;
        return { ...prev, totalActiveTime: curActive + 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme State & Persistent Selection
  const [themeKey, setThemeKeyRaw] = useState(() => {
    return localStorage.getItem('aura_theme_key') || 'aurora';
  });

  const setThemeKey = (key) => {
    setThemeKeyRaw(key);
    localStorage.setItem('aura_theme_key', key);
  };

  const [themeCategory, setThemeCategory] = useState('mix');

  // Notification system state
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const readNotifsKey = uid => `aura_read_notifs_${uid || 'guest'}`;
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem(readNotifsKey(initUserId));
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const markNotifRead = (id) => {
    setReadNotifIds(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (safePrev.includes(id)) return safePrev;
      const updated = [...safePrev, id];
      localStorage.setItem(readNotifsKey(user?._id), JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotifsRead = () => {
    const notifs = getSystemNotifications(user, isAdmin);
    const ids = Array.isArray(notifs) ? notifs.map(n => n.id) : [];
    setReadNotifIds(ids);
    localStorage.setItem(readNotifsKey(user?._id), JSON.stringify(ids));
  };

  const systemNotifs = Array.isArray(getSystemNotifications(user, isAdmin)) ? getSystemNotifications(user, isAdmin) : [];
  const safeReadNotifIds = Array.isArray(readNotifIds) ? readNotifIds : [];
  const unreadNotifsCount = systemNotifs.filter(n => n && n.id && !safeReadNotifIds.includes(n.id)).length;

  // Public Leaderboard State (Top 10 users)
  const [publicLeaderboard, setPublicLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  // Global Popular Songs State (Top songs listened by all users)
  const [popularSongs, setPopularSongs] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = () => {
      axios.get('/api/leaderboard').then(res => {
        if (Array.isArray(res.data)) {
          setPublicLeaderboard(res.data.slice(0, 10));
        }
      }).catch(() => { }).finally(() => setLeaderboardLoading(false));
    };
    const fetchPopular = () => {
      axios.get('/api/music/popular').then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPopularSongs(res.data);
        }
      }).catch(() => { });
    };

    fetchLeaderboard();
    fetchPopular();
    const interval = setInterval(() => {
      fetchLeaderboard();
      fetchPopular();
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Listen Time tracking state (accumulated active music play time in seconds)
  const listenSecondsKey = uid => `aura_listen_seconds_${uid || 'guest'}`;
  const [listenSeconds, setListenSeconds] = useState(() => {
    const saved = localStorage.getItem(listenSecondsKey(initUserId));
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    const saved = localStorage.getItem(listenSecondsKey(user?._id));
    if (saved) setListenSeconds(parseInt(saved, 10));
  }, [user?._id]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setListenSeconds(prev => {
        const next = prev + 1;
        localStorage.setItem(listenSecondsKey(user?._id), next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, user?._id]);

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

  // Online YouTube Search state
  const [onlineSearchQuery, setOnlineSearchQuery] = useState('');
  const [onlineSearchResults, setOnlineSearchResults] = useState([]);
  const [onlineSearching, setOnlineSearching] = useState(false);
  const [onlineSearchErr, setOnlineSearchErr] = useState('');

  const activePlaylist = tab.startsWith('playlist_') ? playlists.find(p => p._id === tab.split('_')[1]) : null;

  const allKnownSongs = useMemo(() => {
    const list = [...(Array.isArray(songs) ? songs : []), ...(Array.isArray(popularSongs) ? popularSongs : [])];
    const unique = [];
    const seen = new Set();
    list.forEach(s => {
      if (!s) return;
      const key = s.id || s._id || s.youtubeId;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push(s);
      }
    });
    return unique;
  }, [songs, popularSongs]);

  const isFav = (sOrId) => {
    if (!sOrId) return false;
    const safeFavs = Array.isArray(favs) ? favs : [];
    if (safeFavs.length === 0) return false;
    if (typeof sOrId === 'object') {
      return Boolean(
        (sOrId.id && safeFavs.includes(sOrId.id)) ||
        (sOrId._id && safeFavs.includes(sOrId._id))
      );
    }
    return safeFavs.includes(sOrId);
  };

  const findSongById = (id) => {
    if (!id) return null;
    if (typeof id === 'object') return id;
    const idStr = String(id);
    return allKnownSongs.find(s =>
      (s && s.id && String(s.id) === idStr) ||
      (s && s._id && String(s._id) === idStr) ||
      (s && s.youtubeId && String(s.youtubeId) === idStr)
    ) || null;
  };

  const getBaseList = () => {
    if (tab.startsWith('playlist_') && activePlaylist) {
      return (activePlaylist.songs || []).map(id => typeof id === 'object' ? id : findSongById(id)).filter(Boolean);
    }
    if (tab === 'favorites') {
      return allKnownSongs.filter(s => isFav(s));
    }
    return (Array.isArray(songs) ? songs : []).filter(s => s && s.inLibrary !== false);
  };

  const list = getBaseList()
    .filter(s => !localFilterQuery || s.title.toLowerCase().includes(localFilterQuery.toLowerCase()) || s.artist.toLowerCase().includes(localFilterQuery.toLowerCase()));

  const totalSongPages = Math.ceil(list.length / SONGS_PER_PAGE) || 1;
  const currentSongPage = Math.min(Math.max(1, songPage), totalSongPages);
  const paginatedList = showAllSongs
    ? list
    : list.slice((currentSongPage - 1) * SONGS_PER_PAGE, currentSongPage * SONGS_PER_PAGE);

  const getCurrentTrackList = () => {
    // 1. If playingQueue state is active and valid (highest priority)
    if (playingQueue && playingQueue.length > 0) {
      return playingQueue;
    }

    // 2. If currently viewing a specific playlist tab, use songs in that playlist
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

    // 3. If currently viewing Favorites tab, use favorite songs
    if (tab === 'favorites') {
      const favSongs = allKnownSongs.filter(s => isFav(s));
      if (favSongs.length > 0) return favSongs;
    }

    // 4. Default: current displayed list or library songs
    if (list && list.length > 0) return list;
    const libSongs = (Array.isArray(songs) ? songs : []).filter(s => s && s.inLibrary !== false);
    return libSongs.length > 0 ? libSongs : songs;
  };

  // Current active theme tokens
  const C = THEMES[themeKey] || THEMES.nude;

  // Sync slider accent & theme colors to root CSS variables whenever theme changes
  useEffect(() => {
    if (C) {
      const root = document.documentElement;
      const primaryColor = C.primarySolid || C.primary || '#2dd4bf';
      const glowColor = C.primaryGlow || 'rgba(45, 212, 191, 0.45)';
      root.style.setProperty('--accent-color', primaryColor);
      root.style.setProperty('--accent-glow', glowColor);
      root.style.setProperty('--theme-primary', primaryColor);
      root.style.setProperty('--theme-glow', glowColor);
    }
  }, [themeKey, C]);

  const yt = useRef(null);

  // Sync profile edit state ONLY when opening profile dropdown (prevents timer updates from resetting avatar preview)
  useEffect(() => {
    if (profileDropdown && user) {
      setEditName(user.name || '');
      setEditAvatar(user.avatar || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDropdown]);

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

  // Click outside to auto-close notification dropdown menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    if (showNotifMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifMenu]);

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

  // Batch Select Helper Functions
  const toggleSelectSong = (songId) => {
    setSelectedSongIds(prev =>
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const handleToggleSelectAll = (currentList) => {
    const currentIds = currentList.map(s => s.id);
    const isAllSelected = currentIds.length > 0 && currentIds.every(id => selectedSongIds.includes(id));
    if (isAllSelected) {
      setSelectedSongIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      setSelectedSongIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleBatchFavorite = () => {
    if (selectedSongIds.length === 0) return;
    setFavs(prev => {
      const allSelectedAreFavs = selectedSongIds.every(id => prev.includes(id));
      let updated;
      if (allSelectedAreFavs) {
        updated = prev.filter(id => !selectedSongIds.includes(id));
      } else {
        updated = Array.from(new Set([...prev, ...selectedSongIds]));
      }

      const uid = user?._id || 'guest';
      localStorage.setItem(favsKey(uid), JSON.stringify(updated));

      const token = user?.token || localStorage.getItem('aura_token');
      if (token) {
        axios.put('/api/auth/profile', { favorites: updated }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error("Failed to sync favorites", err));
      }
      return updated;
    });
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedSongIds.length === 0) return;
    const idsToDelete = [...selectedSongIds];

    if (activePlaylist) {
      // Remove batch from current active playlist
      try {
        const remainingSongIds = (activePlaylist.songs || []).filter(id => !idsToDelete.includes(id));
        await axios.put(`/api/playlists/${activePlaylist._id}/songs`, { songs: remainingSongIds });
        setPlaylists(prev => prev.map(p => p._id === activePlaylist._id ? { ...p, songs: remainingSongIds } : p));
      } catch (err) {
        console.error("Batch delete from playlist error:", err);
      }
    } else {
      // Delete batch from main library
      const remainingSongs = songs.filter(s => !idsToDelete.includes(s.id));
      setSongs(remainingSongs);
      const uid = user?._id || 'guest';
      localStorage.setItem(songsKey(uid), JSON.stringify(remainingSongs));

      setFavs(prevFavs => {
        const updatedFavs = prevFavs.filter(id => !idsToDelete.includes(id));
        if (user) {
          localStorage.setItem(favsKey(user._id), JSON.stringify(updatedFavs));
          const token = user.token || localStorage.getItem('aura_token');
          if (token) {
            axios.put('/api/auth/profile', { favorites: updatedFavs }, {
              headers: { Authorization: `Bearer ${token}` }
            }).catch(() => { });
          }
        }
        return updatedFavs;
      });

      setPlaylists(prev => {
        const updated = prev.map(pl => ({
          ...pl,
          songs: (pl.songs || []).filter(sId => !idsToDelete.includes(sId))
        }));
        if (user) localStorage.setItem(playlistsKey(user._id), JSON.stringify(updated));
        return updated;
      });

      try {
        await axios.post('/api/music/batch-delete', { ids: idsToDelete });
      } catch (err) {
        console.error("Batch delete API error:", err);
      }
    }

    setSelectedSongIds([]);
    setIsSelectMode(false);
    setConfirmBatchDeleteModal(false);
  };

  // Helper to calculate total playback duration of a song list
  const calculateTotalDuration = (songList) => {
    let totalSeconds = 0;
    (songList || []).forEach(s => {
      if (!s.duration) return;
      const parts = s.duration.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        totalSeconds += parts[0] * 60 + parts[1];
      } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    });
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) {
      return `khoảng ${hrs} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  // Get saved PiP window size from localStorage (default compact size: 320x340)
  const getSavedPipSize = () => {
    try {
      const saved = localStorage.getItem('aura_pip_size');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.width >= 240 && parsed.height >= 260) return parsed;
      }
    } catch (e) { }
    return { width: 320, height: 340 };
  };

  // Open Native OS System Level Picture-in-Picture window (Floats ALWAYS ON TOP across Windows Desktop & All Browser Tabs)
  const togglePipWindow = async () => {
    if ('documentPictureInPicture' in window) {
      try {
        if (pipWindowRef.current) {
          try { pipWindowRef.current.close(); } catch (e) { }
          updatePipWindow(null);
          return;
        }

        const initialSize = getSavedPipSize();

        const pipWin = await window.documentPictureInPicture.requestWindow({
          width: initialSize.width,
          height: initialSize.height,
        });

        // Listen for resize event to track window height and save user's custom window size into localStorage
        pipWin.addEventListener('resize', () => {
          setPipHeight(pipWin.innerHeight);
          try {
            const newSize = { width: pipWin.innerWidth, height: pipWin.innerHeight };
            localStorage.setItem('aura_pip_size', JSON.stringify(newSize));
          } catch (e) { }
        });
        setPipHeight(pipWin.innerHeight || initialSize.height);

        // Copy active document stylesheets into PiP window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules].map(r => r.cssText).join('');
            const style = pipWin.document.createElement('style');
            style.textContent = cssRules;
            pipWin.document.head.appendChild(style);
          } catch (e) {
            if (styleSheet.href) {
              const link = pipWin.document.createElement('link');
              link.rel = 'stylesheet';
              link.href = styleSheet.href;
              pipWin.document.head.appendChild(link);
            }
          }
        });

        // Include Remixicon font CSS inside PiP window
        const iconLink = pipWin.document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css';
        pipWin.document.head.appendChild(iconLink);

        // Apply rounded corner styling and body overflow hidden to PiP window
        pipWin.document.documentElement.style.borderRadius = '20px';
        pipWin.document.documentElement.style.overflow = 'hidden';
        pipWin.document.body.style.margin = '0';
        pipWin.document.body.style.padding = '0';
        pipWin.document.body.style.width = '100%';
        pipWin.document.body.style.height = '100%';
        pipWin.document.body.style.overflow = 'hidden';
        pipWin.document.body.style.borderRadius = '20px';
        pipWin.document.body.style.background = C.isDark ? '#121214' : '#1e1e24';

        pipWin.addEventListener('pagehide', () => {
          updatePipWindow(null);
        });

        updatePipWindow(pipWin);
      } catch (err) {
        console.error('Lỗi mở System PiP Window:', err);
        updatePipWindow(null);
      }
    }
  };

  // Update canvas artwork & text for Mobile Video Picture-in-Picture
  const updateMobileCanvas = () => {
    const canvas = mobileCanvasRef.current;
    if (!canvas || !track) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = C.isDark ? '#121214' : '#1e1e24';
    ctx.fillRect(0, 0, 480, 480);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 40, 30, 400, 360);
      const grad = ctx.createLinearGradient(0, 300, 0, 480);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 300, 480, 180);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(track.title || '', 40, 420);
      ctx.fillStyle = C.primarySolid || '#f43f5e';
      ctx.font = '16px sans-serif';
      ctx.fillText(track.artist || 'Aura Music', 40, 450);
    };
    img.src = track.thumbnail || '/default-cover.png';
  };

  // Trigger Mobile System Video Picture-in-Picture (for iPhone iOS / iPad / Android)
  const triggerMobilePip = async () => {
    try {
      // Find active video element (YouTube iframe or HTML5 video or canvas video ref)
      let videoEl = null;

      // 1. Try to find video inside YouTube player iframe
      const iframe = document.querySelector('#yt-player iframe');
      if (iframe) {
        try {
          const iframeVideo = iframe.contentWindow?.document?.querySelector('video');
          if (iframeVideo) videoEl = iframeVideo;
        } catch (e) { }
      }

      // 2. Try any video element on page
      if (!videoEl) {
        videoEl = document.querySelector('video');
      }

      // 3. Fallback to custom canvas video ref
      if (!videoEl && mobileVideoRef.current) {
        updateMobileCanvas();
        if (mobileCanvasRef.current) {
          try {
            if (!mobileVideoRef.current.srcObject) {
              const stream = mobileCanvasRef.current.captureStream(15);
              mobileVideoRef.current.srcObject = stream;
            }
            await mobileVideoRef.current.play().catch(() => { });
          } catch (e) { }
        }
        videoEl = mobileVideoRef.current;
      }

      if (!videoEl) return;

      // Apple iOS Safari Native Picture-in-Picture API for iPhone / iPad
      if (videoEl.webkitSetPresentationMode) {
        const isCurrentlyPip = videoEl.webkitPresentationMode === 'picture-in-picture';
        videoEl.webkitSetPresentationMode(isCurrentlyPip ? 'inline' : 'picture-in-picture');
        updateMobilePipActive(!isCurrentlyPip);
        return;
      }

      // Standard W3C HTML5 Picture-in-Picture API
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        updateMobilePipActive(false);
      } else if (videoEl.requestPictureInPicture) {
        await videoEl.requestPictureInPicture();
        updateMobilePipActive(true);
      }
    } catch (e) {
      console.log('Mobile PiP Error:', e);
    }
  };

  // Auto-Launch OS Picture-in-Picture window when switching tabs while playing (YouTube & Spotify Web standard behavior)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && playing && track) {
        // Tab is hidden / inactive -> Auto launch floating mini player window if not open
        if ('documentPictureInPicture' in window && !pipWindowRef.current) {
          try { await togglePipWindow(); } catch (e) { }
        } else if (!pipWindowRef.current && !mobilePipActiveRef.current) {
          try { await triggerMobilePip(); } catch (e) { }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [playing, track]);

  // MediaSession API Integration for Mobile iOS & Android Lockscreen / Control Center Media Controls
  useEffect(() => {
    if ('mediaSession' in navigator && track) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist || 'Aura Music',
          album: 'LittleLove Music',
          artwork: track.thumbnail ? [
            { src: track.thumbnail, sizes: '512x512', type: 'image/png' },
            { src: track.thumbnail, sizes: '256x256', type: 'image/png' },
            { src: track.thumbnail, sizes: '128x128', type: 'image/png' },
          ] : []
        });

        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';

        if (dur && !isNaN(dur) && curTime !== undefined) {
          try {
            navigator.mediaSession.setPositionState({
              duration: Math.max(0, dur),
              playbackRate: 1,
              position: Math.min(Math.max(0, curTime), dur)
            });
          } catch (e) { }
        }

        navigator.mediaSession.setActionHandler('play', () => togglePlay());
        navigator.mediaSession.setActionHandler('pause', () => togglePlay());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      } catch (e) {
        console.error('MediaSession error:', e);
      }
    }
  }, [track, playing, curTime, dur]);

  // Handle local avatar image upload from computer (with auto 250x250 compression)
  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 250, 250, 0.82);
        setEditAvatar(compressedBase64);
      } catch (err) {
        console.error("Failed to compress avatar", err);
        alert("Có lỗi khi xử lý ảnh đại diện.");
      }
    }
    e.target.value = null;
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
          onReady: () => {
            try {
              yt.current?.setPlaybackQuality?.('small');
              applyVolume();
            } catch { }
          },
          onStateChange: e => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.BUFFERING) {
              setBuffering(true);
            }
            else if (e.data === window.YT.PlayerState.PLAYING) {
              setPlaying(true);
              setBuffering(false);
              try {
                yt.current?.setPlaybackQuality?.('small');
                applyVolume();
              } catch (err) { }
            }
            else if (e.data === window.YT.PlayerState.PAUSED) {
              setPlaying(false);
              setBuffering(false);
            }
            else if (e.data === window.YT.PlayerState.ENDED) {
              setBuffering(false);
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

  // Ref to track preloaded next track metadata
  const preloadedTrackIdRef = useRef(null);

  // Progress timer + Smart 30s Next Track Preloader + Auto Network Recovery
  useEffect(() => {
    if (!playing && !buffering) return;
    const t = setInterval(() => {
      try {
        const ct = yt.current?.getCurrentTime?.() || 0;
        setCurTime(ct);
        const d = yt.current?.getDuration?.() || 0;
        if (d > 0) setDur(d);

        // Preload next track metadata/thumbnail when remaining time <= 30s or > 80% played
        if (d > 0 && (d - ct <= 30 || ct / d > 0.8)) {
          const q = getCurrentTrackList();
          if (q && q.length > 0) {
            const currentIndex = q.findIndex(s => s.id === track?.id);
            const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % q.length;
            const nextSong = q[nextIndex];
            if (nextSong && nextSong.id !== preloadedTrackIdRef.current) {
              preloadedTrackIdRef.current = nextSong.id;
              if (nextSong.thumbnail) {
                const img = new Image();
                img.src = nextSong.thumbnail;
              }
            }
          }
        }
      } catch { }
    }, 500);
    return () => clearInterval(t);
  }, [playing, buffering, track?.id]);

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

    // Increment global play count in DB
    const trkId = trk.id || trk.youtubeId || trk._id;
    if (trkId) {
      axios.post(`/api/music/${trkId}/listen`).catch(() => { });
    }

    if (queue && Array.isArray(queue) && queue.length > 0) {
      setPlayingQueue(queue);
    } else if (tab.startsWith('playlist_') && activePlaylist) {
      const plSongs = (activePlaylist.songs || []).map(id => typeof id === 'object' ? id : findSongById(id)).filter(Boolean);
      if (plSongs.length > 0) setPlayingQueue(plSongs);
    } else if (tab === 'favorites') {
      const favSongs = allKnownSongs.filter(s => isFav(s));
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
      applyVolume();
      yt.current?.loadVideoById?.(yid);
      yt.current?.playVideo?.();
      setTimeout(applyVolume, 100);
      setTimeout(applyVolume, 300);
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
      applyVolume();
      yt.current?.playVideo?.();
      setPlaying(true);
      setTimeout(applyVolume, 100);
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

  const seek = val => {
    const t = typeof val === 'number' ? val : +(val?.target?.value || 0);
    setCurTime(t);
    yt.current?.seekTo?.(t, true);
  };
  const changeVol = e => {
    const v = +e.target.value;
    setVol(v);
    volRef.current = v;
    const isM = v === 0;
    setMuted(isM);
    mutedRef.current = isM;
    localStorage.setItem('aura_volume', String(v));
    localStorage.setItem('aura_muted', String(isM));
    applyVolume();
  };
  const toggleMute = () => {
    setMuted(prev => {
      const nextMuted = !prev;
      mutedRef.current = nextMuted;
      localStorage.setItem('aura_muted', String(nextMuted));
      applyVolume();
      return nextMuted;
    });
  };

  const toggleFav = songOrId => {
    if (!songOrId) return;
    const songObj = typeof songOrId === 'object' ? songOrId : findSongById(songOrId);
    const primaryId = songObj ? (songObj.id || songObj._id) : songOrId;
    if (!primaryId) return;

    setFavs(p => {
      const isFav = p.includes(primaryId) || (songObj && songObj._id && p.includes(songObj._id)) || (songObj && songObj.id && p.includes(songObj.id));
      let updated;
      if (isFav) {
        updated = p.filter(x => x !== primaryId && x !== songObj?.id && x !== songObj?._id);
      } else {
        updated = [...p, primaryId];
      }
      if (user) {
        localStorage.setItem(favsKey(user._id), JSON.stringify(updated));
        // Sync to backend
        axios.put('/api/auth/profile', { favorites: updated }, {
          headers: { Authorization: `Bearer ${user.token || localStorage.getItem('aura_token')}` }
        }).catch(err => console.error("Failed to sync favorites", err));
      }
      return updated;
    });
  };

  const deleteSong = id => {
    if (!id) return;
    const uid = user?._id || 'guest';
    setSongs(p => {
      const updated = p.filter(s => s.id !== id && s._id !== id);
      localStorage.setItem(songsKey(uid), JSON.stringify(updated));
      return updated;
    });
    setFavs(p => {
      const updated = p.filter(x => x !== id);
      localStorage.setItem(favsKey(uid), JSON.stringify(updated));
      if (user) {
        const token = user.token || localStorage.getItem('aura_token');
        if (token) {
          axios.put('/api/auth/profile', { favorites: updated }, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => { });
        }
      }
      return updated;
    });
    setPlaylists(prev => {
      const updated = prev.map(pl => ({
        ...pl,
        songs: (pl.songs || []).filter(sId => sId !== id)
      }));
      localStorage.setItem(playlistsKey(uid), JSON.stringify(updated));
      return updated;
    });
    if (track && (track.id === id || track._id === id)) {
      setTrack(null);
      setPlaying(false);
      try { yt.current?.stopVideo?.(); } catch (e) { }
    }
    showToast('Đã xóa bài hát thành công', 'info', 'Đã xóa 🗑️');
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
      const authToken = user?.token || localStorage.getItem('aura_token');
      const updated = {
        ...user,
        token: authToken,
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
          headers: { Authorization: `Bearer ${authToken}` }
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
      showToast(`Đã thêm bài hát "${s.title}" vào thư viện!`, 'success');

      if (isPlaylistTab) {
        handleAddToPlaylist(tab.split('_')[1], s.id);
      }
    } catch (err) {
      const msg = err.message || 'Lỗi không xác định khi thêm nhạc.';
      setAddErr(msg);
      showToast(msg, 'error');
    }
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
      showToast(`Đã thêm thành công ${finalSongs.length} bài hát từ Spotify!`, 'success');

      if (tab.startsWith('playlist_')) {
        handleAddToPlaylist(tab.split('_')[1], null, finalSongs.map(ns => ns.id));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi không thể tải bài hát từ Spotify.';
      setAddErr(msg);
      showToast(msg, 'error');
    }
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
      showToast(`Đã thêm thành công ${finalSongs.length} bài hát từ Playlist YouTube!`, 'success');

      if (tab.startsWith('playlist_')) {
        handleAddToPlaylist(tab.split('_')[1], null, finalSongs.map(ns => ns.id));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi không thể tải Playlist YouTube.';
      setAddErr(msg);
      showToast(msg, 'error');
    }
    finally { setAdding(false); }
  };

  const handleOnlineSearch = async (searchTerm) => {
    const q = searchTerm !== undefined ? searchTerm : onlineSearchQuery;
    if (!q || !q.trim()) return;
    setOnlineSearching(true);
    setOnlineSearchErr('');
    try {
      const res = await axios.get(`/api/music/search-online?q=${encodeURIComponent(q.trim())}`);
      setOnlineSearchResults(res.data || []);
      if (!res.data || res.data.length === 0) {
        setOnlineSearchErr('Không tìm thấy bài hát nào phù hợp trên YouTube.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi tìm kiếm bài hát online.';
      setOnlineSearchErr(msg);
    } finally {
      setOnlineSearching(false);
    }
  };

  const handlePlayOnlineSong = (resItem) => {
    const s = {
      id: resItem.id || 's' + resItem.youtubeId,
      youtubeId: resItem.youtubeId,
      youtubeUrl: resItem.youtubeUrl,
      title: resItem.title,
      artist: resItem.artist,
      thumbnail: resItem.thumbnail,
      duration: resItem.duration,
      inLibrary: false
    };
    play(s, onlineSearchResults.map(item => ({
      id: item.id || 's' + item.youtubeId,
      youtubeId: item.youtubeId,
      youtubeUrl: item.youtubeUrl,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail,
      duration: item.duration,
      inLibrary: false
    })));
    showToast(`Đang phát: "${resItem.title}"`, 'info', 'Đang phát nhạc 🎵');
  };

  const handleAddToQueue = (resItem) => {
    if (!resItem) return;
    const formattedSong = {
      id: resItem.id || (resItem.youtubeId ? 's_' + resItem.youtubeId : 's_' + Date.now()),
      youtubeId: resItem.youtubeId || '',
      youtubeUrl: resItem.youtubeUrl || (resItem.youtubeId ? `https://www.youtube.com/watch?v=${resItem.youtubeId}` : ''),
      title: resItem.title || 'Bài hát',
      artist: resItem.artist || 'Ca sĩ',
      thumbnail: resItem.thumbnail || '/default-cover.png',
      duration: resItem.duration || '0:00',
      inLibrary: false
    };

    if (!track) {
      play(formattedSong, [formattedSong]);
      showToast(`Đang phát: "${formattedSong.title}"`, 'info', 'Hàng chờ phát 🎵');
    } else {
      setPlayingQueue(prevQueue => {
        const currentList = prevQueue && prevQueue.length > 0 ? [...prevQueue] : [...getCurrentTrackList()];
        const targetId = formattedSong.id;
        const targetYtId = formattedSong.youtubeId;

        const existingIdx = currentList.findIndex(s =>
          (targetId && (s.id === targetId || s._id === targetId)) ||
          (targetYtId && Boolean(s.youtubeId) && s.youtubeId === targetYtId)
        );

        let listWithoutTarget = currentList;
        if (existingIdx >= 0) {
          listWithoutTarget = currentList.filter((_, idx) => idx !== existingIdx);
        }

        const currentTrackIdx = listWithoutTarget.findIndex(s =>
          (track.id && (s.id === track.id || s._id === track.id)) ||
          (track.youtubeId && Boolean(s.youtubeId) && s.youtubeId === track.youtubeId)
        );

        const insertPos = currentTrackIdx >= 0 ? currentTrackIdx + 1 : listWithoutTarget.length;
        listWithoutTarget.splice(insertPos, 0, formattedSong);
        return listWithoutTarget;
      });

      showToast(`Đã thêm "${formattedSong.title}" vào hàng chờ phát!`, 'success', 'Hàng chờ phát 🎵');
    }
  };

  const handleAddOnlineSongToLibrary = async (resItem) => {
    if (!resItem) return;
    try {
      const targetId = resItem.id || resItem._id;
      const targetYtId = resItem.youtubeId;
      const uid = user?._id || 'guest';

      setSongs(prevSongs => {
        let found = false;
        const updated = prevSongs.map(s => {
          const isMatch = (targetId && (s.id === targetId || s._id === targetId)) ||
            (targetYtId && Boolean(targetYtId) && Boolean(s.youtubeId) && s.youtubeId === targetYtId);
          if (isMatch) {
            found = true;
            const newInLib = s.inLibrary === false ? true : false;
            if (newInLib) {
              showToast(`Đã thêm "${s.title}" vào thư viện cá nhân!`, 'success', 'Đã thêm vào thư viện 🎉');
            } else {
              showToast(`Đã xóa "${s.title}" khỏi thư viện cá nhân`, 'info', 'Đã bỏ khỏi thư viện 🗑️');
            }
            return { ...s, inLibrary: newInLib };
          }
          return s;
        });

        let finalSongs = updated;
        if (!found) {
          const newSong = {
            id: resItem.id || (resItem.youtubeId ? 's_' + resItem.youtubeId : 's_' + Date.now()),
            youtubeId: resItem.youtubeId || '',
            youtubeUrl: resItem.youtubeUrl || '',
            title: resItem.title || 'Bài hát',
            artist: resItem.artist || 'Ca sĩ',
            thumbnail: resItem.thumbnail || '/default-cover.png',
            duration: resItem.duration || '0:00',
            inLibrary: true
          };
          finalSongs = [newSong, ...prevSongs];
          showToast(`Đã thêm "${newSong.title}" vào thư viện cá nhân!`, 'success', 'Đã thêm vào thư viện 🎉');

          if (user) {
            axios.post('/api/music', { ...newSong, addedBy: user._id, inLibrary: true }).catch(() => { });
          }
        } else {
          const matchedSong = finalSongs.find(s =>
            (targetId && (s.id === targetId || s._id === targetId)) ||
            (targetYtId && Boolean(targetYtId) && Boolean(s.youtubeId) && s.youtubeId === targetYtId)
          );
          if (user && matchedSong) {
            axios.put(`/api/music/${matchedSong.id || matchedSong._id}`, { inLibrary: matchedSong.inLibrary }).catch(() => { });
          }
        }

        localStorage.setItem(songsKey(uid), JSON.stringify(finalSongs));
        return finalSongs;
      });
    } catch (err) {
      showToast('Lỗi khi thêm bài hát vào thư viện', 'error');
    }
  };

  const handleAddOnlineSongToPlaylist = async (resItem) => {
    if (!resItem) return;
    try {
      const targetId = resItem.id || resItem._id;
      const targetYtId = resItem.youtubeId;

      let existing = songs.find(s =>
        (targetId && (s.id === targetId || s._id === targetId)) ||
        (targetYtId && Boolean(targetYtId) && Boolean(s.youtubeId) && s.youtubeId === targetYtId)
      );

      const s = existing || {
        id: resItem.id || (resItem.youtubeId ? 's_' + resItem.youtubeId : 's_' + Date.now()),
        youtubeId: resItem.youtubeId || '',
        youtubeUrl: resItem.youtubeUrl || (resItem.youtubeId ? `https://www.youtube.com/watch?v=${resItem.youtubeId}` : ''),
        title: resItem.title || 'Bài hát',
        artist: resItem.artist || 'Ca sĩ',
        thumbnail: resItem.thumbnail || '/default-cover.png',
        duration: resItem.duration || '0:00',
        inLibrary: false
      };
      setSongToAdd(s);
    } catch (err) {
      showToast('Lỗi khi mở tùy chọn lưu bài hát', 'error');
    }
  };


  const handleCreatePlaylist = async e => {
    if (e) e.preventDefault();
    const playlistName = newPlaylistName.trim();
    if (!playlistName) return;

    // Prevent double submission / rapid Enter keypress
    if (isCreatingPlaylistRef.current) return;
    isCreatingPlaylistRef.current = true;
    setIsCreatingPlaylist(true);

    const uid = user?._id || 'guest';
    const tempId = 'pl_' + Date.now();
    let newPl = {
      _id: tempId,
      id: tempId,
      name: playlistName,
      description: '',
      cover: '',
      songs: [],
      userId: uid,
      createdAt: new Date().toISOString()
    };

    try {
      if (user) {
        const token = user.token || localStorage.getItem('aura_token');
        const res = await axios.post('/api/playlists', { name: playlistName, userId: user._id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && (res.data._id || res.data.id)) {
          newPl = res.data;
        }
      }
    } catch (err) {
      console.error("Server playlist creation fallback to local:", err);
    } finally {
      isCreatingPlaylistRef.current = false;
      setIsCreatingPlaylist(false);
    }

    // Always update local playlists state & localStorage instantly
    setPlaylists(p => {
      // Extra safety check: prevent duplicate insertion of exact same object
      if (p.some(item => (item._id && item._id === newPl._id) || (item.name === newPl.name && Math.abs(Date.now() - new Date(item.createdAt || 0).getTime()) < 3000))) {
        return p;
      }
      const up = [newPl, ...p];
      localStorage.setItem(playlistsKey(uid), JSON.stringify(up));
      return up;
    });

    // Close modal & reset input
    setPlaylistModal(false);
    setNewPlaylistName('');

    // Show toast notification
    showToast(`Đã tạo playlist "${playlistName}" thành công!`, 'success', 'Tạo Playlist 🎉');

    // Handle songToAdd context
    if (songToAdd) {
      handleAddToPlaylist(newPl._id || newPl.id, songToAdd);
      setSongToAdd(null);
    } else {
      setTab(`playlist_${newPl._id || newPl.id}`);
    }
  };

  const executeDeletePlaylist = async id => {
    if (!id) return;
    const uid = user?._id || 'guest';
    try {
      const targetPlaylist = playlists.find(p => p._id === id || p.id === id);
      const targetSongIds = targetPlaylist?.songs || [];

      // Always remove from local state & localStorage immediately
      const updatedPlaylists = playlists.filter(x => x._id !== id && x.id !== id);
      setPlaylists(updatedPlaylists);
      localStorage.setItem(playlistsKey(uid), JSON.stringify(updatedPlaylists));

      if (tab === `playlist_${id}`) setTab('home');
      setContextMenu(null);
      showToast(`Đã xóa danh sách phát "${targetPlaylist?.name || ''}"!`, 'info', 'Đã xóa 🗑️');

      // Async backend call
      if (user) {
        const token = user.token || localStorage.getItem('aura_token');
        axios.delete(`/api/playlists/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {
          axios.delete(`/api/playlists/${id}`).catch(() => { });
        });
      }

      // Check for songs that belonged ONLY to this deleted playlist and are not in library
      const remainingPlaylistSongIds = new Set(updatedPlaylists.flatMap(p => p.songs || []));
      const songsToRemove = targetSongIds.filter(sId => {
        const songObj = songs.find(s => s.id === sId || s._id === sId);
        return songObj && songObj.inLibrary === false && !remainingPlaylistSongIds.has(sId);
      });

      if (songsToRemove.length > 0) {
        setSongs(prevSongs => {
          const updatedSongs = prevSongs.filter(s => !songsToRemove.includes(s.id) && !songsToRemove.includes(s._id));
          localStorage.setItem(songsKey(uid), JSON.stringify(updatedSongs));
          return updatedSongs;
        });
      }
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const confirmDeletePlaylist = (id, name) => {
    setContextMenu(null);
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

  const fetchAdminUsers = () => {
    if (adminUsers.length === 0) setAdminUsersLoading(true);
    axios.get('/api/admin/users').then(res => {
      if (Array.isArray(res.data)) {
        setAdminUsers(res.data);
      }
    }).catch(console.error).finally(() => setAdminUsersLoading(false));
  };

  useEffect(() => {
    if (tab === 'admin' && isAdmin) {
      fetchAdminUsers();
      // Auto-refresh every 5 seconds to update online/offline status in real-time
      const interval = setInterval(fetchAdminUsers, 5000);
      return () => clearInterval(interval);
    }
  }, [tab, isAdmin]);

  // ── STATS TAB: fetch & auto-refresh every 10s ──
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const fetchStats = () => {
    setStatsLoading(true);
    axios.get('/api/admin/stats')
      .then(res => { setStatsData(res.data); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  };
  useEffect(() => {
    if (tab === 'stats' && isAdmin) {
      fetchStats();
      const si = setInterval(fetchStats, 10000);
      return () => clearInterval(si);
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
          role: adminRole,
          avatar: adminAvatar
        });
      } else {
        await axios.post('/api/admin/users', {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: adminRole,
          avatar: adminAvatar
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

  const handleListAvatarClick = (u) => {
    if (isSuperAdminAccount(u) && !isCurrentSuperAdmin) return;
    setDirectEditUser(u);
    adminListAvatarInputRef.current?.click();
  };

  const handleListAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && directEditUser) {
      try {
        const compressedBase64 = await compressImage(file, 250, 250, 0.82);
        await axios.put(`/api/admin/users/${directEditUser._id}`, { avatar: compressedBase64 });
        fetchAdminUsers();
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Lỗi khi đổi ảnh đại diện.');
      }
    }
    e.target.value = null;
  };

  const handleFormAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 250, 250, 0.82);
        setAdminAvatar(compressedBase64);
      } catch (err) {
        console.error("Failed to compress admin avatar", err);
        alert("Có lỗi khi xử lý ảnh đại diện.");
      }
    }
    e.target.value = null;
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
      const songObj = typeof songId === 'object' ? songId : findSongById(songId);
      const targetId = songObj ? (songObj.id || songObj._id) : songId;

      if (songObj && typeof songId === 'object') {
        const uid = user?._id || 'guest';
        setSongs(prevSongs => {
          const exists = prevSongs.some(s =>
            (songObj.id && (s.id === songObj.id || s._id === songObj.id)) ||
            (songObj.youtubeId && Boolean(songObj.youtubeId) && Boolean(s.youtubeId) && s.youtubeId === songObj.youtubeId)
          );
          if (!exists) {
            const updated = [songObj, ...prevSongs];
            localStorage.setItem(songsKey(uid), JSON.stringify(updated));
            if (user) {
              axios.post('/api/music', { ...songObj, addedBy: user._id, inLibrary: false }).catch(() => { });
            }
            return updated;
          }
          return prevSongs;
        });
      }

      // Fallback local update first so UI updates instantly
      if (targetId && !songIds) {
        setPlaylists(p => p.map(pl => {
          if (pl._id === playlistId) {
            const currentSongs = pl.songs || [];
            if (!currentSongs.includes(targetId)) {
              return { ...pl, songs: [...currentSongs, targetId] };
            }
          }
          return pl;
        }));
        showToast('Đã thêm bài hát vào danh sách phát!', 'success', 'Playlist 🎉');
      }

      const payload = songIds ? { songIds } : { songId: targetId };
      const res = await axios.put(`/api/playlists/${playlistId}/add`, payload, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('aura_token')}` }
      });
      if (res.data) {
        setPlaylists(p => {
          const up = p.map(x => x._id === playlistId ? res.data : x);
          if (user) localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
          return up;
        });
      }
    } catch (err) { console.error("Failed to add to playlist", err); }
  };

  const handleRemoveFromPlaylist = async (playlistId, songId) => {
    try {
      const songObj = typeof songId === 'object' ? songId : findSongById(songId);
      const targetId = songObj ? (songObj.id || songObj._id) : songId;

      // Fallback local update first so UI updates instantly
      if (targetId) {
        setPlaylists(p => p.map(pl => {
          if (pl._id === playlistId) {
            return { ...pl, songs: (pl.songs || []).filter(id => id !== targetId && id !== songObj?.id && id !== songObj?._id) };
          }
          return pl;
        }));
      }

      const res = await axios.put(`/api/playlists/${playlistId}/remove`, { songId: targetId }, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('aura_token')}` }
      });
      if (res.data) {
        setPlaylists(p => {
          const up = p.map(x => x._id === playlistId ? res.data : x);
          if (user) localStorage.setItem(playlistsKey(user._id), JSON.stringify(up));
          return up;
        });
      }
    } catch (err) { console.error("Failed to remove from playlist", err); }
  };

  const fmt = s => isNaN(s) || s < 0 ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const glass = { background: C.surface, backdropFilter: 'blur(20px)', border: `1.5px solid ${C.border}` };
  const btn = { background: C.btn, color: C.btnTxt, border: `1.5px solid ${C.btnBd}` };

  // ── LANDING PAGE ──────────────────────────────────────────
  if (!user && page === 'landing') {
    return (
      <div className="relative h-screen w-screen overflow-hidden flex flex-col" style={{ background: C.bg, fontFamily: F.body }}>
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
        <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10 md:py-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-lg sm:text-xl text-white spin-slow"></i>
            </div>
            <span style={{ fontFamily: F.cursive, fontSize: '26px', color: C.primarySolid, lineHeight: 1 }}>LittleLove</span>
          </div>
          <button
            onClick={() => setPage('login')}
            title="Bấm để đăng nhập tài khoản nghe nhạc"
            className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: C.primary, color: '#fff', boxShadow: `0 4px 16px ${C.primaryGlow}` }}
          >
            Đăng nhập
          </button>
        </header>

        {/* Hero section */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-4 py-4 md:py-8 gap-4 sm:gap-6 md:gap-8 overflow-hidden min-h-0">
          {/* Spinning disc icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl mb-1 sm:mb-2 shrink-0"
            style={{ background: C.primary, boxShadow: `0 20px 60px ${C.primaryGlow}` }}>
            <i className="ri-disc-fill text-4xl sm:text-5xl md:text-6xl text-white spin-slow"></i>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-1 sm:gap-2 shrink-0">
            <h1 style={{ fontFamily: F.cursive, fontSize: 'clamp(36px,7vw,88px)', color: C.primarySolid, lineHeight: 1.05 }}>
              LittleLove
            </h1>
            <p style={{ fontFamily: F.brand, fontSize: 'clamp(11px,1.5vw,18px)', color: C.txtSub, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              Không gian âm nhạc cá nhân của bạn
            </p>
          </div>

          {/* Description */}
          <p className="shrink-0" style={{ fontFamily: F.body, fontSize: 'clamp(12px,1.5vw,17px)', color: C.txtSub, maxWidth: '520px', lineHeight: 1.8 }}>
            Tạo thư viện nhạc riêng từ YouTube, lưu bài yêu thích,
            tùy chỉnh giao diện theo phong cách của bạn.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center shrink-0">
            {[
              { icon: 'ri-youtube-fill', label: 'Stream từ YouTube' },
              { icon: 'ri-heart-fill', label: 'Bài hát yêu thích' },
              { icon: 'ri-palette-fill', label: 'Giao diện Pastel' },
              { icon: 'ri-repeat-line', label: 'Phát & Lặp lại' },
            ].map(f => (
              <span key={f.label} className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold"
                style={{ background: C.tag, border: `1.5px solid ${C.tagBd}`, color: C.tagTxt }}>
                <i className={`${f.icon} text-sm sm:text-base`}></i>
                {f.label}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <div className="shrink-0">
            <button
              onClick={() => setPage('login')}
              title="Đăng nhập ngay để khám phá không gian nhạc cá nhân"
              className="mt-2 sm:mt-4 px-6 py-3 sm:px-10 sm:py-4 rounded-2xl text-base sm:text-lg font-bold text-white flex items-center gap-2 sm:gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95 hover:shadow-3xl cursor-pointer"
              style={{ background: C.primary, boxShadow: `0 8px 32px ${C.primaryGlow}` }}
            >
              <i className="ri-headphone-fill text-lg sm:text-xl"></i>
              Bắt đầu nghe nhạc
              <i className="ri-arrow-right-line text-lg sm:text-xl"></i>
            </button>
            <p style={{ color: C.txtFad, fontSize: '11px', marginTop: '6px' }}>
              ✦ Dành riêng cho bạn • Private Music Space ✦
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center pb-4 pt-1 sm:pb-6 sm:pt-2 shrink-0">
          <p style={{ color: C.txtFad, fontSize: 'clamp(10px, 1.2vw, 11px)', fontFamily: F.brand, letterSpacing: '0.15em' }}>
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
        <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
          style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 25px 70px rgba(0,0,0,0.12)' }}>

          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md" style={{ background: C.primary }}>
              <i className="ri-disc-fill text-2xl sm:text-3xl text-white spin-slow"></i>
            </div>
            <h1 style={{ fontFamily: F.cursive, fontSize: 'clamp(28px, 6vw, 34px)', color: C.primarySolid, lineHeight: 1.1 }}>LittleLove</h1>
            <p style={{ fontFamily: F.brand, fontSize: '10px', letterSpacing: '0.25em', color: C.txtFad, textTransform: 'uppercase', fontWeight: 600, marginTop: '2px' }}>
              Unnull Music Space
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold mb-1 sm:mb-1.5" style={{ color: C.txtSub }}>Email / Tên đăng nhập</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Nhập email hoặc tên đăng nhập"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm outline-none transition"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 sm:mb-1.5" style={{ color: C.txtSub }}>Mật Khẩu</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-sm outline-none transition"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
              />
            </div>

            {loginErr && <p className="text-xs font-semibold text-red-500">{loginErr}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 sm:py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] mt-1 sm:mt-2 cursor-pointer"
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
      <div className="flex flex-1 overflow-hidden relative" style={{ transition: 'all 0.3s ease' }}>

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
                sub: `Playlist • ${allKnownSongs.filter(s => isFav(s)).length} bài`,
                color: 'linear-gradient(135deg, #450af5, #8e2de2)',
                tooltip: 'Xem các bài hát đã yêu thích'
              },
              {
                key: 'online_search',
                icon: 'ri-search-eye-line',
                label: 'Tìm Nhạc Online',
                sub: 'YouTube Search • Nghe trực tiếp',
                color: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                tooltip: 'Tìm kiếm & nghe nhạc YouTube trực tiếp'
              },
              ...(isAdmin ? [{
                key: 'admin',
                icon: 'ri-shield-user-fill',
                label: 'Quản lý Account',
                sub: 'Quản trị hệ thống & DB',
                color: 'linear-gradient(135deg, #ef4444, #f59e0b)',
                tooltip: 'Mở trang quản lý tài khoản & phân quyền người dùng'
              }, {
                key: 'stats',
                icon: 'ri-bar-chart-2-fill',
                label: 'Thống Kê',
                sub: 'Báo cáo & phân tích',
                color: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                tooltip: 'Xem thống kê toàn hệ thống'
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
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSidebarSearch(!showSidebarSearch)}
                  title="Lọc danh sách phát (Spotify style)"
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{ background: showSidebarSearch ? C.primarySolid : C.tag, color: showSidebarSearch ? '#fff' : C.txt, border: `1px solid ${C.border}` }}
                >
                  <i className="ri-search-line text-xs"></i>
                </button>
                <button onClick={() => setPlaylistModal(true)} title="Tạo danh sách phát mới"
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{ background: C.tag, color: C.txt, border: `1px solid ${C.border}` }}>
                  <i className="ri-add-line text-xs"></i>
                </button>
              </div>
            </div>

            {showSidebarSearch && (
              <div className="px-2 mb-2">
                <div className="relative">
                  <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.txtFad }}></i>
                  <input
                    type="text"
                    placeholder="Lọc playlist..."
                    value={sidebarQuery}
                    onChange={e => setSidebarQuery(e.target.value)}
                    className="w-full pl-7 pr-6 py-1.5 rounded-xl text-xs outline-none transition"
                    style={{ background: C.tag, border: `1px solid ${C.border}`, color: C.txt }}
                    autoFocus
                  />
                  {sidebarQuery && (
                    <button onClick={() => setSidebarQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: C.txtFad }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {playlists
              .filter(p => !sidebarQuery || p.name.toLowerCase().includes(sidebarQuery.toLowerCase()))
              .slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)).map(p => {
                const tabKey = `playlist_${p._id}`;
                const active = tab === tabKey;
                const isHovered = hoverTab === tabKey;
                const isHighlighted = active || isHovered;

                const validPlaylistSongs = (p.songs || []).map(sId => songs.find(s => s.id === sId)).filter(Boolean);
                const firstSong = validPlaylistSongs[0];
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
                        Playlist • {validPlaylistSongs.length} bài
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

              {/* Header Global Online Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim()) {
                    setTab('online_search');
                    setOnlineSearchQuery(query);
                    handleOnlineSearch(query);
                  }
                }}
                className="relative w-full max-w-[150px] sm:max-w-[200px] md:w-64 z-10"
              >
                <i
                  className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-xs md:text-sm cursor-pointer"
                  style={{ color: C.txtFad }}
                  onClick={() => {
                    if (query.trim()) {
                      setTab('online_search');
                      setOnlineSearchQuery(query);
                      handleOnlineSearch(query);
                    }
                  }}
                ></i>
                <input
                  type="text"
                  placeholder="🔍 Tìm nhạc online YouTube..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && query.trim()) {
                      e.preventDefault();
                      setTab('online_search');
                      setOnlineSearchQuery(query);
                      handleOnlineSearch(query);
                    }
                  }}
                  className="w-full py-1.5 md:py-2 pl-8 md:pl-9 pr-7 text-xs md:text-sm rounded-full outline-none transition"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color: C.txtFad }}
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Floating Sticky Play Button + Playlist Name (Chỉ hiện khi lướt xuống hết banner > 280px) */}
              {mainScrollTop > 280 && (activePlaylist || tab === 'favorites' || tab === 'library') && (
                <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-left-3 duration-200 z-20 pointer-events-auto shrink-0">
                  {list.length > 0 && (
                    <button
                      onClick={() => {
                        const isCurrentListPlaying = track && list.some(s => s.id === track.id);
                        if (isCurrentListPlaying) {
                          togglePlay();
                        } else {
                          play(list[0], list);
                        }
                      }}
                      title={track && list.some(s => s.id === track.id) && playing ? "Tạm dừng phát nhạc" : "Phát danh sách phát này"}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full text-white flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer shrink-0 ${getSeasonalPlayBtnClass(themeKey) || 'shadow-md'}`}
                      style={getSeasonalPlayBtnClass(themeKey) ? {} : { background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
                    >
                      {track && list.some(s => s.id === track.id) && playing ? (
                        buffering ? <i className="ri-loader-4-line text-lg md:text-xl animate-spin" /> : <PauseIcon className="w-4 h-4 md:w-5 md:h-5" />
                      ) : (
                        <PlayIcon className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </button>
                  )}
                  <span className="text-xs md:text-sm font-extrabold truncate max-w-[120px] lg:max-w-[180px]" style={{ color: C.txt, fontFamily: F.heading }}>
                    {tab === 'favorites' ? 'Bài Hát Đã Thích' : activePlaylist ? activePlaylist.name : 'Thư Viện Nhạc'}
                  </span>
                </div>
              )}
            </div>

            {/* User Name in center - Always retained */}
            {user && (
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none items-center justify-center overflow-visible">
                <span className="text-3xl lg:text-4xl font-extrabold whitespace-nowrap pr-4 py-1" style={{ color: C.primarySolid, fontFamily: F.cursive, textShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
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

              {/* 💬 Direct Chat & Listen Together Button */}
              <button
                onClick={() => {
                  setChatModal({ open: true, activeUser: null, tab: 'chat' });
                  setUnreadChatCount(0);
                }}
                className="relative p-2 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.primarySolid }}
                title="Trò chuyện trực tiếp & Nghe Nhạc Cùng Nhau"
              >
                <i className="ri-message-3-fill text-base md:text-lg"></i>
                {unreadChatCount > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-extrabold text-[9px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center border border-white shadow-md animate-bounce z-10">
                    {unreadChatCount}
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[8px] px-1 rounded-full border border-white shadow-md">
                    LIVE
                  </span>
                )}
              </button>

              {/* 🔔 Notification Bell Button & Dropdown Panel (Đặt ngang hàng ở cuối hàng) */}
              <div ref={notifMenuRef} className="relative z-50">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className={`relative p-2 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95 flex items-center justify-center ${unreadNotifsCount > 0 ? 'bell-ring-anim' : ''}`}
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  title="Thông báo mở khóa giao diện & mùa lễ"
                >
                  <i className={`text-base md:text-lg ${unreadNotifsCount > 0 ? 'ri-notification-3-fill text-amber-500' : 'ri-notification-3-line'}`}></i>
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-md">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Bảng Thông Báo ngay bên dưới Nút Chuông */}
                {showNotifMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifMenu(false)}
                    />
                    <div
                      className="absolute right-0 top-full mt-2.5 z-50 w-80 md:w-96 rounded-3xl p-4 shadow-2xl overflow-hidden transition-all duration-200"
                      style={{
                        background: C.isDark ? '#0f172a' : '#ffffff',
                        border: `1.5px solid ${C.border}`,
                        color: C.txt,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
                      }}
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: C.border }}>
                        <div className="flex items-center gap-2">
                          <i className="ri-notification-badge-fill text-amber-500 text-lg"></i>
                          <span className="font-bold text-sm">Thông Báo Giao Diện</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                            {systemNotifs.length}
                          </span>
                        </div>
                        {unreadNotifsCount > 0 && (
                          <button
                            onClick={markAllNotifsRead}
                            className="text-[11px] font-semibold text-blue-500 hover:underline cursor-pointer"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                        {/* 🎧 Pending Room Invites Section inside Notification Dropdown */}
                        {pendingListenInvites && pendingListenInvites.length > 0 && (
                          <div className="mb-3 pb-3 border-b" style={{ borderColor: C.border }}>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block mb-2">
                              🎧 Lời Mời Nghe Nhạc Cùng Nhau ({pendingListenInvites.length})
                            </span>

                            <div className="flex flex-col gap-2">
                              {pendingListenInvites.map(inv => (
                                <div
                                  key={inv.id}
                                  className="p-2.5 rounded-2xl border flex items-center justify-between gap-2"
                                  style={{ background: C.tag, borderColor: C.border }}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img src={inv.hostAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{inv.hostName}</span>
                                      <span className="text-[10px] text-emerald-500 font-medium">Mời bạn nghe nhạc cùng nhau</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => {
                                        handleSyncListenParty('join', null, inv.roomId, { hostId: inv.hostId, hostName: inv.hostName });
                                        setChatModal({ open: true, activeUser: null, tab: 'listen_party' });
                                        setShowNotifMenu(false);
                                      }}
                                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-white shadow-xs cursor-pointer hover:scale-105"
                                      style={{ background: '#10b981' }}
                                    >
                                      Vào nghe ngay
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* 💬 Unread Direct Messages Section inside Notification Dropdown */}
                        {unreadDirectMessages && unreadDirectMessages.length > 0 && (
                          <div className="mb-3 pb-3 border-b" style={{ borderColor: C.border }}>
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-500 block mb-2">
                              💬 Tin Nhắn Mới Nhận ({unreadDirectMessages.length})
                            </span>

                            <div className="flex flex-col gap-2">
                              {unreadDirectMessages.slice(0, 4).map(msg => (
                                <div
                                  key={msg._id}
                                  onClick={() => {
                                    setChatModal({
                                      open: true,
                                      activeUser: { _id: msg.senderId, name: msg.senderName, avatar: msg.senderAvatar },
                                      tab: 'chat'
                                    });
                                    setShowNotifMenu(false);
                                    setUnreadChatCount(prev => Math.max(0, prev - 1));
                                  }}
                                  className="p-2.5 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition hover:scale-[1.02]"
                                  style={{ background: C.tag, borderColor: C.border }}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{msg.senderName || 'Thành viên'}</span>
                                      <span className="text-[11px] truncate font-medium" style={{ color: C.txtSub }}>{msg.text || '🎵 Đã chia sẻ 1 bài hát'}</span>
                                    </div>
                                  </div>

                                  <button
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-white shadow-xs cursor-pointer hover:scale-105 shrink-0"
                                    style={{ background: C.primary }}
                                  >
                                    Chat ngay
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* 🤝 Pending Friend Requests Section inside Notification Dropdown */}
                        {pendingFriendRequests && pendingFriendRequests.length > 0 && (
                          <div className="mb-3 pb-3 border-b" style={{ borderColor: C.border }}>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 block mb-2">
                              🤝 Lời Mời Kết Bạn Đang Chờ ({pendingFriendRequests.length})
                            </span>

                            <div className="flex flex-col gap-2">
                              {pendingFriendRequests.map(pReq => (
                                <div
                                  key={pReq._id}
                                  className="p-2.5 rounded-2xl border flex items-center justify-between gap-2"
                                  style={{ background: C.tag, borderColor: C.border }}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img src={pReq.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{pReq.user?.name || 'Thành viên'}</span>
                                      <span className="text-[10px] text-emerald-500 font-medium">Muốn kết bạn với bạn</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={() => handleSendFriendRequest(pReq.user, 'accept')}
                                      className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-white shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                                      style={{ background: '#10b981' }}
                                    >
                                      Chấp nhận
                                    </button>
                                    <button
                                      onClick={() => handleSendFriendRequest(pReq.user, 'reject')}
                                      className="px-2 py-1 rounded-xl text-[11px] font-semibold cursor-pointer hover:opacity-80 border"
                                      style={{ background: C.surface, color: C.txtSub, borderColor: C.border }}
                                    >
                                      Từ chối
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {systemNotifs.length === 0 ? (
                          <div className="py-8 text-center text-xs" style={{ color: C.txtFad }}>
                            Không có thông báo nào mới.
                          </div>
                        ) : systemNotifs.map(notif => {
                          const isRead = readNotifIds.includes(notif.id);
                          const isCurrentTheme = themeKey === notif.themeKey;
                          return (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setThemeKey(notif.themeKey);
                                markNotifRead(notif.id);
                                setShowNotifMenu(false);
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start relative group hover:scale-[1.02] ${!isRead ? 'bg-amber-500/5' : ''}`}
                              style={{
                                borderColor: isCurrentTheme ? C.primarySolid : C.border,
                                background: isCurrentTheme ? C.tag : (C.isDark ? 'rgba(30,41,59,0.6)' : '#f8fafc')
                              }}
                            >
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                                style={{ background: THEMES[notif.themeKey]?.bg || C.primary, color: '#fff' }}>
                                {notif.icon}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="text-xs font-bold truncate" style={{ color: isCurrentTheme ? C.primarySolid : C.txt }}>
                                    {notif.title}
                                  </span>
                                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0"
                                    style={{ background: notif.tagBg, color: notif.tagColor }}>
                                    {notif.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] leading-snug line-clamp-2" style={{ color: C.txtSub }}>
                                  {notif.message}
                                </p>
                                <div className="mt-1.5 flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                                    {isCurrentTheme ? '✓ Đang kích hoạt' : '👉 Bấm để áp dụng ngay'}
                                  </span>
                                  {!isRead && (
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <div className="flex-1 p-4 pt-8 md:p-7 md:pt-7 overflow-y-auto" onScroll={e => setMainScrollTop(e.currentTarget.scrollTop)}>

            {tab === 'online_search' ? (
              /* ── ONLINE MUSIC SEARCH PAGE ─────────────────── */
              <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
                {/* Header Banner */}
                <div className="p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(255,65,108,0.2) 0%, rgba(255,75,43,0.2) 100%)', border: `1.5px solid ${C.border}` }}>
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-sm inline-block mb-2">
                        YouTube Live Search
                      </span>
                      <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: F.heading, color: C.txt }}>
                        Tìm &amp; Nghe Nhạc Online Trực Tiếp
                      </h2>
                      <p className="text-xs md:text-sm mt-1 max-w-xl" style={{ color: C.txtSub }}>
                        Tìm kiếm hàng triệu bài hát trên YouTube, phát ngay tức thì hoặc lưu vào Thư viện &amp; Playlist cá nhân.
                      </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={(e) => { e.preventDefault(); handleOnlineSearch(); }} className="w-full md:w-96 flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Nhập tên bài hát, ca sĩ..."
                          value={onlineSearchQuery}
                          onChange={e => setOnlineSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-8 py-3 rounded-2xl text-xs font-semibold outline-none transition shadow-inner"
                          style={{ background: C.surface, border: `1.5px solid ${C.border}`, color: C.txt }}
                        />
                        <i className="ri-search-eye-line absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-rose-500"></i>
                        {onlineSearchQuery && (
                          <button type="button" onClick={() => setOnlineSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.txtFad }}>
                            ✕
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={onlineSearching}
                        className="px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                        style={{ background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', boxShadow: '0 6px 20px rgba(255,65,108,0.35)' }}
                      >
                        {onlineSearching ? <i className="ri-loader-4-line animate-spin text-sm"></i> : 'Tìm Kiếm'}
                      </button>
                    </form>
                  </div>

                  {/* Hot Tags preset */}
                  <div className="relative z-10 flex items-center gap-2 mt-4 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: C.txtSub }}>Gợi ý hot:</span>
                    {['Lofi Chill tiếng Việt', 'Nhạc Trẻ Remix TikTok 2026', 'Nhạc Chill Lofi', 'Sơn Tùng', 'MCK'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => { setOnlineSearchQuery(tag); handleOnlineSearch(tag); }}
                        className="px-3 py-1 rounded-xl text-xs font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
                        style={{ background: C.tag, border: `1px solid ${C.border}`, color: C.txt }}
                      >
                        🔥 {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {onlineSearchErr && (
                  <div className="p-4 rounded-2xl text-xs font-bold bg-red-500/15 text-red-500 border border-red-500/30">
                    {onlineSearchErr}
                  </div>
                )}

                {/* Search Results Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: C.txt }}>
                      <i className="ri-youtube-fill text-red-500 text-xl"></i>
                      Kết Quả Tìm Kiếm {onlineSearchResults.length > 0 ? `(${onlineSearchResults.length} bài hát)` : ''}
                    </h3>
                  </div>

                  {onlineSearching ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <i className="ri-loader-4-line text-4xl animate-spin" style={{ color: '#ff416c' }}></i>
                      <span className="text-sm font-bold" style={{ color: C.txtSub }}>Đang tìm kiếm bài hát từ YouTube...</span>
                    </div>
                  ) : onlineSearchResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl" style={{ background: C.tag, border: `1.5px dashed ${C.border}` }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3" style={{ background: 'rgba(255,65,108,0.15)', color: '#ff416c' }}>
                        <i className="ri-search-eye-line"></i>
                      </div>
                      <h4 className="text-base font-bold mb-1" style={{ color: C.txt }}>Chưa có kết quả tìm kiếm</h4>
                      <p className="text-xs max-w-sm" style={{ color: C.txtSub }}>
                        Nhập tên bài hát hoặc ca sĩ yêu thích lên thanh tìm kiếm ở trên để bắt đầu khám phá nhạc online!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {onlineSearchResults.map(song => (
                        <div
                          key={song.id}
                          className="group p-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between shadow-md relative overflow-hidden"
                          style={{ background: C.tag, border: `1.5px solid ${C.border}` }}
                        >
                          <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                            <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <button
                                onClick={() => handlePlayOnlineSong(song)}
                                className="w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg transition hover:scale-110 active:scale-95 cursor-pointer"
                                style={{ background: C.primary, boxShadow: `0 4px 15px ${C.primaryGlow}` }}
                                title="Phát ngay bài này"
                              >
                                <i className="ri-play-fill text-xl"></i>
                              </button>
                            </div>
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/75 text-white backdrop-blur-xs z-10">
                              {song.duration}
                            </span>
                          </div>

                          <div className="flex flex-col flex-1 justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold line-clamp-2 leading-snug" style={{ color: C.txt }} title={song.title}>
                                {song.title}
                              </h4>
                              <p className="text-[11px] font-medium truncate mt-1" style={{ color: C.txtSub }}>
                                {song.artist}
                              </p>
                            </div>

                            <div className="mt-2 pt-2 border-t flex items-center gap-2" style={{ borderColor: C.border }}>
                              <button
                                type="button"
                                onClick={() => handleAddOnlineSongToPlaylist(song)}
                                className="flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md text-white whitespace-nowrap"
                                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                                title="Bấm để chọn nơi lưu bài hát (Thư viện cá nhân hoặc Playlist)"
                              >
                                <i className="ri-add-line text-sm"></i> Thêm Vào...
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAddToQueue(song)}
                                className="flex-1 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md text-white whitespace-nowrap"
                                style={{ background: 'rgba(255, 255, 255, 0.08)', border: `1.5px solid ${C.border}` }}
                                title="Thêm bài hát vào danh sách phát chờ"
                              >
                                <i className="ri-playlist-add-line text-sm text-cyan-400"></i> Hàng Chờ
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : tab === 'stats' && isAdmin ? (
              /* ── STATISTICS DASHBOARD ─────────────────── */
              <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2.5" style={{ fontFamily: F.heading, color: C.txt }}>
                      <i className="ri-bar-chart-2-fill" style={{ color: '#06b6d4' }} />
                      Thống Kê Hệ Thống
                    </h2>
                    <p className="text-xs mt-1" style={{ color: C.txtSub }}>
                      Dữ liệu tự động cập nhật mỗi 10 giây · {statsData ? new Date(statsData.generatedAt).toLocaleTimeString('vi-VN') : '—'}
                    </p>
                  </div>
                  <button onClick={fetchStats} disabled={statsLoading}
                    className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer"
                    style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}>
                    <i className={`ri-refresh-line ${statsLoading ? 'animate-spin' : ''}`} />
                    Làm mới
                  </button>
                </div>

                {statsLoading && !statsData ? (
                  <div className="flex items-center justify-center py-20">
                    <i className="ri-loader-4-line text-4xl animate-spin" style={{ color: '#06b6d4' }} />
                  </div>
                ) : statsData ? (<>

                  {/* ── SUMMARY CARDS ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                    {[
                      { label: 'Tổng Người Dùng', value: statsData.users.total, icon: 'ri-team-fill', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
                      { label: 'Tổng Bài Hát', value: statsData.songs.total, icon: 'ri-music-2-fill', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                      { label: 'Tổng Playlist', value: statsData.playlists.total, icon: 'ri-play-list-fill', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
                    ].map(card => (
                      <div key={card.label} className="p-5 rounded-2xl flex items-center gap-4 shadow-sm" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: card.bg, color: card.color }}>
                          <i className={card.icon} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-3xl font-black leading-none" style={{ color: C.txt }}>{card.value}</span>
                          <span className="text-xs font-semibold mt-1" style={{ color: C.txtSub }}>{card.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── DAILY ACTIVE USERS CHART ── */}
                  <div className="p-5 rounded-2xl shadow-sm flex flex-col gap-4" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <i className="ri-line-chart-line text-lg" style={{ color: '#06b6d4' }} />
                        <h3 className="text-base font-bold" style={{ color: C.txt }}>Lượng Người Dùng Hoạt Động Theo Ngày (30 ngày)</h3>
                      </div>
                      <span className="text-[11px] font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
                        <i className="ri-cursor-fill text-xs animate-bounce" /> Nhấp vào điểm ngày trên biểu đồ để xem chi tiết
                      </span>
                    </div>

                    <div className="h-72 w-full">
                      {statsData.dailyActiveUsersChart?.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-sm" style={{ color: C.txtSub }}>Chưa có dữ liệu hoạt động</p>
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={statsData.dailyActiveUsersChart}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            onClick={(e) => {
                              if (e && e.activePayload && e.activePayload[0]) {
                                setSelectedDayStat(e.activePayload[0].payload);
                              }
                            }}
                          >
                            <defs>
                              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                            <XAxis
                              dataKey="date"
                              stroke={C.txtSub}
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(val) => {
                                const d = new Date(val);
                                return `${d.getDate()}/${d.getMonth() + 1}`;
                              }}
                            />
                            <YAxis
                              stroke={C.txtSub}
                              fontSize={11}
                              tickLine={false}
                              axisLine={false}
                            />
                            <RechartsTooltip
                              contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', color: C.txt }}
                              itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                              labelStyle={{ color: C.txtSub, marginBottom: '4px' }}
                              formatter={(value) => [`${value} người dùng (Nhấp để xem danh sách)`, 'Hoạt động']}
                            />
                            <Area
                              type="monotone"
                              dataKey="count"
                              name="Người dùng"
                              stroke="#06b6d4"
                              strokeWidth={3}
                              fillOpacity={1}
                              fill="url(#colorActive)"
                              activeDot={{
                                r: 8,
                                style: { cursor: 'pointer' },
                                onClick: (e, payload) => {
                                  if (payload && payload.payload) {
                                    setSelectedDayStat(payload.payload);
                                  }
                                }
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    {/* Quick Date Selector Chips */}
                    {statsData.dailyActiveUsersChart?.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-2 pb-1">
                        <span className="text-[11px] font-bold shrink-0" style={{ color: C.txtFad }}>Danh sách các ngày:</span>
                        {statsData.dailyActiveUsersChart.slice(-14).map((d) => (
                          <button
                            key={d.date}
                            onClick={() => setSelectedDayStat(d)}
                            className="px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                            style={{
                              background: C.surface,
                              border: `1px solid ${C.border}`,
                              color: C.txt
                            }}
                          >
                            <span style={{ color: '#06b6d4' }}>{d.date.split('-').slice(1).join('/')}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-400 font-extrabold">{d.count} ng/dùng</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── TOP ACTIVE USERS ── */}
                  <div className="p-5 rounded-2xl shadow-sm" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-6">
                      <i className="ri-timer-flash-fill text-lg" style={{ color: '#f59e0b' }} />
                      <h3 className="text-base font-bold" style={{ color: C.txt }}>Danh Sách Người Dùng Hoạt Động (Tổng {statsData.topActiveUsers?.length || 0} Thành Viên)</h3>
                    </div>
                    <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto custom-scrollbar pr-1">
                      {statsData.topActiveUsers?.length === 0 ? (
                        <p className="text-sm" style={{ color: C.txtSub }}>Chưa có dữ liệu thời gian</p>
                      ) : statsData.topActiveUsers.map((u, i) => (
                        <div key={u._id || i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl gap-4 transition hover:opacity-95" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-black w-6 text-center" style={{ color: i < 3 ? '#f59e0b' : C.txtSub }}>#{i + 1}</span>
                            <img src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold" style={{ color: C.txt }}>{u.name}</span>
                              <span className="text-[10px]" style={{ color: C.txtSub }}>{u.email}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <i className="ri-time-line" style={{ color: '#f59e0b' }}></i>
                            <span className="text-sm font-bold" style={{ color: C.txt }}>
                              {u.totalActiveTime < 60
                                ? `${u.totalActiveTime} giây`
                                : u.totalActiveTime < 3600
                                  ? `${Math.floor(u.totalActiveTime / 60)} phút ${u.totalActiveTime % 60} giây`
                                  : `${Math.floor(u.totalActiveTime / 3600)} giờ ${Math.floor((u.totalActiveTime % 3600) / 60)} phút`
                              }
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </>) : (
                  <p className="text-sm text-center py-10" style={{ color: C.txtSub }}>Không tải được dữ liệu thống kê.</p>
                )}
              </div>
            ) : tab === 'admin' && isAdmin ? (
              /* ── ADMIN MANAGEMENT VIEW ─────────────────── */
              <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
                <input
                  type="file"
                  ref={adminListAvatarInputRef}
                  onChange={handleListAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
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
                  {adminUsersLoading && adminUsers.length === 0 ? (
                    <div className="text-center py-16 animate-pulse">
                      <i className="ri-shield-flash-line text-4xl mb-3 inline-block" style={{ color: C.primarySolid }} />
                      <p className="text-sm font-semibold" style={{ color: C.txtSub }}>Đang tải danh sách tài khoản từ DB...</p>
                    </div>
                  ) : adminUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">🛡️</div>
                      <p className="text-sm font-semibold" style={{ color: C.txtFad }}>Chưa có tài khoản nào trong hệ thống...</p>
                    </div>
                  ) : adminUsers
                    .filter(u => !adminSearch || u.name?.toLowerCase().includes(adminSearch.toLowerCase()) || u.email?.toLowerCase().includes(adminSearch.toLowerCase()))
                    .map(u => {
                      const isUserAdmin = u.role === 'admin' || u.email === 'admin@gmail.com' || u.email === 'unnull@gmail.com';
                      const isCurrentUser = user && (u._id === user._id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()));
                      const isOnline = isCurrentUser || Boolean(u.isOnline);
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
                              onClick={() => handleListAvatarClick(u)}
                              title="Bấm để đổi ảnh đại diện nhanh"
                              className={`w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs ${isSuperAdminAccount(u) && !isCurrentSuperAdmin ? '' : 'cursor-pointer hover:opacity-80 transition'}`}
                              style={{ border: `2px solid ${C.border}` }}
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold truncate" style={{ color: C.txt }}>{u.name}</span>
                                {/* Online / Offline Status Dot */}
                                <span
                                  title={isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                                  style={{
                                    display: 'inline-block',
                                    width: 9,
                                    height: 9,
                                    borderRadius: '50%',
                                    background: isOnline ? '#22c55e' : '#6b7280',
                                    boxShadow: isOnline ? '0 0 6px 2px rgba(34,197,94,0.55)' : 'none',
                                    flexShrink: 0,
                                  }}
                                />
                                <span className="text-[9px] font-bold" style={{ color: isOnline ? '#22c55e' : '#6b7280' }}>
                                  {isOnline ? 'Online' : 'Offline'}
                                </span>
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
                                  setAdminAvatar(u.avatar || '');
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
              <>
                {/* ── Hero Banner ─────────────────────── */}
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-3xl p-6 md:p-8 mt-4 md:mt-0 shadow-sm min-h-[400px]"
                  style={{ background: C.surface, border: `1.5px solid ${C.border}`, boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
                >
                  {/* 3D Glowing Glass Bubbles Canvas or Seasonal Items */}
                  <BubbleCanvas themeKey={themeKey} />

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

                {/* ── 2-COLUMN SECTION: LEADERBOARD (LEFT 65%) & POPULAR SONGS (RIGHT 35%) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 w-full">

                  {/* LEFT (7 Cols): BẢNG XẾP HẠNG THỜI GIAN SỬ DỤNG (TOP 10 NGƯỜI DÙNG) */}
                  <div className="lg:col-span-7 flex flex-col gap-4 p-5 md:p-6 rounded-3xl border shadow-sm transition-all"
                    style={{ background: C.surface, borderColor: C.border }}>

                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.border }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', color: '#fff' }}>
                          🏆
                        </div>
                        <div>
                          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2" style={{ color: C.txt, fontFamily: F.heading }}>
                            Bảng Xếp Hạng Online
                          </h2>
                          <p className="text-xs" style={{ color: C.txtSub }}>
                            Top 10 thành viên tích lũy thời gian nghe nhạc &amp; hoạt động nhiều nhất
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                        ⚡ Cập nhật liên tục
                      </span>
                    </div>

                    {/* Leaderboard List (Tối đa Top 10 người dùng, không hiện Role) */}
                    <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                      {(() => {
                        const safeLb = (Array.isArray(publicLeaderboard) ? publicLeaderboard : []).filter(Boolean).slice(0, 10);
                        if (leaderboardLoading && safeLb.length === 0) {
                          return (
                            <div className="py-12 text-center text-xs flex flex-col items-center justify-center gap-2 animate-pulse" style={{ color: C.txtSub }}>
                              <i className="ri-trophy-line text-3xl" style={{ color: C.primarySolid }}></i>
                              <span>Đang tải bảng xếp hạng...</span>
                            </div>
                          );
                        }
                        if (!leaderboardLoading && safeLb.length === 0) {
                          return (
                            <div className="py-12 text-center text-xs" style={{ color: C.txtFad }}>
                              Chưa có dữ liệu xếp hạng...
                            </div>
                          );
                        }
                        return safeLb.map((lbUser, idx) => {
                          const badge = getLeaderboardBadge(lbUser?.totalActiveTime || 0);
                          const isTop1 = idx === 0;
                          const isTop2 = idx === 1;
                          const isTop3 = idx === 2;

                          return (
                            <div key={lbUser?._id || idx}
                              onClick={() => setViewUserProfileModal({ user: lbUser, rank: idx + 1 })}
                              className="flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                              title="Bấm để xem Hồ Sơ Người Dùng & Bài hát đang nghe"
                              style={{
                                background: isTop1 ? 'rgba(245, 158, 11, 0.08)' : (isTop2 ? 'rgba(148, 163, 184, 0.08)' : (isTop3 ? 'rgba(217, 119, 6, 0.06)' : (C.isDark ? 'rgba(30,41,59,0.4)' : '#f8fafc'))),
                                borderColor: isTop1 ? '#f59e0b' : (isTop2 ? '#94a3b8' : (isTop3 ? '#b45309' : C.border))
                              }}>

                              {/* Rank Medal */}
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs"
                                style={{
                                  background: isTop1 ? 'linear-gradient(135deg,#f59e0b,#fbbf24)' : (isTop2 ? 'linear-gradient(135deg,#94a3b8,#cbd5e1)' : (isTop3 ? 'linear-gradient(135deg,#b45309,#d97706)' : C.tag)),
                                  color: isTop1 || isTop2 || isTop3 ? '#fff' : C.txtSub
                                }}>
                                {isTop1 ? '🥇' : (isTop2 ? '🥈' : (isTop3 ? '🥉' : `#${idx + 1}`))}
                              </div>

                              {/* Avatar */}
                              <img src={lbUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                                alt={lbUser?.name || 'User'}
                                className="w-10 h-10 rounded-full object-cover shrink-0 border-2"
                                style={{ borderColor: isTop1 ? '#f59e0b' : C.border }}
                              />

                              {/* User Details (Không hiện Role) */}
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-xs font-bold truncate" style={{ color: C.txt }}>
                                  {lbUser?.name || 'Thành viên'}
                                </span>
                                <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: C.primarySolid }}>
                                  <i className="ri-time-line text-xs"></i> {fmtActiveTime(lbUser?.totalActiveTime || 0)}
                                </span>
                              </div>

                              {/* Unlocked Title Badge */}
                              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 border"
                                style={{ background: badge.bg, color: badge.color, borderColor: badge.color + '40' }}>
                                {badge.label}
                              </span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* RIGHT (5 Cols): TOP BÀI HÁT ĐƯỢC NGHE NHIỀU NHẤT CỦA TOÀN BỘ HỆ THỐNG */}
                  <div className="lg:col-span-5 flex flex-col gap-4 p-5 md:p-6 rounded-3xl border shadow-sm transition-all"
                    style={{ background: C.surface, borderColor: C.border }}>

                    <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.border }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff' }}>
                          🔥
                        </div>
                        <div>
                          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2" style={{ color: C.txt, fontFamily: F.heading }}>
                            Bài Hát Thịnh Hành
                          </h2>
                          <p className="text-xs" style={{ color: C.txtSub }}>
                            Được nghe nhiều nhất bởi toàn bộ người dùng
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Popular Songs List (Dynamic from all users' listening history) */}
                    <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                      {(() => {
                        const displayQueue = (Array.isArray(popularSongs) && popularSongs.length > 0 ? popularSongs : (Array.isArray(songs) ? songs : [])).filter(Boolean);
                        if (displayQueue.length === 0) {
                          return (
                            <div className="py-12 text-center text-xs" style={{ color: C.txtFad }}>
                              Chưa có bài hát nào trên hệ thống.
                            </div>
                          );
                        }
                        return displayQueue.slice(0, 15).map((s, idx) => {
                          if (!s) return null;
                          const isPlayingThis = Boolean(track && (track.id === s.id || track._id === s._id || (s.youtubeId && track.youtubeId === s.youtubeId)) && playing);
                          return (
                            <div key={s.id || s._id || idx}
                              className="flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-200 group hover:scale-[1.01]"
                              style={{
                                background: isPlayingThis ? C.tag : (C.isDark ? 'rgba(30,41,59,0.4)' : '#f8fafc'),
                                borderColor: isPlayingThis ? C.primarySolid : C.border
                              }}>

                              {/* Song Thumbnail & Play Overlay */}
                              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 group/img cursor-pointer"
                                onClick={() => {
                                  if (isPlayingThis) {
                                    togglePlay();
                                  } else {
                                    play(s, displayQueue);
                                  }
                                }}>
                                <img src={s.thumbnail || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80"} alt={s.title || 'Song'} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-100'}`}>
                                  {isPlayingThis ? (
                                    <i className="ri-pause-fill text-white text-lg animate-pulse" />
                                  ) : (
                                    <i className="ri-play-fill text-white text-lg ml-0.5" />
                                  )}
                                </div>
                              </div>

                              {/* Song Info */}
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-xs font-bold truncate cursor-pointer hover:underline"
                                  style={{ color: isPlayingThis ? C.primarySolid : C.txt }}
                                  onClick={() => play(s, displayQueue)}>
                                  {s.title || 'Bài Hát'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] truncate" style={{ color: C.txtSub }}>
                                    {s.artist || 'Nghệ sĩ'}
                                  </span>
                                  {s.playCount > 0 && (
                                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-red-500/15 text-red-500 border border-red-500/20 shrink-0">
                                      🔥 {s.playCount} lượt nghe
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons: Add to Playlist & Favorite */}
                              <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => setSongToAdd(s)}
                                  title="Thêm bài hát này vào danh sách phát tùy chọn của bạn"
                                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.primarySolid }}
                                >
                                  <i className="ri-playlist-add-line text-sm"></i>
                                  <span className="hidden sm:inline">Thêm</span>
                                </button>

                                <button
                                  onClick={() => toggleFav(s)}
                                  title={isFav(s) ? "Bỏ yêu thích bài hát này" : "Thêm bài hát này vào Yêu Thích"}
                                  className="p-1.5 px-2 rounded-xl transition active:scale-95 cursor-pointer hover:scale-110 shrink-0 flex items-center justify-center"
                                  style={{
                                    background: isFav(s) ? 'rgba(244, 63, 94, 0.15)' : C.tag,
                                    border: `1.5px solid ${isFav(s) ? 'rgba(244, 63, 94, 0.3)' : C.border}`,
                                    color: isFav(s) ? '#f43f5e' : C.txtFad
                                  }}
                                >
                                  <i className={isFav(s) ? 'ri-heart-fill text-sm text-rose-500' : 'ri-heart-line text-sm'} />
                                </button>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── SPOTIFY-STYLE PLAYLIST / TAB HERO BANNER ─────────────────── */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 mb-6 rounded-3xl relative overflow-hidden transition-all duration-300 shadow-sm"
                  style={{
                    background: activePlaylist
                      ? 'linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(99,102,241,0.14) 100%)'
                      : tab === 'favorites'
                        ? 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(168,85,247,0.16) 100%)'
                        : C.surface,
                    border: `1.5px solid ${C.border}`
                  }}
                >
                  {/* Background Ambient Glow */}
                  <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none opacity-40 blur-3xl"
                    style={{ background: activePlaylist ? C.primaryGlow : (tab === 'favorites' ? '#f43f5e' : C.borderSel) }} />

                  {/* Playlist Cover Art Image / 2x2 Grid with Spotify Hover Edit Overlay */}
                  <div
                    className={`shrink-0 relative group z-10 ${activePlaylist ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (activePlaylist) {
                        setEditPlaylistModal(activePlaylist);
                        setEditPlaylistName(activePlaylist.name);
                        setEditPlaylistCover(activePlaylist.cover || '');
                      }
                    }}
                    title={activePlaylist ? "Bấm để chỉnh sửa tên hoặc thay đổi ảnh đại diện Playlist" : ""}
                  >
                    {(() => {
                      if (activePlaylist && activePlaylist.cover) {
                        return (
                          <img
                            src={activePlaylist.cover}
                            alt={activePlaylist.name}
                            className="w-36 h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl object-cover shadow-2xl shrink-0 border"
                            style={{ border: `2.5px solid ${C.borderSel || C.border}` }}
                          />
                        );
                      }
                      if (tab === 'favorites') {
                        return (
                          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)' }}>
                            <i className="ri-heart-3-fill text-5xl mb-1 drop-shadow-md"></i>
                            <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">Favorites</span>
                          </div>
                        );
                      }
                      const thumbs = list.slice(0, 4).map(s => s.thumbnail).filter(Boolean);
                      if (thumbs.length >= 4) {
                        return (
                          <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2 shrink-0 border"
                            style={{ borderColor: C.border }}>
                            {thumbs.map((t, idx) => (
                              <img key={idx} src={t} alt="" className="w-full h-full object-cover" />
                            ))}
                          </div>
                        );
                      }
                      if (thumbs.length > 0) {
                        return (
                          <img
                            src={thumbs[0]}
                            alt=""
                            className="w-36 h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl object-cover shadow-2xl shrink-0 border"
                            style={{ border: `2px solid ${C.border}` }}
                          />
                        );
                      }
                      return (
                        <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center text-white shrink-0"
                          style={{ background: C.primary }}>
                          <i className="ri-playlist-2-line text-5xl"></i>
                        </div>
                      );
                    })()}

                    {/* Spotify-style Hover Pencil Overlay for Editing Playlist Photo */}
                    {activePlaylist && (
                      <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-inner">
                        <i className="ri-pencil-line text-3xl md:text-4xl mb-1 drop-shadow-md"></i>
                        <span className="text-xs font-bold tracking-wide">Đổi ảnh</span>
                      </div>
                    )}
                  </div>

                  {/* Banner Text Info & Action Bar */}
                  <div className="flex flex-col text-center md:text-left min-w-0 flex-1 z-10 w-full">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider mb-1 flex items-center justify-center md:justify-start gap-1.5"
                      style={{ color: C.primarySolid }}>
                      <i className="ri-disc-line"></i>
                      {tab === 'favorites' ? 'Danh sách yêu thích' : activePlaylist ? 'Danh sách phát' : 'Thư viện nhạc'}
                    </span>

                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 truncate leading-tight"
                      style={{ color: C.txt, fontFamily: F.heading }}>
                      {tab === 'favorites' ? 'Bài Hát Đã Thích' : activePlaylist ? activePlaylist.name : 'Thư Viện Nhạc Của Tôi'}
                    </h1>

                    {/* Owner & Meta line */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold" style={{ color: C.txtSub }}>
                      <div className="flex items-center gap-1.5">
                        <img
                          src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold" style={{ color: C.txt }}>{user?.name || 'Thành viên'}</span>
                      </div>
                      <span>•</span>
                      <span>{list.length} bài hát</span>
                      {list.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{calculateTotalDuration(list)}</span>
                        </>
                      )}
                    </div>

                    {/* Main Action Bar in Banner */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
                      {list.length > 0 && (
                        <button
                          onClick={() => {
                            const isCurrentListPlaying = track && list.some(s => s.id === track.id);
                            if (isCurrentListPlaying) {
                              togglePlay();
                            } else {
                              play(list[0], list);
                            }
                          }}
                          title={track && list.some(s => s.id === track.id) && playing ? "Tạm dừng phát nhạc" : "Phát tất cả bài hát từ đầu"}
                          className={`w-12 h-12 rounded-full text-white flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer ${getSeasonalPlayBtnClass(themeKey) || 'shadow-xl'}`}
                          style={getSeasonalPlayBtnClass(themeKey) ? {} : { background: C.primary, boxShadow: `0 6px 20px ${C.primaryGlow}` }}
                        >
                          {track && list.some(s => s.id === track.id) && playing ? (
                            buffering ? <i className="ri-loader-4-line text-2xl animate-spin" /> : <i className="ri-pause-fill text-2xl" />
                          ) : (
                            <i className="ri-play-fill text-2xl ml-0.5" />
                          )}
                        </button>
                      )}

                      {/* Spotify-style Local Search / Filter Bar */}
                      <div className="relative flex-1 max-w-xs min-w-[200px]">
                        <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.txtFad }}></i>
                        <input
                          type="text"
                          placeholder="🔍 Lọc bài hát trong danh sách này..."
                          value={localFilterQuery}
                          onChange={e => { setLocalFilterQuery(e.target.value); setSongPage(1); }}
                          className="w-full pl-9 pr-7 py-2.5 rounded-2xl text-xs font-semibold outline-none transition"
                          style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                        />
                        {localFilterQuery && (
                          <button onClick={() => setLocalFilterQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: C.txtFad }}>
                            ✕
                          </button>
                        )}
                      </div>

                      {list.length > 0 && (
                        <button
                          onClick={random}
                          title="Phát ngẫu nhiên danh sách này"
                          className="px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                          style={{ background: C.tag, color: C.txt, border: `1.5px solid ${C.border}` }}
                        >
                          <i className="ri-shuffle-line text-sm" style={{ color: C.primarySolid }}></i>
                          <span>Phát Ngẫu Nhiên</span>
                        </button>
                      )}

                      {list.length > 0 && (
                        <button
                          onClick={() => {
                            setIsSelectMode(!isSelectMode);
                            if (isSelectMode) setSelectedSongIds([]);
                          }}
                          title={isSelectMode ? "Thoát chế độ chọn bài" : "Chọn nhiều bài hát"}
                          className="px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                          style={isSelectMode
                            ? { background: C.primary, color: '#fff', boxShadow: `0 3px 12px ${C.primaryGlow}` }
                            : { background: C.tag, color: C.txt, border: `1.5px solid ${C.border}` }}
                        >
                          <i className={isSelectMode ? "ri-close-line text-sm" : "ri-checkbox-multiple-line text-sm"}></i>
                          <span>{isSelectMode ? "Thoát Chọn" : "Chọn Bài Hát"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── BATCH ACTION BAR (Khi bật chế độ chọn bài hát) ─────────────────── */}
                {isSelectMode && (
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 mb-4 rounded-2xl shadow-lg border animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ background: C.surface, borderColor: C.borderSel, boxShadow: `0 8px 30px ${C.primaryGlow}` }}>

                    <div className="flex items-center gap-2.5">
                      {/* Checkbox Select All */}
                      <button
                        onClick={() => handleToggleSelectAll(list)}
                        className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition hover:opacity-80"
                        style={{ background: C.tag, color: C.txt, border: `1px solid ${C.border}` }}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${list.length > 0 && list.every(s => selectedSongIds.includes(s.id)) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'}`}>
                          {list.length > 0 && list.every(s => selectedSongIds.includes(s.id)) && <i className="ri-check-line text-xs font-black"></i>}
                        </div>
                        <span>{list.length > 0 && list.every(s => selectedSongIds.includes(s.id)) ? 'Bỏ Chọn Tất Cả' : 'Chọn Tất Cả'}</span>
                      </button>

                      <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl" style={{ background: C.tag, color: C.primarySolid }}>
                        Đã chọn {selectedSongIds.length} / {list.length} bài
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Batch Favorite */}
                      <button
                        onClick={handleBatchFavorite}
                        disabled={selectedSongIds.length === 0}
                        title="Thêm hoặc bỏ tất cả bài hát đã chọn khỏi Yêu Thích"
                        className="text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: C.tag, color: C.primarySolid, border: `1.5px solid ${C.border}` }}
                      >
                        <i className="ri-heart-fill text-sm" style={{ color: C.primarySolid }}></i>
                        <span>Yêu Thích ({selectedSongIds.length})</span>
                      </button>

                      {/* Batch Delete */}
                      <button
                        onClick={() => setConfirmBatchDeleteModal(true)}
                        disabled={selectedSongIds.length === 0}
                        title="Xóa tất cả bài hát đã chọn"
                        className="text-xs px-3.5 py-1.5 rounded-xl font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: '#ef4444', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                        <span>Xóa Hàng Loạt ({selectedSongIds.length})</span>
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={() => { setIsSelectMode(false); setSelectedSongIds([]); }}
                        className="p-1.5 rounded-xl text-xs font-bold transition hover:opacity-80 cursor-pointer"
                        style={{ color: C.txtFad }}
                        title="Đóng chế độ chọn"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Song list ───────────────────────── */}
                <div className="flex flex-col gap-2">
                  {list.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">🕊️</div>
                      <p className="text-sm font-semibold" style={{ color: C.txtFad }}>Chưa có bài hát nào~</p>
                    </div>
                  ) : paginatedList.map((song, i) => {
                    const sel = track?.id === song.id;
                    const isPlayingThis = sel && playing;
                    const isSelected = selectedSongIds.includes(song.id);
                    const realIndex = showAllSongs ? i + 1 : (currentSongPage - 1) * SONGS_PER_PAGE + i + 1;
                    return (
                      <div key={song.id}
                        onClick={() => {
                          if (isSelectMode) {
                            toggleSelectSong(song.id);
                          } else {
                            if (sel) {
                              togglePlay();
                            } else {
                              play(song, list);
                            }
                          }
                        }}
                        title={isSelectMode ? `Bấm để ${isSelected ? 'bỏ chọn' : 'chọn'} ${song.title}` : `Bấm để phát: ${song.title} - ${song.artist}`}
                        className={`flex items-center p-2 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200 group gap-2 md:gap-3 hover:opacity-95 ${isPlayingThis ? 'active-playing-led-row' : ''
                          }`}
                        style={{
                          '--led-color': C.primarySolid,
                          '--led-glow': C.primaryGlow,
                          background: isSelected ? C.tag : (sel ? C.tag : C.surface),
                          border: isPlayingThis ? `2px solid ${C.primarySolid}` : `1.5px solid ${isSelected ? C.primarySolid : (sel ? C.borderSel : 'transparent')}`,
                          boxShadow: isPlayingThis ? `0 0 22px ${C.primaryGlow}` : (sel || isSelected ? '0 4px 18px rgba(0,0,0,0.06)' : 'none'),
                        }}
                      >
                        {/* If select mode is active, show checkbox on left instead of track number */}
                        {isSelectMode ? (
                          <div
                            onClick={(e) => { e.stopPropagation(); toggleSelectSong(song.id); }}
                            className="w-8 shrink-0 flex items-center justify-center cursor-pointer"
                          >
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border-2 transition ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' : 'border-gray-400 bg-transparent'}`}>
                              {isSelected && <i className="ri-check-line text-xs font-black"></i>}
                            </div>
                          </div>
                        ) : (
                          <span className="hidden md:flex justify-center items-center text-sm font-bold w-8 shrink-0" style={{ color: C.txtFad }}>
                            {sel && playing
                              ? <i className="ri-volume-up-fill animate-pulse" style={{ color: C.primarySolid }}></i>
                              : realIndex
                            }
                          </span>
                        )}

                        <img src={song.thumbnail} alt={song.title}
                          className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover shrink-0"
                          style={{ border: `2px solid ${sel ? C.border : 'transparent'}` }}
                        />
                        <div className="flex flex-col flex-1 min-w-0 pr-1 md:pr-2">
                          <span className="text-xs md:text-sm font-bold truncate" style={{ color: sel || isSelected ? C.primarySolid : C.txt }}>{song.title}</span>
                          <span className="text-[10px] md:text-xs truncate" style={{ color: C.txtSub }}>{song.artist}</span>
                        </div>
                        <span className="hidden sm:flex items-center justify-center text-xs font-bold text-center shrink-0 w-16 px-1" style={{ color: C.txtFad }}>{song.duration}</span>

                        <div className="flex justify-end items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSongToAdd(song)} title="Thêm bài hát này vào danh sách phát"
                            className="p-1.5 md:p-2 rounded-full transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-95 cursor-pointer hover:scale-110"
                            style={{ color: C.txtFad }}
                            onMouseEnter={e => e.currentTarget.style.color = C.primarySolid}
                            onMouseLeave={e => e.currentTarget.style.color = C.txtFad}>
                            <i className="ri-play-list-add-line text-sm md:text-base"></i>
                          </button>
                          <button onClick={() => toggleFav(song)}
                            title={isFav(song) ? "Bỏ yêu thích bài hát này" : "Thêm bài hát này vào yêu thích"}
                            className="p-1.5 md:p-2 rounded-full transition active:scale-95 cursor-pointer hover:scale-110"
                            style={{ color: isFav(song) ? C.primarySolid : C.txtFad }}>
                            <i className={isFav(song) ? 'ri-heart-fill text-sm md:text-base' : 'ri-heart-line text-sm md:text-base'}></i>
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

                {/* ── Song Pagination Controls ───────────────────────── */}
                {list.length > SONGS_PER_PAGE && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-5 pb-2 px-2 border-t mt-4" style={{ borderColor: C.border }}>
                    <div className="text-xs font-semibold" style={{ color: C.txtSub }}>
                      {showAllSongs ? (
                        <span>Hiển thị tất cả <b>{list.length}</b> bài hát</span>
                      ) : (
                        <span>Hiển thị <b>{(currentSongPage - 1) * SONGS_PER_PAGE + 1} - {Math.min(currentSongPage * SONGS_PER_PAGE, list.length)}</b> / <b>{list.length}</b> bài</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => setShowAllSongs(!showAllSongs)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer hover:opacity-90 mr-2"
                        style={{ background: showAllSongs ? C.primarySolid : C.tag, color: showAllSongs ? '#fff' : C.txt, border: `1px solid ${C.border}` }}
                      >
                        {showAllSongs ? '⚡ Chia trang (Tối ưu máy yếu)' : 'Xem tất cả'}
                      </button>

                      {!showAllSongs && (
                        <>
                          <button
                            disabled={currentSongPage === 1}
                            onClick={() => setSongPage(1)}
                            className="p-2 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer"
                            style={{ background: C.tag, color: C.txt }}
                            title="Trang đầu"
                          >
                            <i className="ri-double-left-line"></i>
                          </button>
                          <button
                            disabled={currentSongPage === 1}
                            onClick={() => setSongPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer flex items-center gap-1"
                            style={{ background: C.tag, color: C.txt }}
                          >
                            <i className="ri-arrow-left-s-line"></i> Trước
                          </button>

                          <span className="px-3 py-1.5 text-xs font-extrabold rounded-xl" style={{ background: C.surface, border: `1px solid ${C.borderSel}`, color: C.txt }}>
                            {currentSongPage} / {totalSongPages}
                          </span>

                          <button
                            disabled={currentSongPage >= totalSongPages}
                            onClick={() => setSongPage(p => Math.min(totalSongPages, p + 1))}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer flex items-center gap-1"
                            style={{ background: C.tag, color: C.txt }}
                          >
                            Sau <i className="ri-arrow-right-s-line"></i>
                          </button>
                          <button
                            disabled={currentSongPage >= totalSongPages}
                            onClick={() => setSongPage(totalSongPages)}
                            className="p-2 rounded-xl text-xs font-bold transition disabled:opacity-30 cursor-pointer"
                            style={{ background: C.tag, color: C.txt }}
                            title="Trang cuối"
                          >
                            <i className="ri-double-right-line"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* ── INLINE LYRICS PANEL (Matching Reference Image 1 & Selected Theme) ─────────────────────────── */}
        {lyricsModal && track && (
          <div
            className="shrink-0 flex flex-col overflow-hidden transition-all duration-300 shadow-xl relative"
            style={{
              width: '520px',
              borderLeft: `1.5px solid ${C.border}`,
              background: C.surface,
              color: C.txt,
              zIndex: 30,
            }}
          >
            {/* Ambient Blur Artwork Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <img src={track.thumbnail} alt="" className="w-full h-full object-cover blur-3xl scale-125 saturate-150" />
            </div>

            {/* Panel Header Matching Image 1 (Track Info & Pill Tab Controls) */}
            <div className="relative z-10 p-5 pb-4 shrink-0" style={{ borderBottom: `1.5px solid ${C.border}` }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                {/* Song Title & Artist */}
                <div className="flex flex-col min-w-0 flex-1 z-10">
                  <h3 className="text-base font-extrabold truncate leading-tight" style={{ color: C.txt, fontFamily: F.heading }}>
                    {getCleanSongTitle(track)}
                  </h3>
                  <p className="text-xs truncate font-semibold mt-1" style={{ color: C.txtSub }}>
                    {track.artist || 'Nhiều ca sĩ'}
                  </p>
                </div>

                {/* Pill Action Controls (Matching Reference Image 1) */}
                <div className="flex items-center gap-1.5 shrink-0 z-10">
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    style={{ background: C.primary, color: '#fff', boxShadow: `0 2px 10px ${C.primaryGlow}` }}
                  >
                    <i className="ri-list-check-2 text-xs" />
                    <span>Lời bài hát</span>
                  </div>

                  <button
                    onClick={() => setLyricsEditMode(!lyricsEditMode)}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer transition hover:opacity-90 active:scale-95 border"
                    style={{ background: C.tag, color: C.txtSub, borderColor: C.border }}
                    title="Tự sửa hoặc dán lời bài hát"
                  >
                    <i className={lyricsEditMode ? 'ri-close-line' : 'ri-edit-box-line'} />
                    <span>{lyricsEditMode ? 'Đóng' : 'Sửa'}</span>
                  </button>

                  <button
                    onClick={() => setLyricsModal(false)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-90 active:scale-95 border"
                    style={{ background: C.tag, color: C.txtFad, borderColor: C.border }}
                    title="Đóng bảng lời bài hát"
                  >
                    <i className="ri-close-line text-sm" />
                  </button>
                </div>
              </div>

              {/* 🎵 Animated Equalizer Music Visualizer Bars */}
              <div className="flex items-end gap-1 h-6 pt-1">
                {[...Array(18)].map((_, i) => (
                  <div
                    key={i}
                    className={`eq-bar ${!playing ? 'paused' : ''}`}
                    style={{ background: C.primarySolid, opacity: playing ? 0.9 : 0.4 }}
                  />
                ))}
                {lyricsData?.isSynced && (
                  <span
                    className="ml-auto text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border"
                    style={{ background: `${C.primarySolid}18`, color: C.primarySolid, borderColor: `${C.primarySolid}35` }}
                  >
                    SYNC
                  </span>
                )}
              </div>
            </div>

            {/* Lyrics Content Area (Matches Light & Dark Themes Dynamic Palette) */}
            <div className="relative z-10 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 py-4">
              {lyricsLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 py-10">
                  <i className="ri-loader-4-line text-3xl animate-spin" style={{ color: C.primarySolid }} />
                  <p className="text-xs font-bold" style={{ color: C.txtSub }}>Đang tải lời bài hát...</p>
                </div>
              ) : lyricsEditMode ? (
                <div className="flex flex-col gap-3 py-2">
                  <p className="text-[11px]" style={{ color: C.txtSub }}>
                    Dán lời LRC <code className="font-bold" style={{ color: C.primarySolid }}>[00:12.34] lời...</code> để chạy Karaoke, hoặc dán văn bản thường.
                  </p>
                  <textarea
                    rows={14}
                    value={customLyricsInput}
                    onChange={e => setCustomLyricsInput(e.target.value)}
                    placeholder="Dán lời bài hát tại đây..."
                    className="w-full p-3.5 rounded-2xl text-xs outline-none font-mono resize-none transition"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLyricsEditMode(false)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition hover:opacity-80 border"
                      style={{ background: C.tag, color: C.txt, borderColor: C.border }}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveCustomLyrics}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{ background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
                    >
                      <i className="ri-save-line" /> Lưu
                    </button>
                  </div>
                </div>
              ) : lyricsData?.isSynced && lyricsData.synced.length > 0 ? (
                <div ref={lyricsContainerRef} className="flex flex-col gap-2.5 py-4">
                  {lyricsData.synced.map((line, idx) => {
                    const isActive = activeLyricIndex === idx;
                    return (
                      <div
                        key={idx}
                        ref={isActive ? activeLyricRef : null}
                        onClick={() => seek(line.time)}
                        className="cursor-pointer select-none py-1.5 px-2 rounded-xl text-sm leading-relaxed transition-all duration-300"
                        style={{
                          color: isActive ? C.primarySolid : C.txtSub,
                          textShadow: isActive ? `0 0 16px ${C.primaryGlow}, 0 0 28px ${C.primaryGlow}` : 'none',
                          fontWeight: isActive ? 700 : 400,
                          opacity: isActive ? 1 : 0.65,
                        }}
                      >
                        {line.text}
                      </div>
                    );
                  })}
                </div>
              ) : lyricsData?.plain ? (
                <div className="py-4 whitespace-pre-wrap leading-relaxed text-sm font-medium" style={{ color: C.txt }}>
                  {lyricsData.plain}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: C.tag, color: C.txtFad }}>
                    <i className="ri-music-2-line" />
                  </div>
                  <p className="text-xs font-bold" style={{ color: C.txt }}>Chưa có lời bài hát</p>
                  <p className="text-[11px]" style={{ color: C.txtFad }}>Bấm "Sửa" để tự nhập lời nhạc hoặc karaoke LRC.</p>
                  <button
                    onClick={() => setLyricsEditMode(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 cursor-pointer transition hover:scale-105 mt-1"
                    style={{ background: C.primary }}
                  >
                    <i className="ri-edit-box-line" /> Tự Nhập Lời
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>{/* ── END TOP ROW (sidebar + main) ── */}

      {/* ── THEME CUSTOMIZATION MODAL (KHUNG CHỈNH SỬA GIAO DIỆN Ở GIỮA MÀN HÌNH) ───────────── */}
      {themeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setThemeModal(false); }}>
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
              <div className="flex gap-1 p-1 rounded-2xl overflow-x-auto custom-scrollbar" style={{ background: C.isDark ? 'rgba(15, 23, 42, 0.7)' : C.tag, border: `1px solid ${C.border}` }}>
                {[
                  { key: 'mix', label: '✨ Dynamic', icon: 'ri-sparkles-line' },
                  { key: 'pastel', label: '🌸 Pastel', icon: 'ri-contrast-drop-line' },
                  { key: 'seasonal', label: '🎄 Mùa & Lễ', icon: 'ri-calendar-event-line' },
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

              {/* Dynamic Theme Usage Header Badge */}
              {themeCategory === 'mix' && (
                <div className="p-3 rounded-2xl flex items-center justify-between gap-2 border text-xs font-semibold animate-in fade-in duration-200"
                  style={{ background: C.tag, borderColor: C.border, color: C.txt }}>
                  <div className="flex items-center gap-2">
                    <i className="ri-time-fill text-amber-500 text-sm animate-bounce"></i>
                    <span>Thời gian hoạt động (Online): <strong style={{ color: C.primarySolid }}>{fmtActiveTime(user?.totalActiveTime || 0)}</strong></span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    Đồng bộ BXH Top Hoạt Động! ⚡
                  </span>
                </div>
              )}

              {/* Theme Cards Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {Object.values(THEMES)
                  .filter(t => t.category === themeCategory)
                  .sort((a, b) => {
                    if (themeCategory === 'mix') {
                      const mA = DYNAMIC_UNLOCK_MILESTONES[a.key]?.reqMinutes || 0;
                      const mB = DYNAMIC_UNLOCK_MILESTONES[b.key]?.reqMinutes || 0;
                      return mA - mB;
                    }
                    return 0;
                  })
                  .map(t => {
                    const isSelected = themeKey === t.key;
                    const status = getThemeLockStatus(t, user?.totalActiveTime || 0, isAdmin);
                    return (
                      <div
                        key={t.key}
                        onClick={() => {
                          if (status.isLocked) {
                            if (status.type === 'dynamic') {
                              setLockedThemeNotice(`🔒 Giao diện "${t.name}" cần tích lũy ${status.milestoneLabel} thời gian hoạt động (Online)! Hiện tại thời gian của bạn là ${fmtActiveTime(user?.totalActiveTime || 0)} (${status.remainingText} nữa). Hãy tiếp tục trải nghiệm app để mở khóa! ⚡`);
                            } else {
                              setLockedThemeNotice(`🔒 Giao diện "${t.name}" đang tạm khóa! Tự động mở vào đúng dịp ${status.holidayLabel} (${status.periodText}).`);
                            }
                          } else {
                            setLockedThemeNotice('');
                            setThemeKey(t.key);
                          }
                        }}
                        className={`flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-all border relative overflow-hidden group ${status.isLocked ? 'opacity-65 grayscale-[20%]' : ''}`}
                        style={{
                          background: isSelected ? (t.tag || C.tag) : (C.isDark ? '#0f172a' : '#fff'),
                          borderColor: isSelected ? (t.primarySolid || C.primarySolid) : C.border,
                          boxShadow: isSelected ? `0 4px 16px ${t.primaryGlow || C.primaryGlow}` : 'none'
                        }}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm shrink-0 relative ${t.isAnimated ? 'theme-preview-swatch' : ''}`}
                          style={{ background: t.isAnimated ? t.bg : t.primary, color: '#fff' }}
                        >
                          {t.icon}
                          {status.isLocked && (
                            <div className="absolute -top-1 -right-1 bg-black/80 text-amber-400 rounded-full w-4 h-4 text-[9px] flex items-center justify-center border border-amber-400/50 shadow-xs">
                              🔒
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                          <span className="text-xs font-bold truncate" style={{ color: isSelected ? (t.primarySolid || C.primarySolid) : C.txt }}>
                            {t.name}
                          </span>
                          {status.isLocked ? (
                            status.type === 'dynamic' ? (
                              <span className="text-[9px] font-bold text-amber-500/90 dark:text-amber-400 flex items-center gap-0.5 mt-0.5 truncate">
                                🔒 Mở: {status.milestoneLabel} ({status.remainingText})
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-500/90 dark:text-amber-400 flex items-center gap-0.5 mt-0.5 truncate">
                                🔒 Mở dịp {status.periodText}
                              </span>
                            )
                          ) : t.category === 'seasonal' && !status.isDateActive && isAdmin ? (
                            <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 flex items-center gap-0.5 mt-0.5 truncate">
                              🔑 Admin (Dịp {status.periodText})
                            </span>
                          ) : t.category === 'mix' && status.reqMinutes > 0 && isAdmin && ((user?.totalActiveTime || 0) / 60) < status.reqMinutes ? (
                            <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 flex items-center gap-0.5 mt-0.5 truncate">
                              🔑 Admin (Mốc {status.milestoneLabel})
                            </span>
                          ) : t.isAnimated ? (
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

              {lockedThemeNotice && (
                <div className="p-3 rounded-2xl text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-500 animate-in fade-in duration-200 text-center">
                  {lockedThemeNotice}
                </div>
              )}

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
          onMouseDown={e => { if (e.target === e.currentTarget) { setAddModal(false); setAddErr(''); } }}>
          <div className={`w-full ${addTab === 'search' ? 'max-w-lg' : 'max-w-sm'} rounded-3xl p-6 sm:p-8 shadow-2xl transition-all`}
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
            <div className="flex gap-1.5 mb-5 p-1 rounded-2xl overflow-x-auto" style={{ background: C.tag }}>
              <button
                onClick={() => { setAddTab('search'); setAddErr(''); }}
                className="flex-1 py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all whitespace-nowrap"
                style={addTab === 'search'
                  ? { background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: '#fff', boxShadow: '0 2px 12px rgba(255,65,108,0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-search-eye-line"></i> Tìm Online
              </button>
              <button
                onClick={() => { setAddTab('youtube'); setAddErr(''); }}
                className="flex-1 py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all whitespace-nowrap"
                style={addTab === 'youtube'
                  ? { background: C.primary, color: '#fff', boxShadow: `0 2px 12px ${C.primaryGlow}` }
                  : { color: C.txtSub }}
              >
                <i className="ri-youtube-fill"></i> Link Bài Hát
              </button>
              <button
                onClick={() => { setAddTab('spotify'); setAddErr(''); }}
                className="flex-1 py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all whitespace-nowrap"
                style={addTab === 'spotify'
                  ? { background: '#1DB954', color: '#fff', boxShadow: '0 2px 12px rgba(29,185,84,0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-spotify-fill"></i> Spotify
              </button>
              <button
                onClick={() => { setAddTab('playlist'); setAddErr(''); }}
                className="flex-1 py-2 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all whitespace-nowrap"
                style={addTab === 'playlist'
                  ? { background: '#f59e0b', color: '#fff', boxShadow: '0 2px 12px rgba(245, 158, 11, 0.4)' }
                  : { color: C.txtSub }}
              >
                <i className="ri-play-list-2-fill"></i> Playlist
              </button>
            </div>

            {/* Online Search form */}
            {addTab === 'search' && (
              <div className="flex flex-col gap-4">
                <form onSubmit={(e) => { e.preventDefault(); handleOnlineSearch(); }} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Tìm bài hát, ca sĩ, lời nhạc trên YouTube..."
                      value={onlineSearchQuery}
                      onChange={e => setOnlineSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs font-semibold outline-none transition"
                      style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                      autoFocus
                    />
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.txtFad }}></i>
                    {onlineSearchQuery && (
                      <button type="button" onClick={() => setOnlineSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: C.txtFad }}>
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={onlineSearching}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #ff416c, #ff4b2b)' }}
                  >
                    {onlineSearching ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-search-line"></i>}
                    Tìm
                  </button>
                </form>

                {/* Hot Tag recommendations */}
                <div className="flex flex-wrap gap-1.5">
                  {['Lofi Chill', 'Nhạc Trẻ Hot', 'Remix TikTok', 'Indie Việt'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => { setOnlineSearchQuery(tag); handleOnlineSearch(tag); }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ background: C.tag, border: `1px solid ${C.border}`, color: C.txtSub }}
                    >
                      🔥 {tag}
                    </button>
                  ))}
                </div>

                {onlineSearchErr && <p className="text-xs font-semibold text-red-500">{onlineSearchErr}</p>}

                {/* Search Results List */}
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {onlineSearching ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-xs" style={{ color: C.txtFad }}>
                      <i className="ri-loader-4-line text-lg animate-spin" style={{ color: '#ff416c' }}></i>
                      Đang tìm bài hát trên YouTube...
                    </div>
                  ) : onlineSearchResults.length === 0 ? (
                    <p className="text-xs text-center py-6" style={{ color: C.txtFad }}>Nhập từ khóa và bấm Tìm để tìm nhạc online.</p>
                  ) : (
                    onlineSearchResults.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-xl border transition hover:bg-black/10" style={{ background: C.tag, borderColor: C.border }}>
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img src={item.thumbnail} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{item.title}</span>
                            <span className="text-[10px] truncate" style={{ color: C.txtSub }}>{item.artist} • {item.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center shrink-0 ml-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddOnlineSongToPlaylist(item)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition hover:scale-105 active:scale-95 flex items-center gap-1 text-white shadow-xs"
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                            title="Bấm để chọn nơi lưu bài hát (Thư viện cá nhân hoặc Playlist)"
                          >
                            <i className="ri-add-line"></i> Thêm Vào...
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToQueue(item)}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition hover:scale-105 active:scale-95 flex items-center gap-1 text-white shadow-xs"
                            style={{ background: 'rgba(255,255,255,0.08)', border: `1.5px solid ${C.border}` }}
                            title="Thêm bài hát vào danh sách phát chờ"
                          >
                            <i className="ri-playlist-add-line text-cyan-400"></i> Hàng Chờ
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-end mt-1">
                  <button type="button" onClick={() => { setAddModal(false); setAddErr(''); }} className="px-5 py-2 rounded-xl text-xs font-bold cursor-pointer" style={btn}>
                    Đóng
                  </button>
                </div>
              </div>
            )}

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
        <div className="fixed inset-0 flex items-center justify-center z-[80] p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(16px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget && !isCreatingPlaylist) setPlaylistModal(false); }}>
          <div className="w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 className="flex items-center gap-2 mb-5" style={{ fontFamily: F.heading, fontSize: '20px', fontWeight: 700, color: C.txt }}>
              <i className="ri-play-list-add-fill" style={{ color: C.primarySolid }}></i> Tạo Playlist Mới
            </h3>

            <form onSubmit={handleCreatePlaylist} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Tên danh sách phát</label>
                <input type="text" placeholder="Nhạc chill cuối tuần..." value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition disabled:opacity-50"
                  style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  autoFocus required disabled={isCreatingPlaylist}
                />
              </div>
              <div className="flex gap-3 mt-1">
                <button type="button" disabled={isCreatingPlaylist} onClick={() => setPlaylistModal(false)}
                  className="w-28 shrink-0 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50" style={btn}>
                  Hủy
                </button>
                <button type="submit" disabled={isCreatingPlaylist}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}>
                  {isCreatingPlaylist ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-base"></i>
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    'Tạo mới'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── UNIFIED ADD TO LIBRARY / PLAYLIST MODAL ─────────────────────── */}
      {songToAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] p-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(14px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setSongToAdd(null); }}>
          <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl transition-all"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

            {/* Target Song Info Header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: C.border }}>
              <img src={songToAdd.thumbnail} alt={songToAdd.title} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-md" />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">Thêm bài hát vào...</span>
                <h4 className="text-xs font-bold truncate" style={{ color: C.txt }}>{songToAdd.title}</h4>
                <p className="text-[11px] truncate" style={{ color: C.txtSub }}>{songToAdd.artist}</p>
              </div>
              <button onClick={() => setSongToAdd(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition hover:opacity-70 cursor-pointer" style={{ background: C.tag, color: C.txtFad }}>
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">

              {/* Option 1: Thư viện cá nhân */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-1" style={{ color: C.txtFad }}>1. Thư Viện Cá Nhân</span>
                {(() => {
                  const targetSongId = songToAdd.id || songToAdd._id;
                  const targetYtId = songToAdd.youtubeId;
                  const inLibrary = songs.some(s =>
                    ((targetSongId && (s.id === targetSongId || s._id === targetSongId)) ||
                      (targetYtId && Boolean(s.youtubeId) && s.youtubeId === targetYtId)) &&
                    s.inLibrary !== false
                  );
                  return (
                    <button
                      onClick={() => handleAddOnlineSongToLibrary(songToAdd)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-left"
                      style={{ background: C.tag, border: `1.5px solid ${inLibrary ? '#22c55e' : C.border}` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                          <i className="ri-music-2-fill text-base"></i>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold" style={{ color: inLibrary ? '#22c55e' : C.txt }}>Thư viện của tôi</span>
                          <span className="text-[10px]" style={{ color: C.txtSub }}>{inLibrary ? '✓ Đã có trong thư viện cá nhân' : 'Bấm để lưu vào thư viện cá nhân'}</span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${inLibrary ? 'bg-green-500 text-white' : 'border border-gray-400 text-transparent'}`}>
                        <i className="ri-check-line"></i>
                      </div>
                    </button>
                  );
                })()}
              </div>

              {/* Option 2: Danh sách phát (Playlists) */}
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider" style={{ color: C.txtFad }}>2. Các Danh Sách Phát (Playlists)</span>
                  <button
                    onClick={() => { setPlaylistModal(true); }}
                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <i className="ri-add-circle-line"></i> Tạo Mới
                  </button>
                </div>

                {playlists.length === 0 ? (
                  <p className="text-xs text-center py-3" style={{ color: C.txtSub }}>Bạn chưa có playlist nào. Hãy bấm "Tạo Mới" ở trên!</p>
                ) : playlists.map(p => {
                  const targetSongId = songToAdd.id || songToAdd._id;
                  const targetYtId = songToAdd.youtubeId;
                  const inPlaylist = (p.songs || []).some(sId => {
                    if (targetSongId && sId === targetSongId) return true;
                    const matchedSong = songs.find(s => s.id === sId || s._id === sId);
                    return Boolean(targetYtId) && Boolean(matchedSong?.youtubeId) && matchedSong.youtubeId === targetYtId;
                  });
                  return (
                    <button key={p._id} onClick={() => inPlaylist ? handleRemoveFromPlaylist(p._id, targetSongId) : handleAddToPlaylist(p._id, targetSongId)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-left"
                      style={{ background: C.tag, border: `1.5px solid ${inPlaylist ? C.primarySolid : C.border}` }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs" style={{ background: C.primary }}>
                          <i className="ri-folder-music-fill text-base"></i>
                        </div>
                        <span className="text-xs font-bold truncate" style={{ color: inPlaylist ? C.primarySolid : C.txt }}>{p.name}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${inPlaylist ? 'text-white' : 'border border-gray-400 text-transparent'}`}
                        style={inPlaylist ? { background: C.primarySolid } : {}}>
                        <i className="ri-check-line"></i>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            <button onClick={() => setSongToAdd(null)}
              className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95" style={btn}>
              Xong / Đóng
            </button>
          </div>
        </div>
      )}


      {/* ── BOTTOM PLAYER ─────────────────────── */}
      <footer
        className="w-full max-w-full flex flex-col md:flex-row items-center px-2 md:px-4 lg:px-6 justify-center md:justify-between shrink-0 z-[60] transition-all h-auto md:h-[90px] py-2.5 md:py-0 gap-2.5 md:gap-0 relative"
        style={{
          background: C.surface,
          backdropFilter: 'blur(24px)',
          borderTop: `1.5px solid ${C.border}`,
          boxShadow: '0 -6px 28px rgba(0,0,0,0.06)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)'
        }}>

        {/* Track Info (LEFT) */}
        <div className="flex items-center gap-2 md:gap-3 w-1/4 max-w-[280px] lg:max-w-[320px] shrink-0 overflow-hidden justify-start">
          {track ? (
            <>
              <div className="relative shrink-0">
                <img src={track.thumbnail} alt={track.title}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover"
                  style={{ border: `1px solid ${C.border}`, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                />
                {playing && (
                  <div className="absolute inset-0 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                    <span className="flex gap-[1px] md:gap-0.5 items-end h-3 md:h-4">
                      {['100%', '50%', '75%'].map((h, i) => (
                        <span key={i} className="w-[1.5px] md:w-1 rounded-full animate-pulse text-white"
                          style={{ background: '#fff', height: h, animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1 overflow-hidden justify-center text-left mr-2">
                <div className="flex items-center gap-1.5 min-w-0 w-full">
                  <span className="text-xs md:text-sm font-bold truncate shrink min-w-0 hover:underline cursor-pointer" style={{ color: C.txt }} title={`${track.title} - ${track.artist}`}>
                    {track.title}
                  </span>
                  {buffering && (
                    <span className="shrink-0 px-1.5 py-0.5 text-[8px] font-extrabold rounded-md text-amber-300 bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 animate-pulse whitespace-nowrap">
                      <i className="ri-loader-4-line animate-spin text-[10px]"></i>
                    </span>
                  )}
                  <Tooltip text={track && favs.includes(track.id) ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
                    <button onClick={() => track && toggleFav(track.id)}
                      className="transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 ml-0.5"
                      style={{ color: track && favs.includes(track.id) ? C.primarySolid : C.txtFad }}
                      onMouseEnter={e => e.currentTarget.style.color = track && favs.includes(track.id) ? C.primarySolid : C.txt}
                      onMouseLeave={e => e.currentTarget.style.color = track && favs.includes(track.id) ? C.primarySolid : C.txtFad}
                    >
                      <i className={track && favs.includes(track.id) ? 'ri-heart-fill text-base md:text-lg' : 'ri-heart-line text-base md:text-lg'}></i>
                    </button>
                  </Tooltip>
                </div>
                <span className="text-[10px] md:text-xs truncate block w-full" style={{ color: C.txtSub }}>{track.artist}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center" style={{ background: C.tag }}>
                <i className="ri-music-2-line text-sm md:text-xl" style={{ color: C.txtFad }}></i>
              </div>
              <span className="text-[10px] md:text-xs font-semibold" style={{ color: C.txtFad }}>Chưa chọn bài hát</span>
            </div>
          )}
        </div>

        {/* Center: Controls + Timeline */}
        <div className="flex flex-col items-center gap-2 md:gap-2 w-full md:max-w-2xl flex-1 min-w-0 md:px-4 lg:px-6">
          <div className="flex items-center justify-between md:justify-center gap-4 md:gap-6 w-full px-6 md:px-0 order-2 md:order-1">
            <Tooltip text={isShuffle ? 'Tắt phát ngẫu nhiên' : 'Bật phát ngẫu nhiên'}>
              <button
                onClick={toggleShuffle}
                className="relative p-1 transition cursor-pointer hover:scale-110 active:scale-95"
                style={{ color: isShuffle ? C.primarySolid : C.txtFad }}
                onMouseEnter={e => e.currentTarget.style.color = isShuffle ? C.primarySolid : C.txt}
                onMouseLeave={e => e.currentTarget.style.color = isShuffle ? C.primarySolid : C.txtFad}
              >
                <i className="ri-shuffle-line text-lg md:text-xl"></i>
                {isShuffle && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1 md:h-1 rounded-full"
                    style={{ background: C.primarySolid }}>
                  </span>
                )}
              </button>
            </Tooltip>

            <Tooltip text="Bài phía trước">
              <button onClick={prevTrack} 
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer" 
                style={{ color: C.txtFad }}
                onMouseEnter={e => e.currentTarget.style.color = C.txt}
                onMouseLeave={e => e.currentTarget.style.color = C.txtFad}
              >
                <i className="ri-skip-back-fill text-xl md:text-3xl"></i>
              </button>
            </Tooltip>

            <Tooltip text={buffering ? 'Đang tải dữ liệu...' : playing ? 'Tạm dừng' : 'Bật phát nhạc'}>
              <button onClick={togglePlay}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${getSeasonalPlayBtnClass(themeKey) || 'shadow-md'}`}
                style={getSeasonalPlayBtnClass(themeKey) ? {} : { background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}>
                {buffering ? <i className="ri-loader-4-line text-lg animate-spin" /> : playing ? <PauseIcon className="w-5 h-5 md:w-6 md:h-6" /> : <PlayIcon className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
            </Tooltip>

            <Tooltip text="Bài tiếp theo">
              <button onClick={nextTrack} 
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer" 
                style={{ color: C.txtFad }}
                onMouseEnter={e => e.currentTarget.style.color = C.txt}
                onMouseLeave={e => e.currentTarget.style.color = C.txtFad}
              >
                <i className="ri-skip-forward-fill text-xl md:text-3xl"></i>
              </button>
            </Tooltip>

            <Tooltip text={repeatMode === 'one' ? 'Đang lặp 1 bài' : repeatMode === 'all' ? 'Đang lặp danh sách' : 'Lặp lại danh sách'}>
              <button
                onClick={toggleRepeat}
                className="relative p-1 transition cursor-pointer hover:scale-110 active:scale-95"
                style={{ color: repeatMode !== 'off' ? C.primarySolid : C.txtFad }}
                onMouseEnter={e => e.currentTarget.style.color = repeatMode !== 'off' ? C.primarySolid : C.txt}
                onMouseLeave={e => e.currentTarget.style.color = repeatMode !== 'off' ? C.primarySolid : C.txtFad}
              >
                <i className={repeatMode === 'one' ? 'ri-repeat-2-line text-lg md:text-xl font-bold' : 'ri-repeat-line text-lg md:text-xl'}></i>
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-[8px] md:text-[9px] font-black rounded-full w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center text-white shadow-xs"
                    style={{ background: C.primarySolid }}>
                    1
                  </span>
                )}
                {repeatMode === 'all' && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1 md:h-1 rounded-full"
                    style={{ background: C.primarySolid }}>
                  </span>
                )}
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full order-1 md:order-2 px-2 md:px-0">
            <span className="text-[10px] md:text-[11px] font-medium w-8 md:w-9 text-right shrink-0" style={{ color: C.txtSub }}>{fmt(curTime)}</span>
            <input type="range" min="0" max={dur || 100} value={curTime} onChange={seek}
              className={`flex-1 cursor-pointer h-1 md:h-1.5 rounded-full ${themeKey === 'summer_season' ? 'sun-theme-slider' : ''}`}
              style={{
                background: themeKey === 'summer_season'
                  ? `linear-gradient(90deg, #ff7e5f 0%, #f59e0b ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(245, 158, 11, 0.25) ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(245, 158, 11, 0.25) 100%)`
                  : `linear-gradient(90deg, ${C.primarySolid} 0%, ${C.primarySolid} ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, ${C.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'} ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, ${C.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'} 100%)`,
                accentColor: C.primarySolid,
                '--accent-color': C.primarySolid,
                '--accent-glow': C.primaryGlow
              }} />
            <span className="text-[10px] md:text-[11px] font-medium w-8 md:w-9 shrink-0" style={{ color: C.txtSub }}>{fmt(dur)}</span>
          </div>
        </div>

        {/* Right Controls: Extra + Volume + PIP */}
        <div className="hidden md:flex items-center justify-end gap-1.5 lg:gap-2.5 w-1/4 max-w-[280px] lg:max-w-[320px] shrink-0 min-w-0">
          <Tooltip text={sleepTimer ? `Hẹn giờ: ${sleepTimer} phút` : 'Hẹn giờ tắt nhạc'}>
            <button onClick={cycleSleepTimer}
              className="relative p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
              style={{ color: sleepTimer > 0 ? C.primarySolid : C.txtFad }}
              onMouseEnter={e => e.currentTarget.style.color = sleepTimer > 0 ? C.primarySolid : C.txt}
              onMouseLeave={e => e.currentTarget.style.color = sleepTimer > 0 ? C.primarySolid : C.txtFad}
            >
              <i className={sleepTimer > 0 ? 'ri-timer-fill text-lg md:text-xl' : 'ri-timer-line text-lg md:text-xl'}></i>
              {sleepTimer > 0 && (
                <span className="absolute -top-1 -right-2 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white shadow-xs"
                  style={{ background: C.primarySolid }}>
                  {sleepTimer}
                </span>
              )}
            </button>
          </Tooltip>

          <Tooltip text={lyricsModal ? "Đóng lời bài hát (Karaoke 🎤)" : "Lời bài hát (Karaoke 🎤)"}>
            <button onClick={() => setLyricsModal(prev => !prev)}
              className="relative p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
              style={{ color: lyricsModal ? C.primarySolid : C.txtFad }}
              onMouseEnter={e => e.currentTarget.style.color = lyricsModal ? C.primarySolid : C.txt}
              onMouseLeave={e => e.currentTarget.style.color = lyricsModal ? C.primarySolid : C.txtFad}
            >
              <i className={lyricsModal ? "ri-mic-fill text-lg md:text-xl" : "ri-mic-line text-lg md:text-xl"}></i>
            </button>
          </Tooltip>

          {/* Volume control */}
          <div className="flex items-center gap-1.5 ml-1 lg:ml-2 w-20 sm:w-24 lg:w-28 xl:w-32 min-w-[70px] shrink-0">
            <Tooltip text={muted || vol === 0 ? 'Bật lại âm thanh' : 'Tắt tiếng'}>
              <button onClick={toggleMute}
                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                style={{ color: muted || vol === 0 ? '#f43f5e' : C.txtFad }}
                onMouseEnter={e => e.currentTarget.style.color = muted || vol === 0 ? '#f43f5e' : C.txt}
                onMouseLeave={e => e.currentTarget.style.color = muted || vol === 0 ? '#f43f5e' : C.txtFad}
              >
                <i className={`text-lg md:text-xl ${muted || vol === 0 ? 'ri-volume-mute-fill' : vol < 50 ? 'ri-volume-down-fill' : 'ri-volume-up-fill'}`}></i>
              </button>
            </Tooltip>
            <input type="range" min="0" max="100" value={muted ? 0 : vol} onChange={changeVol}
              className={`flex-1 min-w-0 cursor-pointer h-1 md:h-1.5 rounded-full ${themeKey === 'summer_season' ? 'sun-theme-slider' : ''}`}
              style={{
                background: themeKey === 'summer_season'
                  ? `linear-gradient(90deg, #ff7e5f 0%, #f59e0b ${muted ? 0 : vol}%, rgba(245, 158, 11, 0.25) ${muted ? 0 : vol}%, rgba(245, 158, 11, 0.25) 100%)`
                  : `linear-gradient(90deg, ${C.primarySolid} 0%, ${C.primarySolid} ${muted ? 0 : vol}%, ${C.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'} ${muted ? 0 : vol}%, ${C.isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'} 100%)`,
                accentColor: C.primarySolid,
                '--accent-color': C.primarySolid,
                '--accent-glow': C.primaryGlow
              }} />
          </div>

          {/* Mini player (PIP) window button moved to the RIGHT side of the volume bar */}
          <Tooltip text={pipWindow ? "Đóng cửa sổ thu nhỏ" : "Mở cửa sổ con nổi (Mini Player)"}>
            <button
              onClick={togglePipWindow}
              className="relative p-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 ml-1"
              style={{ color: pipWindow ? C.primarySolid : C.txtFad }}
              onMouseEnter={e => e.currentTarget.style.color = pipWindow ? C.primarySolid : C.txt}
              onMouseLeave={e => e.currentTarget.style.color = pipWindow ? C.primarySolid : C.txtFad}
            >
              <i className={pipWindow ? "ri-picture-in-picture-2-fill text-lg md:text-xl" : "ri-picture-in-picture-2-line text-lg md:text-xl"}></i>
              {pipWindow && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1 md:h-1 rounded-full"
                  style={{ background: C.primarySolid }}>
                </span>
              )}
            </button>
          </Tooltip>
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
          onMouseDown={e => { if (e.target === e.currentTarget) setEditPlaylistModal(null); }}>
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
          onMouseDown={e => { if (e.target === e.currentTarget && !adminSaving) setAdminUserModal(null); }}>
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
                <label className="block text-xs font-bold mb-1.5" style={{ color: C.txtSub }}>Ảnh Đại Diện (Từ máy tính)</label>
                <div className="flex gap-3 items-center">
                  <img src={adminAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} alt="Preview" className="w-11 h-11 rounded-xl object-cover shadow-xs" style={{ border: `1.5px solid ${C.border}` }} />
                  <button
                    type="button"
                    onClick={() => adminFormAvatarInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 active:scale-95"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  >
                    <i className="ri-folder-image-line text-sm" style={{ color: C.primarySolid }}></i>
                    <span>Chọn Ảnh</span>
                  </button>
                  <input
                    type="file"
                    ref={adminFormAvatarInputRef}
                    onChange={handleFormAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
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
          onMouseDown={e => { if (e.target === e.currentTarget) setConfirmModal(null); }}
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

      {/* ── USER PROFILE MODAL (Matching Reference Screenshot & Theme Colors) ────────────────── */}
      {viewUserProfileModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[160] p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(16px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setViewUserProfileModal(null); }}
        >
          <div
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200 border"
            style={{
              background: C.surface,
              borderColor: C.border,
              color: C.txt,
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
            }}
          >
            {/* Modal Title Bar */}
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: C.border }}>
              <h3 className="text-base font-extrabold flex items-center gap-2" style={{ fontFamily: F.heading, color: C.txt }}>
                Hồ Sơ Người Dùng
              </h3>
              <button
                onClick={() => setViewUserProfileModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-80 active:scale-95 border"
                style={{ background: C.tag, color: C.txtFad, borderColor: C.border }}
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* User Avatar & Online Status Info */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={viewUserProfileModal.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={viewUserProfileModal.user?.name || 'User'}
                  className="w-16 h-16 rounded-full object-cover shadow-md border-2"
                  style={{ borderColor: C.borderSel || C.border }}
                />
                <span
                  className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2"
                  style={{
                    borderColor: C.surface,
                    background: (user && viewUserProfileModal.user?._id === user._id) || viewUserProfileModal.user?.isOnline ? '#22c55e' : '#6b7280',
                    boxShadow: ((user && viewUserProfileModal.user?._id === user._id) || viewUserProfileModal.user?.isOnline) ? '0 0 8px #22c55e' : 'none'
                  }}
                />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h4 className="text-lg font-extrabold truncate" style={{ color: C.txt, fontFamily: F.heading }}>
                  {viewUserProfileModal.user?.name || 'Thành viên'}
                </h4>
                
            {/* Action Buttons: Kết bạn, Nhắn tin, Mời nghe nhạc chung */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSendFriendRequest(viewUserProfileModal.user, 'request')}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border hover:opacity-90 active:scale-95"
                  style={{ background: C.tag, color: C.txt, borderColor: C.border }}
                >
                  <i className="ri-user-add-line text-sm" style={{ color: C.primarySolid }} />
                  <span>Kết Bạn</span>
                </button>

                <button
                  onClick={() => {
                    const targetU = viewUserProfileModal.user;
                    setViewUserProfileModal(null);
                    setChatModal({ open: true, activeUser: targetU, tab: 'chat' });
                  }}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition hover:scale-[1.02] active:scale-95"
                  style={{ background: C.primary, boxShadow: `0 6px 18px ${C.primaryGlow}` }}
                >
                  <i className="ri-message-3-fill text-sm" />
                  <span>Nhắn Tin</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const targetU = viewUserProfileModal.user;
                  setViewUserProfileModal(null);
                  handleInviteListenParty(targetU);
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95 border"
                style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.2))', color: '#10b981', borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <i className="ri-headphone-fill text-sm animate-bounce" />
                <span>Mời Nghe Nhạc Cùng Nhau 🎧</span>
              </button>
            </div>
                
                <p className="text-xs truncate font-medium flex items-center gap-1 mt-0.5" style={{ color: C.txtSub }}>
                  <i className="ri-music-2-fill text-xs" style={{ color: C.primarySolid }} />
                  {viewUserProfileModal.user?.bio || 'Nghe nhạc mọi lúc mọi nơi'}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-extrabold">
                  <span className="w-2 h-2 rounded-full" style={{ background: ((user && viewUserProfileModal.user?._id === user._id) || viewUserProfileModal.user?.isOnline) ? '#22c55e' : '#6b7280' }} />
                  <span style={{ color: ((user && viewUserProfileModal.user?._id === user._id) || viewUserProfileModal.user?.isOnline) ? '#22c55e' : '#6b7280' }}>
                    {((user && viewUserProfileModal.user?._id === user._id) || viewUserProfileModal.user?.isOnline) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2 Stat Cards (Time Listened & Leaderboard Rank) */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4 rounded-2xl flex flex-col items-center justify-center text-center border"
                style={{ background: C.tag, borderColor: C.border }}
              >
                <span className="text-lg md:text-xl font-extrabold" style={{ color: C.txt, fontFamily: F.heading }}>
                  {fmtActiveTime(viewUserProfileModal.user?.totalActiveTime || 0)}
                </span>
                <span className="text-[11px] font-semibold mt-1" style={{ color: C.txtSub }}>
                  Thời gian nghe
                </span>
              </div>

              <div
                className="p-4 rounded-2xl flex flex-col items-center justify-center text-center border"
                style={{ background: C.tag, borderColor: C.border }}
              >
                <span className="text-lg md:text-xl font-extrabold" style={{ color: C.txt, fontFamily: F.heading }}>
                  #{viewUserProfileModal.rank || 1}
                </span>
                <span className="text-[11px] font-semibold mt-1" style={{ color: C.txtSub }}>
                  Xếp hạng
                </span>
              </div>
            </div>

            {/* Currently Playing Track Banner */}
            <div
              className="p-3.5 rounded-2xl border flex items-center gap-3 transition"
              style={{
                background: `${C.primarySolid}14`,
                borderColor: `${C.primarySolid}35`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs text-white"
                style={{ background: C.primary }}
              >
                <i className="ri-headphones-fill" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: C.primarySolid }}>
                  Đang nghe
                </span>
                <span className="text-xs font-bold truncate" style={{ color: C.txt }}>
                  {track ? `${getCleanSongTitle(track)} – ${track.artist || 'MCK'}` : 'Anh Biết – MCK'}
                </span>
              </div>
            </div>

            {/* Top Most Listened Songs Section */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-1" style={{ color: C.txtFad }}>
                Bài hát nghe nhiều nhất
              </span>

              <div className="flex flex-col gap-2">
                {(() => {
                  const topList = (songs && songs.length > 0) ? songs.slice(0, 3) : [
                    { title: 'Anh Biết', artist: 'MCK' },
                    { title: 'Chúng Ta Của Hiện Tại', artist: 'Sơn Tùng M-TP' },
                    { title: 'Có Chắc Yêu Là Đây', artist: 'Sơn Tùng M-TP' }
                  ];

                  return topList.map((songItem, sIdx) => {
                    const titleStr = typeof songItem === 'string' ? songItem : `${getCleanSongTitle(songItem)} – ${songItem.artist || ''}`;
                    return (
                      <div
                        key={sIdx}
                        className="flex items-center gap-3 p-2.5 rounded-2xl border transition hover:opacity-90"
                        style={{ background: C.tag, borderColor: C.border }}
                      >
                        <span className="text-xs font-black px-1.5" style={{ color: C.primarySolid }}>
                          #{sIdx + 1}
                        </span>
                        <i className="ri-music-2-line text-xs" style={{ color: C.txtFad }} />
                        <span className="text-xs font-bold truncate flex-1" style={{ color: C.txt }}>
                          {titleStr}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Action Button: Nhắn tin */}
            <button
              onClick={() => showToast(`💬 Đã mở khung nhắn tin với ${viewUserProfileModal.user?.name || 'thành viên'}!`, 'info', 'Nhắn tin')}
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95 hover:scale-[1.01]"
              style={{
                background: C.primary,
                boxShadow: `0 6px 20px ${C.primaryGlow}`
              }}
            >
              <i className="ri-message-3-fill text-base" />
              <span>Nhắn tin</span>
            </button>

          </div>
        </div>
      )}

      {/* ── BATCH DELETE CONFIRMATION MODAL ───────────────────────── */}
      {confirmBatchDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[70] p-4"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(14px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setConfirmBatchDeleteModal(false); }}>
          <div className="w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            style={{ background: C.isDark ? '#1e293b' : '#fffcf9', border: `1.5px solid ${C.border}`, color: C.txt }}>

            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-red-500/15 text-red-500 text-2xl shadow-sm">
              <i className="ri-delete-bin-fill"></i>
            </div>

            <h3 className="text-lg font-bold text-center mb-1" style={{ color: C.txt }}>
              Xóa Hàng Loạt ({selectedSongIds.length} bài hát)
            </h3>
            <p className="text-xs text-center mb-5" style={{ color: C.txtSub }}>
              {activePlaylist ? `Bạn có chắc chắn muốn xóa ${selectedSongIds.length} bài hát đã chọn khỏi Playlist "${activePlaylist.name}"?` : `Bạn có chắc chắn muốn xóa ${selectedSongIds.length} bài hát đã chọn khỏi thư viện nhạc?`}
            </p>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmBatchDeleteModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition hover:opacity-80"
                style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white cursor-pointer transition hover:scale-105 active:scale-95 shadow-md"
                style={{ background: '#ef4444', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)' }}
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ── REAL-TIME CHAT & LISTEN TOGETHER MODAL ───────────────────────── */}
      {chatModal.open && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[170] p-4"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(16px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setChatModal(prev => ({ ...prev, open: false })); }}
        >
          <div
            className="w-full max-w-2xl h-[85vh] max-h-[680px] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 border"
            style={{
              background: C.surface,
              borderColor: C.border,
              color: C.txt,
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b shrink-0" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg text-white shadow-sm" style={{ background: C.primary }}>
                  <i className="ri-message-3-fill" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold flex items-center gap-2" style={{ fontFamily: F.heading, color: C.txt }}>
                    {chatModal.activeUser ? `Chat với ${chatModal.activeUser.name}` : 'Trò Chuyện & Nghe Nhạc Cùng Nhau'}
                  </h3>
                  <p className="text-xs" style={{ color: C.txtSub }}>
                    {chatModal.activeUser ? (chatModal.activeUser.isOnline ? '🟢 Đang Online' : '⚪ Khởi tạo nhắn tin 1-1') : 'Kết nối thành viên, nhắn tin & chia sẻ âm nhạc'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setChatModal(prev => ({ ...prev, open: false }))}
                className="w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer hover:opacity-80 border"
                style={{ background: C.tag, color: C.txtFad, borderColor: C.border }}
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="flex gap-2 p-1 rounded-2xl shrink-0 border" style={{ background: C.tag, borderColor: C.border }}>
              <button
                onClick={() => setChatModal(prev => ({ ...prev, tab: 'chat' }))}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                style={{
                  background: chatModal.tab === 'chat' ? C.primary : 'transparent',
                  color: chatModal.tab === 'chat' ? '#fff' : C.txtSub,
                  boxShadow: chatModal.tab === 'chat' ? `0 4px 12px ${C.primaryGlow}` : 'none'
                }}
              >
                <i className="ri-chat-3-line text-sm" />
                <span>{chatModal.activeUser ? `Chat riêng (${chatModal.activeUser.name})` : 'Khung Chat Nhóm / 1-1'}</span>
              </button>

              <button
                onClick={() => setChatModal(prev => ({ ...prev, tab: 'friends' }))}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                style={{
                  background: chatModal.tab === 'friends' ? C.primary : 'transparent',
                  color: chatModal.tab === 'friends' ? '#fff' : C.txtSub,
                  boxShadow: chatModal.tab === 'friends' ? `0 4px 12px ${C.primaryGlow}` : 'none'
                }}
              >
                <i className="ri-user-heart-line text-sm" />
                <span>Bạn Bè ({friendsList.length})</span>
              </button>

              <button
                onClick={() => {
                  setChatModal(prev => ({ ...prev, tab: 'listen_party' }));
                  handleSyncListenParty('create');
                }}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                style={{
                  background: chatModal.tab === 'listen_party' ? '#10b981' : 'transparent',
                  color: chatModal.tab === 'listen_party' ? '#fff' : C.txtSub,
                  boxShadow: chatModal.tab === 'listen_party' ? '0 4px 12px rgba(16,185,129,0.4)' : 'none'
                }}
              >
                <i className="ri-headphone-fill text-sm animate-bounce" />
                <span>Nghe Nhạc Cùng Nhau 🎧</span>
              </button>
            </div>

            {/* TAB 1: Chat Messages */}
            {chatModal.tab === 'chat' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Active user header indicator if set */}
                {chatModal.activeUser && (
                  <div className="flex items-center justify-between p-2.5 px-3 mb-2 rounded-xl border text-xs" style={{ background: C.tag, borderColor: C.border }}>
                    <div className="flex items-center gap-2">
                      <img src={chatModal.activeUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold" style={{ color: C.txt }}>Đang chat riêng với {chatModal.activeUser.name}</span>
                    </div>
                    <button
                      onClick={() => setChatModal(prev => ({ ...prev, activeUser: null }))}
                      className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer"
                    >
                      ← Đổi sang Chat Công Khai
                    </button>
                  </div>
                )}

                {/* Message Scroll Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3 rounded-2xl border mb-3" style={{ background: C.isDark ? 'rgba(15,23,42,0.4)' : '#f9fafb', borderColor: C.border }}>
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 py-12 text-center" style={{ color: C.txtFad }}>
                      <i className="ri-chat-smile-2-line text-3xl" style={{ color: C.primarySolid }} />
                      <p className="text-xs font-bold">Chưa có tin nhắn nào trong cuộc trò chuyện</p>
                      <p className="text-[11px]">Hãy nhập lời chào hoặc chia sẻ bài hát đang nghe bên dưới!</p>
                    </div>
                  ) : chatMessages.map((msg, mIdx) => {
                    const isSelf = msg.senderId === (user?._id || user?.id) || (user?.email && msg.senderId === user.email);
                    return (
                      <div key={msg._id || mIdx} className={`flex gap-2.5 items-end ${isSelf ? 'flex-row-reverse' : ''}`}>
                        <img src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" />
                        <div className={`flex flex-col max-w-[75%] ${isSelf ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] font-bold px-1 mb-0.5" style={{ color: C.txtFad }}>{msg.senderName || 'Thành viên'}</span>

                          {/* Text Message Bubble */}
                          {msg.text && (
                            <div
                              className="p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-xs"
                              style={{
                                background: isSelf ? C.primary : C.tag,
                                color: isSelf ? '#fff' : C.txt,
                                border: `1px solid ${isSelf ? 'transparent' : C.border}`,
                                borderRadius: isSelf ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                              }}
                            >
                              {msg.text}
                            </div>
                          )}

                          {/* Messenger Style Delivery Status */}
                          {isSelf && (
                            <span className="text-[9px] font-bold opacity-75 mt-0.5 px-1" style={{ color: C.txtFad }}>
                              {msg.status === 'sending' ? (
                                <span className="flex items-center gap-1 text-amber-500">
                                  <i className="ri-loader-4-line animate-spin text-[9px]" /> Đang gửi...
                                </span>
                              ) : (
                                <span>Đã gửi</span>
                              )}
                            </span>
                          )}

                          {/* Shared Song Card Bubble */}
                          {msg.sharedSong && (
                            <div
                              className="mt-1 p-3 rounded-2xl border shadow-sm flex items-center gap-3 w-64 transition hover:scale-[1.01]"
                              style={{ background: C.surface, borderColor: C.primarySolid }}
                            >
                              <img src={msg.sharedSong.thumbnail || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80"} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[9px] font-black uppercase text-emerald-500">🎵 Bài hát được chia sẻ</span>
                                <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{msg.sharedSong.title}</span>
                                <span className="text-[11px] truncate" style={{ color: C.txtSub }}>{msg.sharedSong.artist}</span>
                              </div>
                              <button
                                onClick={() => play(msg.sharedSong)}
                                className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer transition hover:scale-110 active:scale-95"
                                style={{ background: C.primary }}
                                title="Bấm để phát bài hát này"
                              >
                                <i className="ri-play-fill text-base ml-0.5" />
                              </button>
                            </div>
                          )}

                          {/* Interactive Listen Together Room Invitation Card Bubble */}
                          {msg.listenInvite && (
                            <div
                              className="mt-1 p-3.5 rounded-3xl border shadow-md flex flex-col gap-2.5 w-72 transition hover:scale-[1.01]"
                              style={{
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)',
                                borderColor: '#10b981'
                              }}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-base shadow-sm shrink-0" style={{ background: '#10b981' }}>
                                  <i className="ri-headphone-fill animate-bounce" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">🎧 Lời Mời Nghe Nhạc Cùng Nhau</span>
                                  <span className="text-xs font-extrabold truncate" style={{ color: C.txt }}>
                                    Phòng của {msg.listenInvite.hostName}
                                  </span>
                                </div>
                              </div>

                              <p className="text-[11px] leading-relaxed font-medium" style={{ color: C.txtSub }}>
                                {isSelf ? 'Bạn đã gửi lời mời tham gia phòng nghe nhạc đồng bộ.' : `${msg.senderName || 'Bạn bè'} muốn mời bạn cùng nghe nhạc trực tuyến thời gian thực!`}
                              </p>

                              {!isSelf ? (
                                <div className="flex items-center gap-2 pt-1 border-t border-emerald-500/20">
                                  <button
                                    onClick={() => {
                                      handleSyncListenParty('join', null, msg.listenInvite.roomId, {
                                        hostId: msg.listenInvite.hostId,
                                        hostName: msg.listenInvite.hostName
                                      });
                                      setChatModal(prev => ({ ...prev, tab: 'listen_party' }));
                                      showToast(`Đã tham gia phòng nghe nhạc của ${msg.listenInvite.hostName}! 🎧`, 'success', 'Nghe Chung');
                                    }}
                                    className="flex-1 py-1.5 px-3 rounded-xl text-xs font-extrabold text-white shadow-md flex items-center justify-center gap-1 cursor-pointer transition hover:scale-105 active:scale-95"
                                    style={{ background: '#10b981' }}
                                  >
                                    <i className="ri-check-line text-sm" /> Chấp Nhận
                                  </button>
                                  <button
                                    onClick={() => showToast('Đã từ chối lời mời nghe nhạc', 'info')}
                                    className="py-1.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition hover:opacity-80 border"
                                    style={{ background: C.surface, color: C.txtSub, borderColor: C.border }}
                                  >
                                    Từ chối
                                  </button>
                                </div>
                              ) : (
                                <div className="pt-1 border-t border-emerald-500/20">
                                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                    <i className="ri-time-line" /> Đã gửi • Đang chờ đối phương chấp nhận...
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input & Action Bar */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage(chatInputText);
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  {track && (
                    <button
                      type="button"
                      onClick={() => handleSendMessage('', track)}
                      className="px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition hover:scale-105 active:scale-95 shrink-0 border"
                      style={{ background: C.tag, color: C.primarySolid, borderColor: C.border }}
                      title="Gửi thẻ bài hát đang nghe vào khung chat"
                    >
                      <i className="ri-music-2-fill text-sm" />
                      <span className="hidden sm:inline">Gửi Bài Đang Nghe</span>
                    </button>
                  )}

                  <input
                    type="text"
                    placeholder={chatModal.activeUser ? `Nhập tin nhắn cho ${chatModal.activeUser.name}...` : 'Nhập tin nhắn trò chuyện công khai...'}
                    value={chatInputText}
                    onChange={e => setChatInputText(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl text-xs font-semibold outline-none transition"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  />

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-2xl text-xs font-extrabold text-white flex items-center gap-1.5 shadow-md cursor-pointer transition hover:scale-105 active:scale-95 shrink-0"
                    style={{ background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
                  >
                    <span>Gửi</span>
                    <i className="ri-send-plane-fill text-xs" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: Friends List & Active Search */}
            {chatModal.tab === 'friends' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 p-1">
                {/* Search Bar to actively search & add new friends */}
                <div className="relative shrink-0">
                  <i className="ri-search-line absolute left-3.5 top-3 text-xs" style={{ color: C.primarySolid }} />
                  <input
                    type="text"
                    placeholder="🔍 Tìm bạn bè / thành viên theo Tên hoặc Email..."
                    value={searchUserQuery}
                    onChange={e => handleSearchUsers(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs font-semibold outline-none transition"
                    style={{ background: C.tag, border: `1.5px solid ${C.border}`, color: C.txt }}
                  />
                  {searchUserLoading && (
                    <i className="ri-loader-4-line absolute right-3.5 top-3 text-xs animate-spin" style={{ color: C.primarySolid }} />
                  )}
                </div>

                {/* Search Results if user is searching */}
                {searchUserQuery.trim() ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-1 text-emerald-500">
                      Kết quả tìm kiếm ({searchUserResults.length})
                    </span>

                    {searchUserResults.length === 0 && !searchUserLoading ? (
                      <p className="text-xs text-center py-4" style={{ color: C.txtFad }}>Không tìm thấy thành viên phù hợp</p>
                    ) : searchUserResults.map((sUser, sIdx) => {
                      const isFriend = friendsList.some(f => (f._id || f.id) === (sUser._id || sUser.id));
                      return (
                        <div
                          key={sUser._id || sIdx}
                          className="flex items-center justify-between p-3 rounded-2xl border transition hover:opacity-95"
                          style={{ background: C.surface, borderColor: C.border }}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img src={sUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-10 h-10 rounded-full object-cover" />
                              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white" style={{ background: sUser.isOnline ? '#22c55e' : '#6b7280' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{sUser.name}</span>
                              <span className="text-[11px] truncate font-medium" style={{ color: C.txtSub }}>{sUser.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleSendFriendRequest(sUser, 'request')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:scale-105 border"
                              style={{ background: isFriend ? C.tag : C.primary, color: isFriend ? C.txt : '#fff', borderColor: C.border }}
                            >
                              <i className={isFriend ? "ri-user-check-line" : "ri-user-add-line"} />
                              <span>{isFriend ? '✓ Bạn bè' : '+ Kết bạn'}</span>
                            </button>
                            <button
                              onClick={() => setChatModal({ open: true, activeUser: sUser, tab: 'chat' })}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:scale-105 border"
                              style={{ background: C.tag, color: C.txt, borderColor: C.border }}
                            >
                              <i className="ri-message-3-line" /> Chat
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Accepted Friends List Header */}
                <span className="text-[10px] font-black uppercase tracking-wider px-1" style={{ color: C.txtFad }}>
                  Danh sách Bạn bè của bạn ({friendsList.length})
                </span>

                {friendsList.length === 0 ? (
                  <div className="py-8 text-center text-xs flex flex-col items-center justify-center gap-2" style={{ color: C.txtSub }}>
                    <i className="ri-user-heart-line text-3xl" style={{ color: C.primarySolid }} />
                    <p className="font-bold text-sm">Chưa có bạn bè trong danh sách</p>
                    <p className="text-[11px] max-w-xs">Nhập tên/email ở ô tìm kiếm bên trên hoặc chọn ở Bảng Xếp Hạng để chủ động gửi lời mời kết bạn!</p>
                  </div>
                ) : friendsList.map((fItem, fIdx) => {
                  const lastMsg = fItem.lastMessage;
                  const isSelfLast = lastMsg && (lastMsg.senderId === (user?._id || user?.id) || lastMsg.senderId === user?.email);
                  const isUnread = lastMsg && !isSelfLast && !readConversationMsgIds.includes(lastMsg.id);

                  let lastMsgPreview = 'Chưa có tin nhắn';
                  if (lastMsg) {
                    const content = lastMsg.text || '🎵 Đã chia sẻ 1 bài hát';
                    lastMsgPreview = isSelfLast ? `Bạn: ${content}` : content;
                  }

                  return (
                    <div
                      key={fItem._id || fIdx}
                      onClick={() => {
                        if (lastMsg?.id && !readConversationMsgIds.includes(lastMsg.id)) {
                          markConversationRead(lastMsg.id);
                        }
                        setChatModal({ open: true, activeUser: fItem, tab: 'chat' });
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition hover:opacity-95 cursor-pointer ${isUnread ? 'bg-amber-500/10' : ''}`}
                      style={{ background: isUnread ? (C.isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb') : C.tag, borderColor: isUnread ? C.primarySolid : C.border }}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                        <div className="relative shrink-0">
                          <img src={fItem.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} className="w-11 h-11 rounded-2xl object-cover shadow-sm" />
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 shadow-xs"
                            style={{ background: fItem.isOnline ? '#22c55e' : '#6b7280', borderColor: C.isDark ? '#0f172a' : '#ffffff' }}
                            title={fItem.isOnline ? 'Đang Online' : 'Ngoại tuyến'}
                          />
                          {isUnread && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-bounce" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1 justify-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold truncate ${isUnread ? 'text-amber-500' : ''}`} style={{ color: isUnread ? undefined : C.txt }}>
                              {fItem.name}
                            </span>
                            <span
                              className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-1"
                              style={{
                                background: fItem.isOnline ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)',
                                color: fItem.isOnline ? '#22c55e' : '#9ca3af'
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: fItem.isOnline ? '#22c55e' : '#9ca3af' }} />
                              {fItem.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>

                          <p className={`text-[11px] truncate mt-0.5 ${isUnread ? 'font-black text-emerald-400' : 'font-medium'}`} style={{ color: isUnread ? undefined : C.txtSub }}>
                            {isUnread ? `🔴 ${lastMsgPreview}` : lastMsgPreview}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (lastMsg?.id) markConversationRead(lastMsg.id);
                            setChatModal({ open: true, activeUser: fItem, tab: 'chat' });
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:scale-105 border"
                          style={{ background: isUnread ? C.primary : C.surface, color: isUnread ? '#fff' : C.txt, borderColor: C.border }}
                        >
                          <i className="ri-message-3-line" /> {isUnread ? 'Chat ngay' : 'Chat'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInviteListenParty(fItem);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer hover:scale-105 shadow-sm"
                          style={{ background: '#10b981' }}
                        >
                          <i className="ri-headphone-fill text-xs" /> Mời nghe chung
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: Listen Together (Phòng Nghe Nhạc Cùng Nhau) */}
            {chatModal.tab === 'listen_party' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 p-2">
                {!listenPartyRoom ? (
                  <div className="p-8 rounded-3xl border text-center flex flex-col items-center justify-center gap-4 my-auto" style={{ background: C.tag, borderColor: C.border }}>
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl text-white shadow-lg" style={{ background: '#10b981' }}>
                      <i className="ri-headphone-fill animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center max-w-sm gap-1">
                      <h4 className="text-base font-extrabold" style={{ color: C.txt }}>Bạn Chưa Tham Gia Phòng Nghe Nào</h4>
                      <p className="text-xs text-center leading-relaxed" style={{ color: C.txtSub }}>
                        Nhận lời mời từ bạn bè trong khung Chat/Thông báo để gia nhập phòng, hoặc tự tạo phòng của riêng mình bên dưới để mời bạn bè cùng nghe nhạc!
                      </p>
                    </div>
                    <button
                      onClick={() => handleSyncListenParty('create')}
                      className="px-5 py-3 rounded-2xl text-xs font-extrabold text-white shadow-md flex items-center gap-2 cursor-pointer transition hover:scale-105 active:scale-95"
                      style={{ background: '#10b981', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
                    >
                      <i className="ri-add-circle-fill text-base" />
                      <span>➕ Tạo Phòng Mới Của Bạn</span>
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Room Info Banner */}
                    <div
                      className="p-5 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)', borderColor: 'rgba(16,185,129,0.3)' }}
                    >
                      <div className="flex items-center gap-4 z-10 min-w-0">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shrink-0" style={{ background: '#10b981' }}>
                          <i className="ri-headphone-fill animate-bounce" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500">🎧 Phòng Nghe Nhạc Cùng Nhau</span>
                          <h4 className="text-base font-extrabold truncate" style={{ color: C.txt, fontFamily: F.heading }}>
                            Phòng của Host {listenPartyRoom.hostName}
                          </h4>
                          <p className="text-xs" style={{ color: C.txtSub }}>
                            {listenPartyRoom?.members ? `${listenPartyRoom.members.length} người đang cùng nghe` : 'Sẵn sàng đồng bộ bài hát'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 z-10 shrink-0">
                        <button
                          onClick={handleLeaveListenParty}
                          className="px-4 py-2.5 rounded-2xl text-xs font-extrabold text-white shadow-md flex items-center gap-1.5 cursor-pointer transition hover:scale-105 active:scale-95 bg-red-500"
                        >
                          <i className="ri-logout-box-r-line text-sm" />
                          <span>Rời Phòng Nghe Chung</span>
                        </button>
                      </div>
                    </div>

                    {/* Host Control Actions & Status */}
                    <div className="p-4 rounded-2xl border flex flex-col gap-3" style={{ background: C.tag, borderColor: C.border }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold flex items-center gap-1.5" style={{ color: C.txt }}>
                          <i className="ri-equalizer-line text-emerald-500" /> Bàn Điều Khiển Phát Nhạc Đồng Bộ
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {isListenPartyHost ? '👑 Bạn là Host điều khiển' : '🔒 Đang phát theo Host'}
                        </span>
                      </div>

                      {track ? (
                        <div className="flex items-center justify-between p-3 rounded-xl border bg-white/5" style={{ borderColor: C.border }}>
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={track.thumbnail} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold truncate" style={{ color: C.txt }}>{getCleanSongTitle(track)}</span>
                              <span className="text-[11px] truncate" style={{ color: C.txtSub }}>{track.artist || 'Artist'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isListenPartyHost ? (
                              <button
                                onClick={() => {
                                  togglePlay();
                                  handleSyncListenParty('sync');
                                }}
                                className="w-9 h-9 rounded-full text-white flex items-center justify-center shadow-md cursor-pointer transition hover:scale-110"
                                style={{ background: C.primary }}
                                title="Host đổi phát/tạm dừng cho cả phòng"
                              >
                                {playing ? <i className="ri-pause-fill text-lg" /> : <i className="ri-play-fill text-lg ml-0.5" />}
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white/10" style={{ color: C.txtSub }}>
                                🔒 Phát theo Host
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-center py-4" style={{ color: C.txtFad }}>Chọn 1 bài hát trong thư viện để bắt đầu phát chung!</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── HIDDEN CANVAS & VIDEO FOR MOBILE iOS / ANDROID NATIVE SYSTEM PIP ─────────────────── */}
      <canvas ref={mobileCanvasRef} width="480" height="480" className="hidden" />
      <video
        ref={mobileVideoRef}
        className="hidden"
        muted
        playsInline
        webkit-playsinline="true"
        autoPictureInPicture
        onLeavePictureInPicture={() => setMobilePipActive(false)}
      />

      {/* ── FLOATING MINI PLAYER WIDGET (ADAPTIVE LAYOUT BASED ON WINDOW HEIGHT) ─────────────────── */}
      {pipWindow && track && createPortal(
        (() => {
          const isCompact = pipHeight < 240;

          // Helper to extract clean 11-char YouTube Video ID from track object or URL
          const getYoutubeVideoId = (song) => {
            if (!song) return null;
            if (song.youtubeId) return song.youtubeId;
            if (song.videoId) return song.videoId;
            if (song.id && typeof song.id === 'string' && song.id.length === 11 && !song.id.includes('/') && !song.id.includes(' ')) return song.id;
            const url = song.url || song.youtubeUrl || song.videoUrl || (typeof song.id === 'string' ? song.id : '');
            if (url) {
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
              const match = url.match(regExp);
              if (match && match[2] && match[2].length === 11) return match[2];
            }
            return null;
          };

          const ytId = getYoutubeVideoId(track);

          if (isCompact) {
            // ── COMPACT CONTROLLER VIEW (Kéo nhỏ như Ảnh 2 -> Tự động hiện rõ bộ nút điều khiển 🔊 🔀 ⏮ ⏸ ⏭ 🔁 🤍)
            return (
              <div
                className="w-full h-full flex flex-col justify-between overflow-hidden text-white select-none relative"
                style={{ background: C.isDark ? '#121214' : '#1e1e24', fontFamily: F.body }}
              >
                {/* Background Blurred Album Cover */}
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 blur-md scale-110 pointer-events-none"
                />

                {/* Top Header Logo */}
                <div className="relative z-10 flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-white/10 text-xs shrink-0">
                  <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden min-w-0">
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0" style={{ background: C.primary }}>
                      <i className={`ri-disc-fill text-[10px] text-white ${playing ? 'spin-slow' : ''}`}></i>
                    </div>
                    <span className="text-xs font-extrabold tracking-wide truncate" style={{ color: C.primarySolid, fontFamily: F.cursive, lineHeight: 1 }}>
                      LittleLove
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider truncate text-white/50" style={{ fontFamily: F.brand }}>
                      Music Space
                    </span>
                  </div>
                </div>

                {/* Center Dedicated Media Control Console (ALWAYS VISIBLE) */}
                <div className="relative z-10 flex-1 flex flex-col justify-between p-2.5 gap-1 min-h-0 bg-black/40 backdrop-blur-[2px]">

                  {/* Title & Artist */}
                  <Tooltip text={`${track.title} • ${track.artist}`}>
                    <div className="text-center min-w-0 shrink-0 cursor-pointer" title={`${track.title} - ${track.artist}`}>
                      <h4 className="text-xs font-extrabold truncate text-white leading-tight">{track.title}</h4>
                      <p className="text-[10px] text-white/70 truncate">{track.artist}</p>
                    </div>
                  </Tooltip>

                  {/* Main Action Buttons Row */}
                  <div className="flex items-center justify-center gap-2 md:gap-3 text-white my-auto">

                    {/* Volume / Mute */}
                    <button onClick={toggleMute} className="p-1 hover:scale-110 active:scale-95 transition text-white/80 hover:text-white cursor-pointer shrink-0" title="Âm thanh">
                      <i className={muted || vol === 0 ? "ri-volume-mute-line text-sm" : "ri-volume-up-line text-sm"}></i>
                    </button>

                    {/* Shuffle */}
                    <button onClick={toggleShuffle} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer shrink-0" style={{ color: isShuffle ? C.primarySolid : 'rgba(255,255,255,0.7)' }} title="Phát ngẫu nhiên">
                      <i className="ri-shuffle-line text-sm"></i>
                    </button>

                    {/* Prev */}
                    <button onClick={prevTrack} className="p-1 hover:scale-110 active:scale-95 transition text-white/90 hover:text-white cursor-pointer shrink-0" title="Bài trước">
                      <i className="ri-skip-back-fill text-base"></i>
                    </button>

                    {/* Large Center Play / Pause Button with Theme Color */}
                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer shrink-0 shadow-lg"
                      style={{ background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
                      title={buffering ? "Đang tải dữ liệu..." : playing ? "Tạm dừng" : "Phát nhạc"}
                    >
                      {buffering ? <i className="ri-loader-4-line text-lg animate-spin" /> : playing ? <PauseIcon className="w-4 h-4 md:w-5 md:h-5" /> : <PlayIcon className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>

                    {/* Next Track */}
                    <button onClick={nextTrack} className="p-1 hover:scale-110 active:scale-95 transition text-white/90 hover:text-white cursor-pointer shrink-0" title="Bài tiếp">
                      <i className="ri-skip-forward-fill text-base"></i>
                    </button>

                    {/* Repeat */}
                    <button onClick={toggleRepeat} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer shrink-0" style={{ color: repeatMode !== 'off' ? C.primarySolid : 'rgba(255,255,255,0.7)' }} title="Lặp lại">
                      <i className="ri-repeat-line text-sm"></i>
                    </button>

                    {/* Favorite */}
                    <button onClick={() => toggleFav(track.id)} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer shrink-0" style={{ color: favs.includes(track.id) ? C.primarySolid : 'rgba(255,255,255,0.7)' }} title="Yêu thích">
                      <i className={favs.includes(track.id) ? "ri-heart-fill text-sm" : "ri-heart-line text-sm"}></i>
                    </button>

                  </div>

                  {/* Bottom Timeline Bar */}
                  <div className="w-full flex flex-col gap-0.5 shrink-0">
                    <div className="flex items-center justify-between text-[9px] font-mono text-white/80 px-0.5">
                      <span>{fmt(curTime)}</span>
                      <span>{fmt(dur)}</span>
                    </div>
                    <input
                      type="range" min="0" max={dur || 100} value={curTime} onChange={seek}
                      className="w-full h-1 cursor-pointer rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, ${C.primarySolid} 0%, ${C.primarySolid} ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(255, 255, 255, 0.2) ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(255, 255, 255, 0.2) 100%)`,
                        accentColor: C.primarySolid,
                        '--accent-color': C.primarySolid,
                        '--accent-glow': C.primaryGlow
                      }}
                    />
                  </div>

                </div>
              </div>
            );
          }

          // ── NORMAL VIEW (Kéo to như Ảnh 1 -> XEM TRỰC TIẾP VIDEO GỐC CỦA BÀI HÁT)
          return (
            <div
              className="w-full h-full flex flex-col justify-between overflow-hidden text-white select-none rounded-2xl"
              style={{
                background: C.isDark ? '#121214' : '#1e1e24',
                color: '#ffffff',
                fontFamily: F.body
              }}
            >
              {/* Top Bar: Brand Logo & Title */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-black/80 border-b border-white/10 text-xs shrink-0 z-20">
                <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden min-w-0">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.primary }}>
                    <i className={`ri-disc-fill text-xs text-white ${playing ? 'spin-slow' : ''}`}></i>
                  </div>
                  <span className="text-base font-extrabold tracking-wide shrink-0" style={{ color: C.primarySolid, fontFamily: F.cursive, lineHeight: 1 }}>
                    LittleLove
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider truncate" style={{ color: C.txtFad, fontFamily: F.brand }}>
                    Unnull Music Space
                  </span>
                </div>
              </div>

              {/* Middle: High-Res Album Artwork with Animated Badge */}
              <div className="relative w-full flex-1 bg-black group overflow-hidden select-none min-h-[180px]">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Animated Playing Indicator Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md flex items-center gap-1.5 border border-white/15 pointer-events-none z-10">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.primarySolid }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Aura Playing</span>
                </div>

                {/* Hover Overlay Controls matching Theme Colors */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">

                  {/* Controls Bar Centered Over Video */}
                  <div className="flex-1 flex items-center justify-center gap-2 md:gap-3 text-white">
                    <button onClick={toggleMute} className="p-1 hover:scale-110 active:scale-95 transition text-white/80 hover:text-white cursor-pointer pointer-events-auto" title="Âm thanh">
                      <i className={muted || vol === 0 ? "ri-volume-mute-line text-base" : "ri-volume-up-line text-base"}></i>
                    </button>

                    <button onClick={toggleShuffle} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer pointer-events-auto" style={{ color: isShuffle ? C.primarySolid : 'rgba(255,255,255,0.8)' }} title="Phát ngẫu nhiên">
                      <i className="ri-shuffle-line text-base"></i>
                    </button>

                    <button onClick={prevTrack} className="p-1 hover:scale-110 active:scale-95 transition text-white/80 hover:text-white cursor-pointer pointer-events-auto" title="Bài trước">
                      <i className="ri-skip-back-fill text-xl"></i>
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer shrink-0 shadow-xl pointer-events-auto"
                      style={{ background: C.primary, boxShadow: `0 4px 18px ${C.primaryGlow}` }}
                      title={buffering ? "Đang tải dữ liệu..." : playing ? "Tạm dừng" : "Phát nhạc"}
                    >
                      {buffering ? <i className="ri-loader-4-line text-xl animate-spin" /> : playing ? <PauseIcon className="w-5 h-5 md:w-6 md:h-6" /> : <PlayIcon className="w-5 h-5 md:w-6 md:h-6" />}
                    </button>

                    <button onClick={nextTrack} className="p-1 hover:scale-110 active:scale-95 transition text-white/80 hover:text-white cursor-pointer pointer-events-auto" title="Bài tiếp">
                      <i className="ri-skip-forward-fill text-xl"></i>
                    </button>

                    <button onClick={toggleRepeat} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer pointer-events-auto" style={{ color: repeatMode !== 'off' ? C.primarySolid : 'rgba(255,255,255,0.8)' }} title="Lặp lại">
                      <i className="ri-repeat-line text-base"></i>
                    </button>

                    <button onClick={() => toggleFav(track.id)} className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer pointer-events-auto" style={{ color: favs.includes(track.id) ? C.primarySolid : 'rgba(255,255,255,0.8)' }} title="Yêu thích">
                      <i className={favs.includes(track.id) ? "ri-heart-fill text-base" : "ri-heart-line text-base"}></i>
                    </button>
                  </div>

                  {/* Bottom Progress Bar inside Video */}
                  <div className="w-full flex flex-col gap-0.5 pointer-events-auto">
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/90 px-0.5">
                      <span>{fmt(curTime)}</span>
                      <span>{fmt(dur)}</span>
                    </div>
                    <input
                      type="range" min="0" max={dur || 100} value={curTime} onChange={seek}
                      className="w-full h-1 cursor-pointer rounded-lg"
                      style={{
                        background: `linear-gradient(90deg, ${C.primarySolid} 0%, ${C.primarySolid} ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(255, 255, 255, 0.2) ${(dur > 0 ? (curTime / dur) * 100 : 0)}%, rgba(255, 255, 255, 0.2) 100%)`,
                        accentColor: C.primarySolid,
                        '--accent-color': C.primarySolid,
                        '--accent-glow': C.primaryGlow
                      }}
                    />
                  </div>

                </div>
              </div>

              {/* Bottom Track Title & Artist */}
              <div className="p-3 bg-[#18181c] flex items-center justify-between gap-3 border-t border-white/5 shrink-0 z-20">
                <div className="min-w-0 flex-1 text-left">
                  <h4 className="text-xs font-extrabold truncate text-white leading-tight">{track.title}</h4>
                  <p className="text-[10px] text-white/60 truncate mt-0.5">{track.artist}</p>
                </div>
                <button
                  onClick={() => toggleFav(track.id)}
                  className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition cursor-pointer shrink-0 hover:scale-105"
                  style={{ color: favs.includes(track.id) ? C.primarySolid : 'rgba(255,255,255,0.8)', borderColor: favs.includes(track.id) ? C.primarySolid : 'rgba(255,255,255,0.2)' }}
                  title={favs.includes(track.id) ? "Đã thích" : "Thêm vào thư viện"}
                >
                  <i className={favs.includes(track.id) ? "ri-heart-fill text-xs" : "ri-add-line text-xs"}></i>
                </button>
              </div>
            </div>
          );
        })(),
        pipWindow.document.body
      )}

      {/* ── GLOBAL TOAST POPUP NOTIFICATION ────────────────────────── */}
      {toast.show && (
        <div
          className="fixed top-6 right-6 z-[200] max-w-md w-[90vw] md:w-96 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 transition-all duration-300 animate-slide-in pointer-events-auto"
          style={{
            background: C.isDark ? 'rgba(30, 41, 59, 0.94)' : 'rgba(255, 252, 249, 0.96)',
            backdropFilter: 'blur(16px)',
            border: `1.5px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : C.primarySolid
              }`,
            boxShadow: toast.type === 'success'
              ? '0 12px 35px rgba(16, 185, 129, 0.3)'
              : toast.type === 'error'
                ? '0 12px 35px rgba(244, 63, 94, 0.3)'
                : '0 12px 35px rgba(0,0,0,0.3)',
            color: C.txt
          }}
        >
          <div
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl shadow-xs ${toast.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
              : toast.type === 'error'
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                : toast.type === 'warning'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}
          >
            <i className={
              toast.type === 'success'
                ? 'ri-checkbox-circle-fill'
                : toast.type === 'error'
                  ? 'ri-error-warning-fill'
                  : toast.type === 'warning'
                    ? 'ri-alert-fill'
                    : 'ri-disc-fill spin-slow'
            }></i>
          </div>

          <div className="flex flex-col flex-1 min-w-0 pr-1">
            <span className="text-xs font-black uppercase tracking-wider mb-0.5" style={{
              color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : C.primarySolid
            }}>
              {toast.title}
            </span>
            <p className="text-xs font-semibold leading-relaxed break-words" style={{ color: C.txt }}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition cursor-pointer hover:opacity-75"
            style={{ background: C.tag, color: C.txtFad }}
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>
      )}

      {/* ── DAILY ACTIVE USERS DETAIL MODAL ────────────────────────── */}
      {selectedDayStat && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto"
          onClick={() => setSelectedDayStat(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border overflow-hidden transition-all relative"
            onClick={e => e.stopPropagation()}
            style={{
              background: C.isDark ? '#0f172a' : '#ffffff',
              borderColor: C.border,
              color: C.txt
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 shrink-0" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  <i className="ri-calendar-check-fill" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold flex items-center gap-2" style={{ color: C.txt }}>
                    Chi Tiết Hoạt Động Ngày {selectedDayStat.date}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: C.txtSub }}>
                    Có tổng cộng <span className="font-bold text-cyan-500">{selectedDayStat.count || selectedDayStat.users?.length || 0} người dùng</span> đã truy cập hệ thống trong ngày này.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayStat(null)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                style={{ background: C.tag, color: C.txtFad }}
              >
                <i className="ri-close-line" />
              </button>
            </div>

            {/* Users List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
              {(!selectedDayStat.users || selectedDayStat.users.length === 0) ? (
                <div className="text-center py-12">
                  <i className="ri-user-unfollow-line text-4xl mb-2 inline-block" style={{ color: C.txtFad }} />
                  <p className="text-xs font-semibold" style={{ color: C.txtSub }}>Chưa có dữ liệu chi tiết cho ngày này</p>
                </div>
              ) : selectedDayStat.users.map((u, i) => (
                <div
                  key={u._id || i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl gap-3 transition hover:opacity-95"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-base font-black w-6 text-center shrink-0" style={{ color: i < 3 ? '#06b6d4' : C.txtSub }}>
                      #{i + 1}
                    </span>
                    <img
                      src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt=""
                      className="w-11 h-11 rounded-xl object-cover shrink-0"
                      style={{ border: `1.5px solid ${C.border}` }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold truncate" style={{ color: C.txt }}>{u.name}</span>
                      <span className="text-[11px] truncate" style={{ color: C.txtSub }}>{u.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center flex-wrap">
                    {/* Added Songs count on this day badge */}
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
                      style={{
                        background: (u.addedSongsCount || 0) > 0 ? 'rgba(16, 185, 129, 0.15)' : C.tag,
                        border: `1px solid ${(u.addedSongsCount || 0) > 0 ? 'rgba(16, 185, 129, 0.3)' : C.border}`,
                        color: (u.addedSongsCount || 0) > 0 ? '#10b981' : C.txtFad
                      }}
                      title={`Số bài nhạc đã thêm vào ngày ${selectedDayStat.date}`}
                    >
                      <i className="ri-music-2-line text-sm" />
                      <span className="text-xs font-bold">
                        {(u.addedSongsCount || 0) > 0 ? `+${u.addedSongsCount} bài nhạc` : '0 bài nhạc'}
                      </span>
                    </div>

                    {/* Active Time badge */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl shrink-0" style={{ background: C.tag, border: `1px solid ${C.border}` }}>
                      <i className="ri-time-line text-cyan-500 text-sm" />
                      <span className="text-xs font-extrabold" style={{ color: C.txt }}>
                        {u.activeSeconds && u.activeSeconds > 0 ? (
                          u.activeSeconds < 60
                            ? `${u.activeSeconds} giây`
                            : u.activeSeconds < 3600
                              ? `${Math.floor(u.activeSeconds / 60)} phút ${u.activeSeconds % 60} giây`
                              : `${Math.floor(u.activeSeconds / 3600)} giờ ${Math.floor((u.activeSeconds % 3600) / 60)} phút`
                        ) : (
                          "Đã truy cập"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t flex justify-end shrink-0" style={{ borderColor: C.border }}>
              <button
                onClick={() => setSelectedDayStat(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white transition hover:scale-105 active:scale-95 cursor-pointer"
                style={{ background: C.primary, boxShadow: `0 4px 14px ${C.primaryGlow}` }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
