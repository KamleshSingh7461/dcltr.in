import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Wind, RefreshCw, Eye, Rotate3d, Droplet } from 'lucide-react';

export default function PerfumeBottle3D({ 
  initialFill = 60, // percentage
  initialJuiceColor = '#D4AF37', // Gold Amber
  brandName = 'CREED',
  perfumeName = 'AVENTUS',
  batchCode = '19P11',
  interactiveControls = true 
}) {
  const mountRef = useRef(null);
  const [fillLevel, setFillLevel] = useState(initialFill);
  const [juiceColor, setJuiceColor] = useState(initialJuiceColor);
  const [isSpraying, setIsSpraying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // References for Three.js objects to mutate dynamically
  const sceneRef = useRef(null);
  const liquidMeshRef = useRef(null);
  const liquidMatRef = useRef(null);
  const mistSystemRef = useRef(null);
  const bottleGroupRef = useRef(null);

  const colorsPalette = [
    { name: 'Imperial Amber', hex: '#D4AF37' },
    { name: 'Aged Cognac', hex: '#A35836' },
    { name: 'Rose Extrait', hex: '#D37260' },
    { name: 'Smoky Vetiver', hex: '#4A6B5D' },
    { name: 'Nocturnal Oud', hex: '#52330A' },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting (Haute Parfumerie Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.2);
    scene.add(ambientLight);

    // Key Light (Warm Champagne)
    const keyLight = new THREE.DirectionalLight(0xffe8c2, 3.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Rim / Backlight (Cool Crisp Gold Rim)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Subtle Fill Bottom
    const fillLight = new THREE.PointLight(0xffffff, 1.0, 10);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // 4. Bottle Hierarchy Group
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // Materials
    // A. Heavy Crystal Outer Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      metalness: 0.05,
      ior: 1.54, // Flint glass IOR
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xfff8ee),
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // B. Brushed Gold Stopper Material
    const goldCapMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.92,
      roughness: 0.22,
    });

    // C. Internal Liquid Material
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(juiceColor),
      transmission: 0.45,
      opacity: 0.95,
      transparent: true,
      roughness: 0.1,
      metalness: 0.08,
      ior: 1.36, // Perfume alcohol IOR
      attenuationColor: new THREE.Color(juiceColor),
      attenuationDistance: 0.8,
    });
    liquidMatRef.current = liquidMaterial;

    // 5. Construct Bottle Meshes
    // A. Outer Glass Flacon (Chamfered Architectural Box Silhouette)
    const outerGlassGeo = new THREE.BoxGeometry(1.6, 2.1, 0.9, 4, 4, 4);
    const outerGlassMesh = new THREE.Mesh(outerGlassGeo, glassMaterial);
    outerGlassMesh.position.y = 0;
    bottleGroup.add(outerGlassMesh);

    // B. Inner Liquid Chamber
    const fillFraction = fillLevel / 100;
    const maxLiquidHeight = 1.8;
    const currentHeight = Math.max(0.05, maxLiquidHeight * fillFraction);

    const liquidGeo = new THREE.BoxGeometry(1.36, currentHeight, 0.72);
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
    // Align liquid to the base of the chamber
    liquidMesh.position.y = -0.95 + currentHeight / 2;
    bottleGroup.add(liquidMesh);
    liquidMeshRef.current = liquidMesh;

    // C. Internal Atomizer Tube
    const tubeGeo = new THREE.CylinderGeometry(0.018, 0.018, 2.0, 16);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.35, roughness: 0.2 });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.position.y = 0.05;
    bottleGroup.add(tubeMesh);

    // D. Metallic Collar / Neck
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.3, 32);
    const neckMesh = new THREE.Mesh(neckGeo, goldCapMaterial);
    neckMesh.position.y = 1.15;
    bottleGroup.add(neckMesh);

    // E. Heavy Octagonal Stopper / Cap
    const capGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.65, 8);
    const capMesh = new THREE.Mesh(capGeo, goldCapMaterial);
    capMesh.position.y = 1.58;
    bottleGroup.add(capMesh);

    // F. Floating Gold Dust Particles inside/around the bottle
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 1.2;
      particlePositions[i + 1] = (Math.random() - 0.5) * 1.6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 0.6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffe17d,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    bottleGroup.add(dustParticles);

    // G. Fragrance Atomizer Spray Mist Particle System
    const mistCount = 180;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);
    const mistVelocities = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount * 3; i += 3) {
      mistPositions[i] = 0;
      mistPositions[i + 1] = 1.7;
      mistPositions[i + 2] = 0;

      mistVelocities[i] = (Math.random() - 0.5) * 0.06;
      mistVelocities[i + 1] = 0.04 + Math.random() * 0.08;
      mistVelocities[i + 2] = 0.04 + Math.random() * 0.06;
    }
    mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));

    const mistMat = new THREE.PointsMaterial({
      color: 0xfff6db,
      size: 0.06,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const mistSystem = new THREE.Points(mistGeo, mistMat);
    scene.add(mistSystem);
    mistSystemRef.current = mistSystem;

    // 6. Interactive Drag / Orbit Mechanics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = -0.25;
    let targetRotationX = 0.08;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.006;
      // Clamp vertical tilt
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.006;
      targetRotationX = Math.max(-0.4, Math.min(0.4, targetRotationX));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    dom.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onMouseUp);

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation interpolation
      bottleGroup.rotation.y += (targetRotationY - bottleGroup.rotation.y) * 0.08;
      bottleGroup.rotation.x += (targetRotationX - bottleGroup.rotation.x) * 0.08;

      // Idle natural breathing float if not dragging
      if (!isDragging) {
        targetRotationY += 0.002;
        bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      }

      // Liquid subtle wave simulation
      if (liquidMeshRef.current) {
        liquidMeshRef.current.rotation.z = Math.sin(elapsedTime * 2.5) * 0.02;
      }

      // Dust gentle float
      dustParticles.rotation.y = elapsedTime * 0.05;

      // Mist spray particle animation
      if (mistSystemRef.current && isSpraying) {
        const positions = mistSystemRef.current.geometry.attributes.position.array;
        mistMat.opacity = Math.max(0, mistMat.opacity - 0.015);

        for (let i = 0; i < mistCount * 3; i += 3) {
          positions[i] += mistVelocities[i];
          positions[i + 1] += mistVelocities[i + 1];
          positions[i + 2] += mistVelocities[i + 2];
        }
        mistSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Sync Fluid Height when fillLevel changes
  useEffect(() => {
    if (!liquidMeshRef.current) return;
    const maxLiquidHeight = 1.8;
    const currentHeight = Math.max(0.04, (maxLiquidHeight * fillLevel) / 100);

    liquidMeshRef.current.geometry.dispose();
    liquidMeshRef.current.geometry = new THREE.BoxGeometry(1.36, currentHeight, 0.72);
    liquidMeshRef.current.position.y = -0.95 + currentHeight / 2;
  }, [fillLevel]);

  // Sync Juice Color
  useEffect(() => {
    if (!liquidMatRef.current) return;
    const c = new THREE.Color(juiceColor);
    liquidMatRef.current.color = c;
    liquidMatRef.current.attenuationColor = c;
  }, [juiceColor]);

  // Trigger Fragrance Mist Burst
  const triggerSpray = () => {
    if (!mistSystemRef.current) return;
    setIsSpraying(true);
    mistSystemRef.current.material.opacity = 0.85;

    const positions = mistSystemRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.1;
      positions[i + 1] = 1.7 + (Math.random() - 0.5) * 0.1;
      positions[i + 2] = (Math.random() - 0.5) * 0.1;
    }
    mistSystemRef.current.geometry.attributes.position.needsUpdate = true;

    setTimeout(() => {
      setIsSpraying(false);
    }, 1500);
  };

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] flex flex-col items-center justify-between select-none">
      
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Floating 3D Interaction Badge & Drag Tip */}
      <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] uppercase tracking-widest text-gold-400 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-gold-400/20 flex items-center gap-1.5 shadow">
        <Rotate3d className="w-3 h-3 text-gold-400 animate-spin-slow" />
        <span>Drag to Inspect 3D Crystal Flacon</span>
      </div>

      {/* Spray Mist Button Overlay */}
      <button
        onClick={triggerSpray}
        className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-gold-400/10 hover:bg-gold-400/25 border border-gold-400/40 text-gold-300 font-mono text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg"
      >
        <Wind className={`w-3.5 h-3.5 text-gold-400 ${isSpraying ? 'animate-ping' : ''}`} />
        <span>{isSpraying ? 'Atomizing...' : 'Atomizer Mist'}</span>
      </button>

      {/* Interactive Liquid Adjuster Controls (Bottom Overlay) */}
      {interactiveControls && (
        <div className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-20 bg-obsidian-950/90 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          
          {/* Level Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-stone-400 tracking-wider">Fill Level:</span>
            <div className="flex bg-obsidian-900 rounded p-0.5 border border-stone-800">
              {[
                { label: '20ml', val: 20 },
                { label: '50ml', val: 50 },
                { label: '75ml', val: 75 },
                { label: '100ml', val: 100 }
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => setFillLevel(p.val)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                    fillLevel === p.val
                      ? 'bg-gold-400 text-obsidian-950 shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span className="text-gold-400 font-bold ml-1 text-xs">{fillLevel}%</span>
          </div>

          {/* Liquid Tint Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-stone-400 tracking-wider">Tincture:</span>
            <div className="flex gap-1.5">
              {colorsPalette.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setJuiceColor(c.hex)}
                  title={c.name}
                  className={`w-4 h-4 rounded-full border transition-transform ${
                    juiceColor === c.hex ? 'scale-125 border-white shadow-md' : 'border-black/50 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
