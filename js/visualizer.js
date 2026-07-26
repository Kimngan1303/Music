/**
 * Audio Reactive Visualizer & Ambient Particle System
 * Renders real-time animated frequency bars, audio wave pulses, and floating particles.
 */
const Visualizer = (function () {
  let isPlaying = false;
  let animFrameId = null;

  // Visualizer Canvas Elements
  let mainCanvas, mainCtx;
  let particleCanvas, particleCtx;

  // Floating particles
  let particles = [];
  const numParticles = 45;

  /**
   * Initializes canvases and resizes them
   */
  function init() {
    mainCanvas = document.getElementById('visualizer-canvas');
    if (mainCanvas) mainCtx = mainCanvas.getContext('2d');

    particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
      particleCtx = particleCanvas.getContext('2d');
      resizeParticleCanvas();
      window.addEventListener('resize', resizeParticleCanvas);
      createParticles();
      animateParticles();
    }
  }

  function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function animateParticles() {
    if (!particleCtx || !particleCanvas) return;
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#8b5cf6';

    particles.forEach(p => {
      p.x += p.speedX * (isPlaying ? 1.5 : 0.8);
      p.y += p.speedY * (isPlaying ? 1.5 : 0.8);

      if (p.x < 0) p.x = particleCanvas.width;
      if (p.x > particleCanvas.width) p.x = 0;
      if (p.y < 0) p.y = particleCanvas.height;
      if (p.y > particleCanvas.height) p.y = 0;

      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      particleCtx.fillStyle = primaryColor;
      particleCtx.globalAlpha = p.alpha;
      particleCtx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  /**
   * Starts visualizer rendering loop for main canvas
   */
  function startVisualizer() {
    if (!mainCanvas || !mainCtx) return;
    resizeMainCanvas();
    if (!animFrameId) {
      renderVisualizer();
    }
  }

  function resizeMainCanvas() {
    if (!mainCanvas) return;
    const rect = mainCanvas.getBoundingClientRect();
    mainCanvas.width = rect.width;
    mainCanvas.height = rect.height;
  }

  function stopVisualizer() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function setPlayingState(playing) {
    isPlaying = playing;
    if (isPlaying) {
      startVisualizer();
    }
  }

  /**
   * Main render loop for audio frequency bars & sine wave pulse
   */
  function renderVisualizer() {
    if (!mainCanvas || !mainCtx) return;

    const width = mainCanvas.width;
    const height = mainCanvas.height;
    mainCtx.clearRect(0, 0, width, height);

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#8b5cf6';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary').trim() || '#ec4899';

    const time = Date.now() * 0.003;
    const numBars = 64;
    const barWidth = (width / numBars) * 0.6;
    const gap = (width / numBars) * 0.4;

    // Draw Frequency Bars
    for (let i = 0; i < numBars; i++) {
      let barHeight;

      if (isPlaying) {
        // Multi-frequency wave simulation synced to playback time
        const freq1 = Math.sin(time * 2 + i * 0.15) * 0.5 + 0.5;
        const freq2 = Math.cos(time * 3 + i * 0.25) * 0.5 + 0.5;
        const freq3 = Math.sin(time * 1.5 + i * 0.08) * 0.5 + 0.5;
        barHeight = ((freq1 + freq2 + freq3) / 3) * (height * 0.6) + 15;
      } else {
        // Idle baseline bars
        barHeight = Math.sin(i * 0.2) * 8 + 12;
      }

      const x = i * (barWidth + gap) + gap / 2;
      const y = height - barHeight - 40;

      // Gradient Fill
      const grad = mainCtx.createLinearGradient(0, y, 0, height);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(1, secondaryColor);

      mainCtx.fillStyle = grad;
      mainCtx.shadowBlur = isPlaying ? 15 : 0;
      mainCtx.shadowColor = primaryColor;

      // Rounded Top Bar
      mainCtx.beginPath();
      mainCtx.roundRect(x, y, barWidth, barHeight, [6, 6, 0, 0]);
      mainCtx.fill();
    }

    // Draw Smooth Audio Wave Ribbon on Top
    mainCtx.beginPath();
    mainCtx.moveTo(0, height * 0.4);
    for (let x = 0; x < width; x += 10) {
      const wave = isPlaying
        ? Math.sin(x * 0.01 + time * 3) * 25 + Math.cos(x * 0.02 + time * 2) * 15
        : Math.sin(x * 0.005) * 5;
      mainCtx.lineTo(x, height * 0.4 + wave);
    }
    mainCtx.strokeStyle = secondaryColor;
    mainCtx.lineWidth = 3;
    mainCtx.shadowBlur = 10;
    mainCtx.shadowColor = secondaryColor;
    mainCtx.stroke();

    animFrameId = requestAnimationFrame(renderVisualizer);
  }

  return {
    init: init,
    setPlayingState: setPlayingState,
    startVisualizer: startVisualizer,
    stopVisualizer: stopVisualizer
  };
})();
