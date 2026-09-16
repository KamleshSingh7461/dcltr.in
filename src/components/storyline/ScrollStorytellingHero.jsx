import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  Sparkles, Wind, ShieldCheck, Droplets, CheckCircle2, 
  Lock, ArrowDown, ChevronRight, Eye, RefreshCw, 
  RotateCcw, Sliders, Layers, Award, Tag
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export default function ScrollStorytellingHero() {
  const { setActiveModal, formatPrice } = useMarketplace();
  const trackRef = useRef(null);
  const mountRef = useRef(null);

  // States
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [isSpraying, setIsSpraying] = useState(false);
  const [isFreeOrbit, setIsFreeOrbit] = useState(false);

  // Three.js References
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelMasterGroupRef = useRef(null);
  const particleSystemRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  // Animation Interpolation State
  const animStateRef = useRef({
    targetProgress: 0,
    currentProgress: 0,
    targetCamPos: new THREE.Vector3(0, 0.1, 3.6),
    currentCamPos: new THREE.Vector3(0, 0.1, 3.6),
    targetCamLook: new THREE.Vector3(0, 0, 0),
    currentCamLook: new THREE.Vector3(0, 0, 0),
    targetModelRot: new THREE.Vector3(0.08, 0.4, 0),
    currentModelRot: new THREE.Vector3(0.08, 0.4, 0),
    targetModelPos: new THREE.Vector3(0, -0.05, 0),
    currentModelPos: new THREE.Vector3(0, -0.05, 0)
  });

  // Story Chapters
  const chapters = [
    {
      id: 0,
      range: [0, 0.20],
      tag: 'CHAPTER 01 / ANATOMY OF HAUTE PARFUMERIE',
      title: 'Architectural Craftsmanship. Verified Provenance.',
      subtitle: 'The secondary fine fragrance exchange engineered for rare flacons and vintage batches.',
      description: 'Sculpted from heavyweight optical glass with authentic manufacturer tolerances. On dcltr.in, every consigned flacon is documented down to the millimeter.'
    },
    {
      id: 1,
      range: [0.20, 0.45],
      tag: 'CHAPTER 02 / PRECISION ATOMIZER & CRIMP',
      title: '0.08ml Ultrasonic Mist Dispersion.',
      subtitle: 'Pressure-tested collar seals and tamper-evident crimping verification.',
      description: 'Our collectors inspect collar seating, spray velocity, and valve return to ensure zero evaporation and authentic atomizer performance.'
    },
    {
      id: 2,
      range: [0.45, 0.70],
      tag: 'CHAPTER 03 / BACKLIT MENISCUS VETTING',
      title: 'Accurate to ±0.5ml. Buy Partials with Confidence.',
      subtitle: 'From 15ml remnants to 90ml partials — pay only for what remains.',
      description: 'Why pay full retail for 100ml when your rotation only needs 30ml? Verified fill levels make luxury perfumery accessible and liquid.'
    },
    {
      id: 3,
      range: [0.70, 0.88],
      tag: 'CHAPTER 04 / BATCH AUTHENTICATION & ESCROW',
      title: '48-Hour Buyer Inspection Escrow.',
      subtitle: 'Laser-etched batch stamping cross-referenced with brand production logs.',
      description: 'Your payment remains locked safely in escrow until you receive your bottle, inspect the scent profile, and confirm authentic batch codes.'
    },
    {
      id: 4,
      range: [0.88, 1.0],
      tag: 'CHAPTER 05 / THE DCLTR EXCHANGE',
      title: 'Declutter Your Vanity. Acquire Rare Grails.',
      subtitle: 'Join over 30,000 collectors safely buying, selling, and trading fine flacons.',
      description: 'Discover coveted discontinued formulations, sell gently used bottles, and experience transparent peer-to-peer bidding.'
    }
  ];

  // Scroll Tracking
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      animStateRef.current.targetProgress = progress;
      setScrollProgress(progress);

      // Determine active chapter
      let newStage = 0;
      for (let i = 0; i < chapters.length; i++) {
        if (progress >= chapters[i].range[0] && progress <= chapters[i].range[1]) {
          newStage = i;
          break;
        }
      }
      setActiveStage(newStage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to Chapter via Click
  const scrollToChapter = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const targetProgress = (chapters[index].range[0] + chapters[index].range[1]) / 2;
    const totalScrollable = track.offsetHeight - window.innerHeight;
    const targetY = track.offsetTop + (totalScrollable * targetProgress);

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  // Three.js Initialization & 3D Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.6);
    cameraRef.current = camera;

    // 3. Renderer with ACES ToneMapping & Anti-aliasing
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

    // 4. Luxury Light Studio Rig (Clean Light Theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf5d0fe, 1.6); // Soft purple-violet rim
    rimLight.position.set(-6, 5, -4);
    scene.add(rimLight);

    const amberFill = new THREE.PointLight(0xfef3c7, 1.2, 12);
    amberFill.position.set(0, -2, 3);
    scene.add(amberFill);

    // 5. Master Model Container
    const masterGroup = new THREE.Group();
    modelMasterGroupRef.current = masterGroup;
    scene.add(masterGroup);

    // 6. Particle Mist Sprayer System
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0.85;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.07,
        y: Math.random() * 0.06 + 0.035,
        z: Math.random() * 0.07 + 0.02,
        life: 0,
        maxLife: Math.random() * 40 + 20
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.055,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = { system: particleSystem, velocities: particleVelocities };
    scene.add(particleSystem);

    // 7. Load GLB Model with Bounding Box Normalization
    const loader = new GLTFLoader();
    loader.load(
      '/models/perfume.glb',
      (gltf) => {
        const model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        const maxAxis = Math.max(size.x, size.y, size.z);
        const scale = 2.1 / maxAxis;
        model.scale.set(scale, scale, scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.6;
              child.material.needsUpdate = true;
            }
          }
        });

        masterGroup.add(model);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error('Error loading perfume.glb in Storytelling Hero:', err);
        setIsLoading(false);
      }
    );

    // 8. Keyframe Story Animation Lerp Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Smooth Lerp Progress
      const anim = animStateRef.current;
      anim.currentProgress += (anim.targetProgress - anim.currentProgress) * 0.08;
      const p = anim.currentProgress;

      if (!isFreeOrbit && masterGroup) {
        // Stage Interpolation Keyframes
        if (p <= 0.20) {
          // Chapter 1: Monolith Silhouette
          const subP = p / 0.20;
          anim.targetCamPos.set(0, 0.1, 3.6 - subP * 0.4);
          anim.targetCamLook.set(0, 0, 0);
          anim.targetModelRot.set(0.08, 0.4 + subP * 0.6, 0);
          anim.targetModelPos.set(0, -0.05 + Math.sin(elapsed * 1.5) * 0.03, 0);
        } else if (p <= 0.45) {
          // Chapter 2: Atomizer Close-up
          const subP = (p - 0.20) / 0.25;
          anim.targetCamPos.set(-0.45 + subP * 0.1, 0.75, 2.1);
          anim.targetCamLook.set(0, 0.65, 0);
          anim.targetModelRot.set(0.15, 1.0 + subP * 0.8, -0.05);
          anim.targetModelPos.set(-0.35, -0.45, 0);
        } else if (p <= 0.70) {
          // Chapter 3: Fluid Meniscus Side Profile
          const subP = (p - 0.45) / 0.25;
          anim.targetCamPos.set(0.55, 0.1, 2.6);
          anim.targetCamLook.set(0, -0.1, 0);
          anim.targetModelRot.set(0.04, -1.2 + subP * 0.5, 0.02);
          anim.targetModelPos.set(0.40, -0.05, 0);
        } else if (p <= 0.88) {
          // Chapter 4: Base Batch Code Stamp Tilt
          const subP = (p - 0.70) / 0.18;
          anim.targetCamPos.set(-0.2, -0.45, 2.3);
          anim.targetCamLook.set(0, -0.4, 0);
          anim.targetModelRot.set(1.05 + subP * 0.1, 0.3 + subP * 0.4, 0);
          anim.targetModelPos.set(-0.35, 0.35, 0);
        } else {
          // Chapter 5: Grand Exchange Finale
          const subP = (p - 0.88) / 0.12;
          anim.targetCamPos.set(0, 0.1, 3.4);
          anim.targetCamLook.set(0, 0, 0);
          anim.targetModelRot.set(0.06, 6.28 * subP + 0.4, 0);
          anim.targetModelPos.set(0, 0.05 + Math.sin(elapsed * 1.5) * 0.03, 0);
        }

        // Apply Vector Lerps
        anim.currentCamPos.lerp(anim.targetCamPos, 0.08);
        anim.currentCamLook.lerp(anim.targetCamLook, 0.08);
        anim.currentModelPos.lerp(anim.targetModelPos, 0.08);

        masterGroup.position.copy(anim.currentModelPos);
        masterGroup.rotation.x += (anim.targetModelRot.x - masterGroup.rotation.x) * 0.08;
        masterGroup.rotation.y += (anim.targetModelRot.y - masterGroup.rotation.y) * 0.08;
        masterGroup.rotation.z += (anim.targetModelRot.z - masterGroup.rotation.z) * 0.08;

        camera.position.copy(anim.currentCamPos);
        camera.lookAt(anim.currentCamLook);
      } else if (isFreeOrbit && masterGroup) {
        // Subtle levitation while in free orbit
        masterGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;
      }

      // Particle Spray Mist Update
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
              pArray[i * 3] = (Math.random() - 0.5) * 0.08;
              pArray[i * 3 + 1] = 0.85;
              pArray[i * 3 + 2] = 0.1;
              v.life = 0;
            }
          }
          ps.geometry.attributes.position.needsUpdate = true;
        } else {
          ps.material.opacity = Math.max(0, ps.material.opacity - 0.05);
        }
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Free Orbit Mouse Controls
    const domElem = renderer.domElement;
    const handleMouseDown = (e) => {
      if (!isFreeOrbit) return;
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isFreeOrbit || !isDraggingRef.current || !masterGroup) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      masterGroup.rotation.y += dx * 0.008;
      masterGroup.rotation.x = Math.max(-0.6, Math.min(0.6, masterGroup.rotation.x + dy * 0.005));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDraggingRef.current = false; };

    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, [isFreeOrbit, isSpraying]);

  const currentChapter = chapters[activeStage] || chapters[0];

  return (
    <div ref={trackRef} className="relative w-full h-[400vh] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9]">
      
      {/* Pinned Fullscreen 3D Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Radial Ambiance */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(243,232,255,0.7)_0%,rgba(255,255,255,0)_65%)]" />

        {/* Top Floating Brand & Mode Strip */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">
                Live 3D Flacon Anatomy
              </span>
            </div>

            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-gray-100/90 border border-gray-200/70 text-[11px] font-bold text-gray-700">
              <span>Scroll to Deconstruct</span>
            </div>
          </div>

          {/* Quick Interactive 3D Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsSpraying(true);
                setTimeout(() => setIsSpraying(false), 2200);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isSpraying
                  ? 'bg-amber-500 text-white shadow-amber-200'
                  : 'bg-white/90 hover:bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <Wind className={`w-3.5 h-3.5 ${isSpraying ? 'animate-spin' : 'text-amber-500'}`} />
              <span>{isSpraying ? 'Spraying Mist...' : 'Test Spray'}</span>
            </button>

            <button
              onClick={() => setIsFreeOrbit(!isFreeOrbit)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                isFreeOrbit
                  ? 'bg-purple-600 text-white shadow-purple-200'
                  : 'bg-white/90 hover:bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
              <span>{isFreeOrbit ? 'Free Orbit Mode' : 'Scroll Synced'}</span>
            </button>
          </div>
        </div>

        {/* Central 3D Canvas Mount */}
        <div 
          ref={mountRef} 
          className={`absolute inset-0 w-full h-full z-10 ${isFreeOrbit ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`} 
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4 shadow-md">
              <Sparkles className="w-6 h-6 text-purple-600 animate-spin" />
            </div>
            <h4 className="text-base font-black text-gray-900 mb-1">
              Loading 3D CAD Flacon...
            </h4>
            <p className="text-xs text-gray-500 font-medium mb-3">
              Streaming high-precision geometry & materials
            </p>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-purple-700 mt-2">
              {loadingProgress}% Loaded
            </span>
          </div>
        )}

        {/* Middle Storytelling Floating Narrative Cards */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[360px]">
            
            {/* Stage 0 / Intro Center Overlay */}
            {activeStage === 0 && (
              <div className="lg:col-span-6 lg:col-start-1 text-left space-y-4 pointer-events-auto animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-extrabold text-purple-800">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>{currentChapter.tag}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1]">
                  The Architecture of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-600 to-amber-600">Haute Parfumerie</span>.
                </h1>

                <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-lg">
                  {currentChapter.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToChapter(1)}
                    className="px-5 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
                  >
                    <span>Begin 3D Deconstruction</span>
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('exchange-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-gray-800 border border-gray-200 font-bold text-xs shadow-sm transition-all"
                  >
                    <span>Skip to Marketplace</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stage 1 / Atomizer Zoom (Right Card) */}
            {activeStage === 1 && (
              <div className="lg:col-span-5 lg:col-start-8 pointer-events-auto animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-purple-100 shadow-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[10px] font-extrabold text-purple-800 uppercase tracking-wider">
                    <Wind className="w-3.5 h-3.5 text-purple-600" />
                    <span>{currentChapter.tag}</span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">
                    {currentChapter.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {currentChapter.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <div className="text-[11px] font-bold text-gray-900">Ultrasonic Valve</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Zero siphon leakage</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
                      <div className="text-[11px] font-bold text-gray-900">Pressure Crimping</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Tamper-evident collar</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 2 / Meniscus Vetting (Left Card) */}
            {activeStage === 2 && (
              <div className="lg:col-span-5 lg:col-start-1 pointer-events-auto animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-amber-100 shadow-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                    <Droplets className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentChapter.tag}</span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">
                    {currentChapter.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {currentChapter.description}
                  </p>

                  {/* Fill Level Verification Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-700">Measured Partial Volume</span>
                      <span className="text-amber-600 font-mono">68ml / 100ml (68%)</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-[68%]" />
                    </div>
                    <div className="text-[10px] text-gray-400 text-right">Backlit calibrated meniscus validation</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 3 / Batch Code Escrow (Right Card) */}
            {activeStage === 3 && (
              <div className="lg:col-span-5 lg:col-start-8 pointer-events-auto animate-fade-in">
                <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentChapter.tag}</span>
                  </div>

                  <h3 className="text-2xl font-black text-gray-950 tracking-tight">
                    {currentChapter.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {currentChapter.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        Escrow Release Window
                      </span>
                      <span className="font-mono">48 Hours</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-tight">
                      Inspect the bottle, verify batch engraving, and test the scent before funds are disbursed to the seller.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stage 4 / Finale Portal (Centered Card) */}
            {activeStage === 4 && (
              <div className="lg:col-span-8 lg:col-start-3 text-center space-y-5 pointer-events-auto animate-fade-in">
                <div className="p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-2xl border border-purple-100 shadow-2xl space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-extrabold text-purple-900">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>THE DCLTR SECONDARY EXCHANGE</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
                    Ready to Declutter or Acquire?
                  </h2>

                  <p className="text-sm text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
                    Explore vintage batches, rare partials, and brand new sealed bottles with 100% verified authenticity.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('exchange-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xl shadow-purple-200 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Explore Available Flacons</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveModal('sellWizard')}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gray-900 hover:bg-black text-white font-bold text-xs shadow-lg transition-all"
                    >
                      <span>List a Fragrance for Sale</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Interactive Chapter Scrub Strip */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pointer-events-auto">
          <div className="p-2 sm:p-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => scrollToChapter(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeStage === idx
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-80">0{idx + 1}</span>
                  <span>{ch.tag.split('/')[1]?.trim() || `Step ${idx + 1}`}</span>
                </button>
              ))}
            </div>

            {/* Scroll Progress Meter */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div 
                  className="h-full bg-purple-600 transition-all duration-150"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-600 w-10 text-right">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
