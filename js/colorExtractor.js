/**
 * Dynamic Music Theme Engine - Color Extractor
 * Extracts dominant hue & vibrant theme colors from track album artwork.
 */
const ColorExtractor = (function () {
  // Pre-calculated harmonious color schemes for fast fallback / hashing
  const fallbackThemes = [
    { primary: '#8b5cf6', secondary: '#ec4899', glow: 'rgba(139, 92, 246, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)' }, // Purple Neon
    { primary: '#3b82f6', secondary: '#06b6d4', glow: 'rgba(59, 130, 246, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #1e3a8a 0%, #0f172a 60%, #020617 100%)' }, // Ocean Blue
    { primary: '#10b981', secondary: '#3b82f6', glow: 'rgba(16, 185, 129, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #0f172a 60%, #020617 100%)' }, // Emerald Glow
    { primary: '#f59e0b', secondary: '#ef4444', glow: 'rgba(245, 158, 11, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #78350f 0%, #0f172a 60%, #020617 100%)' }, // Amber Sunset
    { primary: '#ec4899', secondary: '#f43f5e', glow: 'rgba(236, 72, 153, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #831843 0%, #0f172a 60%, #020617 100%)' }, // Cyberpunk Pink
    { primary: '#06b6d4', secondary: '#8b5cf6', glow: 'rgba(6, 182, 212, 0.4)', bg: 'radial-gradient(circle at 50% 20%, #164e63 0%, #0f172a 60%, #020617 100%)' }  // Neon Cyan
  ];

  /**
   * Generates a deterministic index based on a string (e.g. videoId)
   */
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Applies the theme to the document root element with CSS variable transitions
   */
  function applyTheme(primary, secondary, glow, bg) {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', primary);
    root.style.setProperty('--theme-primary-hover', primary);
    root.style.setProperty('--theme-secondary', secondary);
    root.style.setProperty('--theme-glow', glow);
    root.style.setProperty('--theme-bg-gradient', bg);
  }

  /**
   * Main function to extract theme from image URL or fallback hash
   */
  function updateThemeForTrack(track) {
    if (!track) return;
    
    // Hash fallback for instant response
    const themeIndex = hashString(track.youtubeId || track.id || track.title) % fallbackThemes.length;
    const fallback = fallbackThemes[themeIndex];

    if (!track.thumbnail) {
      applyTheme(fallback.primary, fallback.secondary, fallback.glow, fallback.bg);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = track.thumbnail;

    img.onload = function () {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 40;
        canvas.height = 40;
        ctx.drawImage(img, 0, 0, 40, 40);

        const imgData = ctx.getImageData(0, 0, 40, 40).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imgData.length; i += 16) { // sample pixels
          r += imgData[i];
          g += imgData[i + 1];
          b += imgData[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Boost saturation for vibrant audio app feel
        const primary = `rgb(${r}, ${g}, ${b})`;
        const secondary = `rgb(${Math.min(255, r + 40)}, ${Math.max(0, g - 20)}, ${Math.min(255, b + 60)})`;
        const glow = `rgba(${r}, ${g}, ${b}, 0.45)`;
        const bg = `radial-gradient(circle at 50% 20%, rgb(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)}) 0%, #0f172a 60%, #020617 100%)`;

        applyTheme(primary, secondary, glow, bg);
      } catch (err) {
        // CORS restriction on external image -> use deterministic hashed vibrant theme
        applyTheme(fallback.primary, fallback.secondary, fallback.glow, fallback.bg);
      }
    };

    img.onerror = function () {
      applyTheme(fallback.primary, fallback.secondary, fallback.glow, fallback.bg);
    };
  }

  return {
    updateThemeForTrack: updateThemeForTrack
  };
})();
