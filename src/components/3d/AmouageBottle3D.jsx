import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RotateCw, Layers, Wind, Eye, CheckCircle2, Droplets } from 'lucide-react';

export default function AmouageBottle3D({
  activeChapter = 0,
  explosionProgress = 0, // 0 (assembled) to 1 (fully exploded)
  edition = 'interlude', // 'interlude', 'jubilation', 'reflection', 'overture'
  interactive = true,
  onSprayTrigger = null
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const bottleGroupRef = useRef(null);
  
  // Parts for exploded view
  const capRef = useRef(null);
  const collarRef = useRef(null);
  const pumpRef = useRef(null);
  const tubeRef = useRef(null);
  const bodyRef = useRef(null);
  const liquidRef = useRef(null);
  const crestRef = useRef(null);
  const particleSystemRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });

  // Edition Color Profiles
  const editionProfiles = {
    interlude: {
      name: 'Interlude 53 Man',
      subtitle: 'Extrait de Parfum • 53% Concentration',
      glassColor: 0x0a1931,
      glassRoughness: 0.08,
      glassTransmission: 0.85,
      juiceColor: 0x152b52,
      goldColor: 0xe6ca65,
      accentColor: '#3b82f6',
      crestColor: 0xf5d77f,
      particleColor: 0x60a5fa
    },
    jubilation: {
      name: 'Jubilation XXV',
      subtitle: 'Eau de Parfum • Royal Frankincense & Blackberry',
      glassColor: 0x221a0f,
      glassRoughness: 0.05,
      glassTransmission: 0.92,
      juiceColor: 0xd97706,
      goldColor: 0xffd700,
      accentColor: '#f59e0b',
      crestColor: 0xffe066,
      particleColor: 0xfbbf24
    },
    reflection: {
      name: 'Reflection 45',
      subtitle: 'Extrait de Parfum • Aromatic Floral Iris',
      glassColor: 0x182026,
      glassRoughness: 0.02,
      glassTransmission: 0.95,
      juiceColor: 0x94a3b8,
      goldColor: 0xe2e8f0,
      accentColor: '#cbd5e1',
      crestColor: 0xf8fafc,
      particleColor: 0xe2e8f0
    },
    overture: {
      name: 'Overture Man',
      subtitle: 'Eau de Parfum • Smoked Cognac & Sandalwood',
      glassColor: 0x2c1308,
      glassRoughness: 0.12,
      glassTransmission: 0.82,
      juiceColor: 0x9a3412,
      goldColor: 0xca8a04,
      accentColor: '#ea580c',
      crestColor: 0xfde047,
      particleColor: 0xf97316
    }
  };

  const profile = editionProfiles[edition] || editionProfiles.interlude;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 6.2);
    cameraRef.current = camera;

    // 3. Renderer with high-end anti-aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Apple Keynote Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.SpotLight(0xfff5e6, 3.5);
    keyLight.position.set(4, 7, 5);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.8;
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Rim/Backlight (Highlights gold edges & glass caustics)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.5);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    const blueFillLight = new THREE.PointLight(0x60a5fa, 1.8, 10);
    blueFillLight.position.set(3, -2, 2);
    scene.add(blueFillLight);

    // Bottom Pedestal Glow
    const bottomGlow = new THREE.PointLight(profile.goldColor, 1.2, 8);
    bottomGlow.position.set(0, -2.5, 0);
    scene.add(bottomGlow);

    // 5. Build Master Amouage Architectural Flacon Geometry
    const masterBottleGroup = new THREE.Group();
    bottleGroupRef.current = masterBottleGroup;
    scene.add(masterBottleGroup);

    // --- A. FLACON GLASS BODY (Heavy Optical Glass with signature beveled flanks) ---
    const glassBodyGroup = new THREE.Group();
    bodyRef.current = glassBodyGroup;
    masterBottleGroup.add(glassBodyGroup);

    // Outer Beveled Crystal Glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: profile.glassColor,
      roughness: profile.glassRoughness,
      metalness: 0.1,
      transmission: profile.glassTransmission,
      ior: 1.58, // Optical crystal glass index
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: 0xffffff,
      transparent: true,
      opacity: 0.95
    });

    const bodyGeometry = new THREE.BoxGeometry(2.4, 2.7, 1.2, 10, 10, 10);
    // Bevel the corners for Amouage signature silhouette
    const pos = bodyGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Slight taper towards base
      if (y < 0) {
        pos.setX(i, x * (1 - (Math.abs(y) / 2.7) * 0.08));
        pos.setZ(i, z * (1 - (Math.abs(y) / 2.7) * 0.08));
      }
    }
    bodyGeometry.computeVertexNormals();

    const glassBodyMesh = new THREE.Mesh(bodyGeometry, glassMaterial);
    glassBodyMesh.position.y = 0;
    glassBodyMesh.castShadow = true;
    glassBodyMesh.receiveShadow = true;
    glassBodyGroup.add(glassBodyMesh);

    // --- B. LIQUID FLUID CORE (Inside Glass) ---
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: profile.juiceColor,
      emissive: profile.juiceColor,
      emissiveIntensity: 0.15,
      roughness: 0.05,
      transmission: 0.6,
      transparent: true,
      opacity: 0.88,
      ior: 1.38
    });
    const liquidGeometry = new THREE.BoxGeometry(2.1, 2.2, 0.9);
    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMesh.position.y = -0.15;
    liquidRef.current = liquidMesh;
    glassBodyGroup.add(liquidMesh);

    // --- C. AMOUAGE 24K GOLD SUNBURST ROYAL CREST ---
    const crestGroup = new THREE.Group();
    crestRef.current = crestGroup;
    glassBodyGroup.add(crestGroup);

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: profile.goldColor,
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 2.0
    });

    // Sunburst Medallion Base
    const medallionGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.06, 32);
    medallionGeo.rotateX(Math.PI / 2);
    const medallionMesh = new THREE.Mesh(medallionGeo, goldMaterial);
    medallionMesh.position.set(0, 0.1, 0.62);
    crestGroup.add(medallionMesh);

    // Center Jewel / Sunburst Ring
    const ringGeo = new THREE.TorusGeometry(0.38, 0.03, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, goldMaterial);
    ringMesh.position.set(0, 0.1, 0.65);
    crestGroup.add(ringMesh);

    // Center Khanjar / Sun Star
    const starGeo = new THREE.OctahedronGeometry(0.18, 0);
    const starMesh = new THREE.Mesh(starGeo, goldMaterial);
    starMesh.position.set(0, 0.1, 0.67);
    crestGroup.add(starMesh);

    // --- D. COLLAR (Gold Fluted Neck Ring) ---
    const collarGroup = new THREE.Group();
    collarRef.current = collarGroup;
    masterBottleGroup.add(collarGroup);

    const neckCollarGeo = new THREE.CylinderGeometry(0.48, 0.55, 0.35, 32);
    const neckCollarMesh = new THREE.Mesh(neckCollarGeo, goldMaterial);
    neckCollarMesh.position.y = 1.48;
    collarGroup.add(neckCollarMesh);

    // Decorative Filigree Ring
    const filigreeGeo = new THREE.TorusGeometry(0.52, 0.04, 16, 32);
    filigreeGeo.rotateX(Math.PI / 2);
    const filigreeMesh = new THREE.Mesh(filigreeGeo, goldMaterial);
    filigreeMesh.position.y = 1.42;
    collarGroup.add(filigreeMesh);

    // --- E. INTERNAL ATOMIZER PUMP & DIP TUBE ---
    const pumpGroup = new THREE.Group();
    pumpRef.current = pumpGroup;
    masterBottleGroup.add(pumpGroup);

    const pumpEngineGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 24);
    const pumpMaterial = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
    const pumpEngineMesh = new THREE.Mesh(pumpEngineGeo, pumpMaterial);
    pumpEngineMesh.position.y = 1.55;
    pumpGroup.add(pumpEngineMesh);

    // Glass Dip Tube reaching into the juice
    const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.3, 16);
    const tubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMaterial);
    tubeMesh.position.y = 0.3;
    tubeRef.current = tubeMesh;
    pumpGroup.add(tubeMesh);

    // --- F. SULTAN QABOOS DOME CAP (Iconic Amouage Onion-Dome Cap) ---
    const capGroup = new THREE.Group();
    capRef.current = capGroup;
    masterBottleGroup.add(capGroup);

    // Base of Cap
    const capBaseGeo = new THREE.CylinderGeometry(0.72, 0.68, 0.4, 32);
    const capBaseMesh = new THREE.Mesh(capBaseGeo, goldMaterial);
    capBaseMesh.position.y = 1.78;
    capGroup.add(capBaseMesh);

    // Mosque Minaret Dome Shape (Lathed Dome)
    const domePoints = [];
    for (let deg = 0; deg <= 180; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      const x = Math.sin(rad) * 0.7 * (1 - Math.cos(rad) * 0.25);
      const y = Math.cos(rad) * 0.55 + 0.55;
      domePoints.push(new THREE.Vector2(Math.max(0.01, x), y));
    }
    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    const domeMesh = new THREE.Mesh(domeGeo, goldMaterial);
    domeMesh.position.y = 1.88;
    capGroup.add(domeMesh);

    // Finial & Crown Jewel Top
    const jewelGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const jewelMaterial = new THREE.MeshPhysicalMaterial({
      color: profile.accentColor,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      emissive: profile.accentColor,
      emissiveIntensity: 0.3
    });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMaterial);
    jewelMesh.position.y = 3.02;
    capGroup.add(jewelMesh);

    // Top Golden Needle Finial
    const finialGeo = new THREE.ConeGeometry(0.06, 0.35, 16);
    const finialMesh = new THREE.Mesh(finialGeo, goldMaterial);
    finialMesh.position.y = 3.25;
    capGroup.add(finialMesh);

    // --- G. ATOMIZER MIST PARTICLE SYSTEM (Explosive Golden Scent Cloud) ---
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 1.8;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.08,
        y: Math.random() * 0.06 + 0.04,
        z: Math.random() * 0.08 + 0.03,
        life: 0,
        maxLife: Math.random() * 40 + 20
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: profile.particleColor,
      size: 0.06,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = { system: particleSystem, velocities: particleVelocities };
    scene.add(particleSystem);

    // 6. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth idle rotation if not user-dragging
      if (!isDraggingRef.current && masterBottleGroup) {
        masterBottleGroup.rotation.y += rotationVelocityRef.current.y;
        // Natural subtle floating bob
        masterBottleGroup.position.y = Math.sin(elapsed * 1.8) * 0.06;
      }

      // Exploded View Dynamics (Smooth lerp based on explosionProgress prop)
      const ep = explosionProgress;
      if (capGroup) {
        capGroup.position.y = THREE.MathUtils.lerp(capGroup.position.y, ep * 1.8, 0.08);
        capGroup.rotation.y = THREE.MathUtils.lerp(capGroup.rotation.y, ep * 0.5, 0.08);
      }
      if (collarGroup) {
        collarGroup.position.y = THREE.MathUtils.lerp(collarGroup.position.y, ep * 0.9, 0.08);
      }
      if (pumpGroup) {
        pumpGroup.position.y = THREE.MathUtils.lerp(pumpGroup.position.y, ep * 1.2, 0.08);
      }
      if (crestGroup) {
        crestGroup.position.z = THREE.MathUtils.lerp(crestGroup.position.z, ep * 0.6, 0.08);
      }

      // Liquid subtle wave motion
      if (liquidMesh) {
        liquidMesh.position.y = -0.15 + Math.sin(elapsed * 3) * 0.015;
      }

      // Mist Particles Simulation
      if (particleSystemRef.current && particleSystemRef.current.system) {
        const ps = particleSystemRef.current.system;
        const vels = particleSystemRef.current.velocities;
        const pArray = ps.geometry.attributes.position.array;

        if (isSpraying) {
          ps.material.opacity = 0.9;
          for (let i = 0; i < particleCount; i++) {
            const v = vels[i];
            pArray[i * 3] += v.x;
            pArray[i * 3 + 1] += v.y;
            pArray[i * 3 + 2] += v.z;
            v.life++;

            if (v.life > v.maxLife) {
              pArray[i * 3] = (Math.random() - 0.5) * 0.1;
              pArray[i * 3 + 1] = 1.7;
              pArray[i * 3 + 2] = 0.2;
              v.life = 0;
            }
          }
          ps.geometry.attributes.position.needsUpdate = true;
        } else {
          ps.material.opacity = Math.max(0, ps.material.opacity - 0.04);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Event Handlers (Mouse Drag Orbit & Spray)
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !masterBottleGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      masterBottleGroup.rotation.y += deltaX * 0.008;
      masterBottleGroup.rotation.x = Math.max(-0.4, Math.min(0.4, masterBottleGroup.rotation.x + deltaY * 0.005));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !masterBottleGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      masterBottleGroup.rotation.y += deltaX * 0.009;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => { isDraggingRef.current = false; };

    domElem.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [edition, explosionProgress, isSpraying]);

  const triggerMistSpray = () => {
    setIsSpraying(true);
    setTimeout(() => setIsSpraying(false), 2400);
    if (onSprayTrigger) onSprayTrigger();
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] flex items-center justify-center select-none overflow-hidden">
      
      {/* Dynamic Ambient Radiant Glow */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${profile.accentColor} 0%, transparent 70%)` }}
      />

      {/* 3D WebGL Canvas Slot */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />

      {/* Floating Interactive Controls Bar (Apple light-theme frosted pill) */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-2xl px-4 py-2 text-xs text-gray-900">
        
        {/* Edition Label */}
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: profile.accentColor }} />
          <div>
            <div className="font-extrabold text-xs text-gray-900 tracking-tight">{profile.name}</div>
            <div className="text-[10px] text-gray-500 font-medium">{profile.subtitle}</div>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerMistSpray}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isSpraying 
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 scale-105' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-purple-600" />
            <span>{isSpraying ? 'Dispersing 0.07ml Mist...' : 'Test Atomizer'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
