import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SEASONAL_CONFIG = {
  christmas: {
    items: ['❄️', '🎄', '🎁', '⭐', '❄️', '✨', '⛄'],
    direction: 'down',
    count: 55,
    speedMin: 0.8,
    speedMax: 2.2,
    sizeMin: 14,
    sizeMax: 28,
    wobble: 1.8,
    rotate: true
  },
  tet_holiday: {
    items: ['🌸', '🧧', '🌼', '🪙', '🌸', '🏮', '✨'],
    direction: 'down',
    count: 50,
    speedMin: 0.6,
    speedMax: 1.8,
    sizeMin: 14,
    sizeMax: 26,
    wobble: 2.2,
    rotate: true
  },
  mid_autumn: {
    items: ['🌕', '🥮', '🏮', '⭐️', '🐰', '✨'],
    direction: 'up',
    count: 45,
    speedMin: 0.5,
    speedMax: 1.3,
    sizeMin: 16,
    sizeMax: 30,
    wobble: 1.2,
    rotate: false
  },
  halloween: {
    items: ['🎃', '👻', '🦇', '🔮', '🕷️', '🕯️'],
    direction: 'down',
    count: 48,
    speedMin: 0.7,
    speedMax: 2.0,
    sizeMin: 16,
    sizeMax: 28,
    wobble: 2.5,
    rotate: true
  },
  autumn_season: {
    items: ['🍁', '🍂', '🌾', '🍁', '🍂'],
    direction: 'down',
    count: 50,
    speedMin: 0.5,
    speedMax: 1.6,
    sizeMin: 14,
    sizeMax: 28,
    wobble: 3.0,
    rotate: true
  },
  summer_season: {
    items: ['☀️', '🌞', '🌤️', '☀️', '🔥', '✨', '🌞'],
    direction: 'up',
    count: 55,
    speedMin: 0.6,
    speedMax: 1.8,
    sizeMin: 22,
    sizeMax: 42,
    wobble: 2.2,
    rotate: true
  }
};

export default function BubbleCanvas({ themeKey }) {
  const mountRef = useRef(null);
  const seasonalConfig = SEASONAL_CONFIG[themeKey];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 260;

    // ── IF SEASONAL THEME: RENDER 2D CANVAS FALLING ITEMS ──
    if (seasonalConfig) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      let reqId;

      const particles = [];
      const { items, direction, count, speedMin, speedMax, sizeMin, sizeMax, wobble, rotate } = seasonalConfig;

      for (let i = 0; i < count; i++) {
        particles.push({
          char: items[Math.floor(Math.random() * items.length)],
          x: Math.random() * width,
          y: Math.random() * height,
          speedY: (Math.random() * (speedMax - speedMin) + speedMin) * (direction === 'down' ? 1 : -1),
          size: Math.random() * (sizeMax - sizeMin) + sizeMin,
          opacity: Math.random() * 0.55 + 0.4,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.03 + 0.01,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.02
        });
      }

      let animationTime = 0;
      const render = () => {
        reqId = requestAnimationFrame(render);
        animationTime += 0.02;
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(animationTime * wobble + p.wobbleOffset) * 0.8;
          if (rotate) p.angle += p.spin;

          // Boundary wrap
          if (direction === 'down' && p.y > height + 40) {
            p.y = -40;
            p.x = Math.random() * width;
          } else if (direction === 'up' && p.y < -40) {
            p.y = height + 40;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.font = `${p.size}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.translate(p.x, p.y);
          if (rotate) ctx.rotate(p.angle);
          ctx.fillText(p.char, 0, 0);
          ctx.restore();
        });
      };

      render();

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 260;
        canvas.width = w;
        canvas.height = h;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(reqId);
        if (container.contains(canvas)) {
          container.removeChild(canvas);
        }
      };
    }

    // ── OTHERWISE: THREE.JS 3D GLASS BUBBLES ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(8, 12, 10);
    scene.add(mainLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 30);
    cyanLight.position.set(-6, 2, 5);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xf72585, 3, 30);
    pinkLight.position.set(6, -2, 5);
    scene.add(pinkLight);

    const bubblesCount = 25;
    const bubblesGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const bubblesMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.9,
      transparent: true,
      roughness: 0.02,
      ior: 1.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    });

    const bubblesGroup = new THREE.Group();
    const bubbleData = [];

    for (let i = 0; i < bubblesCount; i++) {
      const bMesh = new THREE.Mesh(bubblesGeo, bubblesMat);
      const x = (Math.random() - 0.5) * 22;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 6;
      bMesh.position.set(x, y, z);

      const scale = Math.random() * 1.2 + 0.3;
      bMesh.scale.set(scale, scale, scale);
      bubblesGroup.add(bMesh);

      bubbleData.push({
        mesh: bMesh,
        speedY: Math.random() * 0.03 + 0.012,
        originalX: x,
        wobbleSpeed: Math.random() * 2.5 + 1.0,
        wobbleAmp: Math.random() * 0.3 + 0.1
      });
    }
    scene.add(bubblesGroup);

    const clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      bubbleData.forEach((b) => {
        b.mesh.position.y += b.speedY;
        b.mesh.position.x = b.originalX + Math.sin(time * b.wobbleSpeed) * b.wobbleAmp;

        if (b.mesh.position.y > 4.8) {
          b.mesh.position.y = -4.5;
          b.originalX = (Math.random() - 0.5) * 22;
        }
      });

      cyanLight.position.x = Math.sin(time * 0.8) * 8;
      pinkLight.position.x = Math.cos(time * 0.8) * 8;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [themeKey]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-hidden flex items-center justify-center"
    />
  );
}
