import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export default function Fish3DCanvas() {
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
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. High Quality Studio & Cyber Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(10, 15, 10);
    scene.add(mainLight);

    const cyanGlow = new THREE.PointLight(0x00f2fe, 3.5, 30);
    cyanGlow.position.set(-6, -2, 6);
    scene.add(cyanGlow);

    const pinkGlow = new THREE.PointLight(0xf72585, 3.5, 30);
    pinkGlow.position.set(6, 4, 6);
    scene.add(pinkGlow);

    // 3. Multi-Fish Array & Data
    const fishList = [];
    const FISH_COUNT = 6;
    const loader = new GLTFLoader();

    const modelUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/public/fish.glb` : '/fish.glb';
    loader.load(
      modelUrl,
      (gltf) => {
        const baseModel = gltf.scene;

        // Auto-center base model geometry
        const box = new THREE.Box3().setFromObject(baseModel);
        const center = box.getCenter(new THREE.Vector3());
        baseModel.position.sub(center);

        for (let i = 0; i < FISH_COUNT; i++) {
          // Clone mesh & skeleton independently for each fish
          const clonedMesh = SkeletonUtils.clone(baseModel);
          const wrapperGroup = new THREE.Group();
          wrapperGroup.add(clonedMesh);

          // Vary scale slightly (0.028 to 0.048) so sizes are diverse
          const scaleVal = 0.028 + Math.random() * 0.02;
          wrapperGroup.scale.set(scaleVal, scaleVal, scaleVal);

          // Random initial 3D position across bounds
          const pos = new THREE.Vector3(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 4
          );
          wrapperGroup.position.copy(pos);

          // Random initial 3D direction & speed (bay loạn lên mọi hướng)
          const angle = Math.random() * Math.PI * 2;
          const pitch = (Math.random() - 0.5) * 0.5;
          const speed = 0.035 + Math.random() * 0.03;
          const velocity = new THREE.Vector3(
            Math.cos(angle) * Math.cos(pitch) * speed,
            Math.sin(pitch) * speed * 0.6,
            Math.sin(angle) * Math.cos(pitch) * speed
          );

          scene.add(wrapperGroup);

          // Independent AnimationMixer with desynchronized timing
          let mixer = null;
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(clonedMesh);
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              action.startAt(Math.random() * 2);
              action.play();
            });
          }

          fishList.push({
            mesh: wrapperGroup,
            velocity,
            speed,
            mixer,
            changeTimer: Math.random() * 3,
            wobbleOffset: Math.random() * 10
          });
        }
      },
      undefined,
      (err) => console.warn('GLB Load Error:', err)
    );

    // 4. Floating 3D Bubbles
    const bubblesCount = 30;
    const bubblesGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const bubblesMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.15
    });

    const bubblesGroup = new THREE.Group();
    const bubbleData = [];
    for (let i = 0; i < bubblesCount; i++) {
      const bMesh = new THREE.Mesh(bubblesGeo, bubblesMat);
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 7;
      const z = (Math.random() - 0.5) * 5;
      bMesh.position.set(x, y, z);
      const s = Math.random() * 0.8 + 0.4;
      bMesh.scale.set(s, s, s);
      bubblesGroup.add(bMesh);

      bubbleData.push({
        mesh: bMesh,
        speedY: Math.random() * 0.035 + 0.015,
        originalX: x,
        wobbleSpeed: Math.random() * 3 + 1
      });
    }
    scene.add(bubblesGroup);

    // 5. Animation Loop with Free 3D Wandering
    const clock = new THREE.Clock();
    let reqId;

    const bounds = { xMin: -9.5, xMax: 9.5, yMin: -3.2, yMax: 3.2, zMin: -3.5, zMax: 3.5 };

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update Each Fish Independently
      fishList.forEach((fish) => {
        if (fish.mixer) fish.mixer.update(delta);

        const pos = fish.mesh.position;
        const vel = fish.velocity;

        // Periodically adjust direction smoothly so fish wander freely in all directions
        fish.changeTimer -= delta;
        if (fish.changeTimer <= 0) {
          fish.changeTimer = 2.5 + Math.random() * 3.5;
          const currentAngle = Math.atan2(vel.z, vel.x);
          const newAngle = currentAngle + (Math.random() - 0.5) * 1.8;
          const newPitch = (Math.random() - 0.5) * 0.6;
          vel.x = Math.cos(newAngle) * Math.cos(newPitch) * fish.speed;
          vel.y = Math.sin(newPitch) * fish.speed * 0.6;
          vel.z = Math.sin(newAngle) * Math.cos(newPitch) * fish.speed;
        }

        // Update Position
        pos.add(vel);

        // Gentle sine wobble
        pos.y += Math.sin(time * 2 + fish.wobbleOffset) * 0.008;

        // Turn around smoothly when hitting scene boundaries
        if (pos.x < bounds.xMin) { vel.x = Math.abs(vel.x); }
        if (pos.x > bounds.xMax) { vel.x = -Math.abs(vel.x); }
        if (pos.y < bounds.yMin) { vel.y = Math.abs(vel.y); }
        if (pos.y > bounds.yMax) { vel.y = -Math.abs(vel.y); }
        if (pos.z < bounds.zMin) { vel.z = Math.abs(vel.z); }
        if (pos.z > bounds.zMax) { vel.z = -Math.abs(vel.z); }

        // Smooth rotation Y facing movement velocity direction
        const targetRotY = Math.atan2(-vel.z, vel.x) + Math.PI / 2;
        fish.mesh.rotation.y = THREE.MathUtils.lerp(fish.mesh.rotation.y, targetRotY, 0.08);

        // Pitch & Roll animation
        const pitchAngle = Math.atan2(vel.y, Math.sqrt(vel.x * vel.x + vel.z * vel.z));
        fish.mesh.rotation.x = THREE.MathUtils.lerp(fish.mesh.rotation.x, -pitchAngle, 0.08);
        fish.mesh.rotation.z = Math.sin(time * 3 + fish.wobbleOffset) * 0.06;
      });

      // Floating Bubbles Animation
      bubbleData.forEach(b => {
        b.mesh.position.y += b.speedY;
        b.mesh.position.x = b.originalX + Math.sin(time * b.wobbleSpeed) * 0.25;
        if (b.mesh.position.y > 4.5) {
          b.mesh.position.y = -4.0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
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
