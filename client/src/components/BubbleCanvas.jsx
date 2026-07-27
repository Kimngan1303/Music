import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BubbleCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 260;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights for Glowing Glass Bubbles
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

    // 3. Floating 3D Bubbles Particle Array
    const bubblesCount = 45;
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

    // 4. Animation Loop
    const clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      bubbleData.forEach((b) => {
        b.mesh.position.y += b.speedY;
        b.mesh.position.x = b.originalX + Math.sin(time * b.wobbleSpeed) * b.wobbleAmp;

        // Reset bubble to bottom when reaching top boundary
        if (b.mesh.position.y > 4.8) {
          b.mesh.position.y = -4.5;
          b.originalX = (Math.random() - 0.5) * 22;
        }
      });

      // Slowly rotate light angles
      cyanLight.position.x = Math.sin(time * 0.8) * 8;
      pinkLight.position.x = Math.cos(time * 0.8) * 8;

      renderer.render(scene, camera);
    };

    animate();

    // 5. Handle Resize
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-20 w-full h-full overflow-hidden flex items-center justify-center"
    />
  );
}
