import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Sparkles, RotateCw, ZoomIn, ZoomOut, CheckCircle2, ShieldCheck, Wind, Layers } from 'lucide-react';

export default function RealPerfumeModel3D({
  modelUrl = '/models/perfume.glb',
  height = '500px',
  interactive = true,
  autoRotate = true
}) {
  const mountRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSpraying, setIsSpraying] = useState(false);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const particleSystemRef = useRef(null);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const zoomLevelRef = useRef(3.5);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const heightPx = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, zoomLevelRef.current);
    cameraRef.current = camera;

    // 3. Renderer with soft studio lighting & anti-aliasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Bright Studio Lighting for Light Theme)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.4);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const bottomGlow = new THREE.PointLight(0x7c3aed, 1.0, 10);
    bottomGlow.position.set(0, -3, 2);
    scene.add(bottomGlow);

    // 5. Model Container
    const modelMasterGroup = new THREE.Group();
    modelGroupRef.current = modelMasterGroup;
    scene.add(modelMasterGroup);

    // 6. Particle Mist System
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0.8;
      particlePositions[i * 3 + 2] = 0;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.06,
        y: Math.random() * 0.05 + 0.03,
        z: Math.random() * 0.06 + 0.02,
        life: 0,
        maxLife: Math.random() * 35 + 15
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd97706,
      size: 0.05,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystemRef.current = { system: particleSystem, velocities: particleVelocities };
    scene.add(particleSystem);

    // 7. Load GLB Model with Progress Callback
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const loadedModel = gltf.scene;

        // Auto-center and normalize bounding box scale
        const bbox = new THREE.Box3().setFromObject(loadedModel);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        const maxAxis = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2.0 / maxAxis;
        loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Center model
        loadedModel.position.x = -center.x * scaleFactor;
        loadedModel.position.y = -center.y * scaleFactor;
        loadedModel.position.z = -center.z * scaleFactor;

        // Enhance materials
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.5;
              if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                child.material.needsUpdate = true;
              }
            }
          }
        });

        modelMasterGroup.add(loadedModel);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadingProgress(percent);
        }
      },
      (err) => {
        console.error('Error loading GLB:', err);
        setLoadError('Failed to load 3D model');
        setIsLoading(false);
      }
    );

    // 8. Render Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDraggingRef.current && modelMasterGroup) {
        if (autoRotate) {
          modelMasterGroup.rotation.y += 0.005;
        }
        modelMasterGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;
      }

      // Mist simulation
      if (particleSystemRef.current && particleSystemRef.current.system) {
        const ps = particleSystemRef.current.system;
        const vels = particleSystemRef.current.velocities;
        const pArray = ps.geometry.attributes.position.array;

        if (isSpraying) {
          ps.material.opacity = 0.85;
          for (let i = 0; i < particleCount; i++) {
            const v = vels[i];
            pArray[i * 3] += v.x;
            pArray[i * 3 + 1] += v.y;
            pArray[i * 3 + 2] += v.z;
            v.life++;

            if (v.life > v.maxLife) {
              pArray[i * 3] = (Math.random() - 0.5) * 0.08;
              pArray[i * 3 + 1] = 0.8;
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

    animate();

    // 9. Mouse and Touch Interaction
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !modelMasterGroup) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      modelMasterGroup.rotation.y += deltaX * 0.008;
      modelMasterGroup.rotation.x = Math.max(-0.5, Math.min(0.5, modelMasterGroup.rotation.x + deltaY * 0.005));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDraggingRef.current = false; };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Wheel zoom
    const handleWheel = (e) => {
      e.preventDefault();
      zoomLevelRef.current = Math.max(1.8, Math.min(6.5, zoomLevelRef.current + e.deltaY * 0.003));
      if (cameraRef.current) {
        cameraRef.current.position.z = zoomLevelRef.current;
      }
    };
    domElem.addEventListener('wheel', handleWheel, { passive: false });

    // Touch Support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !modelMasterGroup || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      modelMasterGroup.rotation.y += deltaX * 0.009;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => { isDraggingRef.current = false; };

    domElem.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Resize
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
      domElem.removeEventListener('wheel', handleWheel);
      domElem.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [modelUrl, autoRotate, isSpraying]);

  const triggerMist = () => {
    setIsSpraying(true);
    setTimeout(() => setIsSpraying(false), 2200);
  };

  const handleZoom = (delta) => {
    zoomLevelRef.current = Math.max(1.8, Math.min(6.5, zoomLevelRef.current + delta));
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevelRef.current;
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-white border border-gray-200 shadow-xl overflow-hidden flex flex-col justify-between" style={{ height }}>
      
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 flex items-center justify-center" />

      {/* Loading Screen Indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center space-y-3 p-6">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <div className="text-center">
            <h4 className="text-sm font-extrabold text-gray-900">Streaming 3D GLB Flacon Model...</h4>
            <p className="text-xs text-gray-500 mt-1">High-Precision CAD Geometry</p>
            {loadingProgress > 0 && (
              <div className="w-48 bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Bar Overlay */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl px-4 py-2 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-gray-800 text-xs">Interactive 3D Flacon Studio</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(-0.5)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.5)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={triggerMist}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isSpraying ? 'bg-amber-500 text-white shadow' : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{isSpraying ? 'Spraying...' : 'Test Mist'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
