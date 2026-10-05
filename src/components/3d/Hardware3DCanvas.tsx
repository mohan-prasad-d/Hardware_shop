import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useCart } from '../../context/CartContext';
import { Eye, Sparkles, Layers, RefreshCw, Lightbulb, Compass } from 'lucide-react';

export const Hardware3DCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toolColor, setToolColor, worklightsOn, setWorklightsOn, explodeOverride, setExplodeOverride, focusPart, setFocusPart } = useCart();

  const [isManualRotating, setIsManualRotating] = useState(false);
  const [hudOpen, setHudOpen] = useState(true);
  const [activeStage, setActiveStage] = useState<'hero' | 'exploded' | 'dynamics' | 'catalog'>('hero');
  const [webGlSupported, setWebGlSupported] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);

  // Component parts references for exploded animation
  const chuckGroupRef = useRef<THREE.Group | null>(null);
  const gearboxMeshRef = useRef<THREE.Mesh | null>(null);
  const statorGroupRef = useRef<THREE.Group | null>(null);
  const shellLeftRef = useRef<THREE.Mesh | null>(null);
  const shellRightRef = useRef<THREE.Mesh | null>(null);
  const batteryGroupRef = useRef<THREE.Group | null>(null);
  const bitMeshRef = useRef<THREE.Mesh | null>(null);
  const ledLight1Ref = useRef<THREE.SpotLight | null>(null);
  const ledLight2Ref = useRef<THREE.SpotLight | null>(null);

  // Material references to swap theme colors
  const armorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Dynamic animation values
  const scrollRatioRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const manualRotRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const isMouseDownRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Update theme colors when toolColor changes
  useEffect(() => {
    if (!armorMaterialRef.current) return;
    if (toolColor === 'amber') {
      armorMaterialRef.current.color.set('#f59e0b'); // Industrial Amber
      armorMaterialRef.current.roughness = 0.35;
      armorMaterialRef.current.metalness = 0.25;
    } else if (toolColor === 'stealth') {
      armorMaterialRef.current.color.set('#1e293b'); // Stealth Carbon/Slate
      armorMaterialRef.current.roughness = 0.2;
      armorMaterialRef.current.metalness = 0.7;
    } else if (toolColor === 'crimson') {
      armorMaterialRef.current.color.set('#dc2626'); // Contractor Crimson
      armorMaterialRef.current.roughness = 0.35;
      armorMaterialRef.current.metalness = 0.3;
    }
  }, [toolColor]);

  // Update LED spotlights
  useEffect(() => {
    const intensity = worklightsOn ? 4.5 : 0;
    if (ledLight1Ref.current) ledLight1Ref.current.intensity = intensity;
    if (ledLight2Ref.current) ledLight2Ref.current.intensity = intensity;
  }, [worklightsOn]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 3. Lighting Setup (Three-Point Industrial Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cool Rim Light
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 2.8);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // Top Fill Light
    const topLight = new THREE.DirectionalLight(0xf8fafc, 1.2);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    // Bottom Bounce light
    const bounceLight = new THREE.DirectionalLight(0xf59e0b, 0.5);
    bounceLight.position.set(0, -6, 2);
    scene.add(bounceLight);

    // 4. Construct Procedural Industrial Power Tool Assembly
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Shared Materials
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x12151b,
      roughness: 0.7,
      metalness: 0.15
    });

    const rubberGripMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c0f,
      roughness: 0.95,
      metalness: 0.05
    });

    const magnesiumGearMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.25,
      metalness: 0.85
    });

    const carbonChuckMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9
    });

    const goldTinBitMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.15,
      metalness: 0.95
    });

    const copperStatorMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.3,
      metalness: 0.8
    });

    const steelStatorCoreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.85
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
      metalness: 0.25
    });
    armorMaterialRef.current = armorMat;

    const ledGlowMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x22c55e,
      emissiveIntensity: 2.2
    });

    const headlightGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffedd5,
      emissiveIntensity: 3.5,
      roughness: 0.1
    });

    // --- SUB-ASSEMBLY 1: Motor Chassis Main Core ---
    const chassisCoreMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.75, 1.45, 32),
      darkChassisMat
    );
    chassisCoreMesh.rotation.x = Math.PI / 2;
    chassisCoreMesh.position.set(0, 0.2, 0);
    chassisCoreMesh.castShadow = true;
    chassisCoreMesh.receiveShadow = true;
    rootGroup.add(chassisCoreMesh);

    // Cooling vent slots on chassis
    for (let i = 0; i < 6; i++) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.5, 0.18),
        magnesiumGearMat
      );
      const angle = (i / 6) * Math.PI * 2;
      vent.position.set(Math.cos(angle) * 0.73, 0.2, Math.sin(angle) * 0.73 - 0.2);
      rootGroup.add(vent);
    }

    // --- SUB-ASSEMBLY 2: Explosive Armor Panels (Left & Right) ---
    const shellGeom = new THREE.CylinderGeometry(0.78, 0.8, 1.25, 32, 1, false, 0, Math.PI * 0.75);
    
    const shellLeft = new THREE.Mesh(shellGeom, armorMat);
    shellLeft.rotation.x = Math.PI / 2;
    shellLeft.rotation.z = Math.PI * 0.65;
    shellLeft.position.set(-0.05, 0.2, 0.05);
    shellLeft.castShadow = true;
    shellLeftRef.current = shellLeft;
    rootGroup.add(shellLeft);

    const shellRight = new THREE.Mesh(shellGeom, armorMat);
    shellRight.rotation.x = Math.PI / 2;
    shellRight.rotation.z = -Math.PI * 0.4;
    shellRight.position.set(0.05, 0.2, 0.05);
    shellRight.castShadow = true;
    shellRightRef.current = shellRight;
    rootGroup.add(shellRight);

    // --- SUB-ASSEMBLY 3: Internal Brushless Stator & Rotor Core ---
    const statorGroup = new THREE.Group();
    statorGroup.position.set(0, 0.2, 0);
    statorGroupRef.current = statorGroup;
    rootGroup.add(statorGroup);

    // Inner rotor laminated core
    const rotorCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.44, 0.44, 0.95, 24),
      steelStatorCoreMat
    );
    rotorCore.rotation.x = Math.PI / 2;
    statorGroup.add(rotorCore);

    // Copper stator coils array
    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      const coil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.85, 12),
        copperStatorMat
      );
      coil.rotation.x = Math.PI / 2;
      coil.position.set(Math.cos(angle) * 0.34, Math.sin(angle) * 0.34, 0);
      statorGroup.add(coil);
    }

    // --- SUB-ASSEMBLY 4: Cast Magnesium Planetary Gearbox ---
    const gearboxMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.7, 0.75, 32),
      magnesiumGearMat
    );
    gearboxMesh.rotation.x = Math.PI / 2;
    gearboxMesh.position.set(0, 0.2, 1.05);
    gearboxMesh.castShadow = true;
    gearboxMeshRef.current = gearboxMesh;
    rootGroup.add(gearboxMesh);

    // Torque selector collar ring
    const torqueCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.66, 0.05, 12, 32),
      darkChassisMat
    );
    torqueCollar.position.set(0, 0.2, 0.75);
    rootGroup.add(torqueCollar);

    // --- SUB-ASSEMBLY 5: Heavy-Duty 1/4" Chuck & Detent Mechanism ---
    const chuckGroup = new THREE.Group();
    chuckGroup.position.set(0, 0.2, 1.6);
    chuckGroupRef.current = chuckGroup;
    rootGroup.add(chuckGroup);

    // Chuck main collar
    const chuckCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.52, 0.7, 24),
      carbonChuckMat
    );
    chuckCollar.rotation.x = Math.PI / 2;
    chuckCollar.castShadow = true;
    chuckGroup.add(chuckCollar);

    // Knurled grip band on chuck
    const knurledBand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.28, 32),
      magnesiumGearMat
    );
    knurledBand.rotation.x = Math.PI / 2;
    chuckGroup.add(knurledBand);

    // Quick release nose
    const chuckNose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.38, 0.35, 16),
      carbonChuckMat
    );
    chuckNose.rotation.x = Math.PI / 2;
    chuckNose.position.set(0, 0, 0.48);
    chuckGroup.add(chuckNose);

    // --- SUB-ASSEMBLY 6: Protruding Titanium-Nitride Impact Bit ---
    const bitGroup = new THREE.Group();
    bitGroup.position.set(0, 0, 0.95);
    chuckGroup.add(bitGroup);

    const bitShank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.75, 6),
      goldTinBitMat
    );
    bitShank.rotation.x = Math.PI / 2;
    bitGroup.add(bitShank);

    const bitTip = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.3, 4),
      goldTinBitMat
    );
    bitTip.rotation.x = -Math.PI / 2;
    bitTip.position.set(0, 0, 0.45);
    bitGroup.add(bitTip);
    bitMeshRef.current = bitShank;

    // --- SUB-ASSEMBLY 7: Ergonomic Handle & Trigger Grip ---
    const handleGroup = new THREE.Group();
    handleGroup.position.set(0, -0.65, -0.15);
    rootGroup.add(handleGroup);

    const handleSpine = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 1.45, 0.65),
      darkChassisMat
    );
    handleSpine.rotation.x = -0.22;
    handleSpine.castShadow = true;
    handleGroup.add(handleSpine);

    // Rubberized finger indent cushions
    for (let f = 0; f < 3; f++) {
      const gripIndent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.48, 16),
        rubberGripMat
      );
      gripIndent.rotation.z = Math.PI / 2;
      gripIndent.position.set(0, 0.35 - f * 0.38, 0.28 - f * 0.08);
      handleGroup.add(gripIndent);
    }

    // Variable speed trigger
    const triggerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.42, 0.32),
      magnesiumGearMat
    );
    triggerMesh.position.set(0, 0.38, 0.45);
    handleGroup.add(triggerMesh);

    // --- SUB-ASSEMBLY 8: Detachable 24V Lithium-Ion Battery Pack ---
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, -1.6, -0.35);
    batteryGroupRef.current = batteryGroup;
    rootGroup.add(batteryGroup);

    // Battery chassis foot
    const batteryBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.05, 0.62, 1.45),
      darkChassisMat
    );
    batteryBase.castShadow = true;
    batteryGroup.add(batteryBase);

    // Protective bottom bumper rails
    const battBumper = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 0.14, 1.48),
      rubberGripMat
    );
    battBumper.position.set(0, -0.28, 0);
    batteryGroup.add(battBumper);

    // Slide-lock release latch
    const releaseLatch = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.16, 0.28),
      armorMat
    );
    releaseLatch.position.set(0, 0.32, 0.6);
    batteryGroup.add(releaseLatch);

    // Battery fuel gauge 3-LED bar
    for (let b = 0; b < 3; b++) {
      const ledBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.04, 0.14),
        ledGlowMat
      );
      ledBar.position.set(0.53, 0.12, 0.15 - b * 0.2);
      batteryGroup.add(ledBar);
    }

    // --- SUB-ASSEMBLY 9: Twin Forward Job-Site Halo Worklights ---
    const leftHeadlightLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12),
      headlightGlassMat
    );
    leftHeadlightLens.rotation.x = Math.PI / 2;
    leftHeadlightLens.position.set(-0.28, -0.32, 0.58);
    rootGroup.add(leftHeadlightLens);

    const rightHeadlightLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.04, 12),
      headlightGlassMat
    );
    rightHeadlightLens.rotation.x = Math.PI / 2;
    rightHeadlightLens.position.set(0.28, -0.32, 0.58);
    rootGroup.add(rightHeadlightLens);

    // Spotlights casting light forward
    const spot1 = new THREE.SpotLight(0xfff5e6, 4.5, 12, Math.PI / 5, 0.4, 1.2);
    spot1.position.set(-0.28, -0.32, 0.6);
    spot1.target.position.set(-0.28, -0.32, 5);
    scene.add(spot1);
    scene.add(spot1.target);
    ledLight1Ref.current = spot1;

    const spot2 = new THREE.SpotLight(0xfff5e6, 4.5, 12, Math.PI / 5, 0.4, 1.2);
    spot2.position.set(0.28, -0.32, 0.6);
    spot2.target.position.set(0.28, -0.32, 5);
    scene.add(spot2);
    scene.add(spot2.target);
    ledLight2Ref.current = spot2;

    // Contact Floor Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const groundShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(5.5, 5.5),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      })
    );
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -2.35;
    scene.add(groundShadow);

    // 5. Scroll and Mouse Event Listeners
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        const ratio = Math.min(Math.max(window.scrollY / total, 0), 1);
        scrollRatioRef.current = ratio;

        if (ratio < 0.25) {
          setActiveStage('hero');
        } else if (ratio < 0.65) {
          setActiveStage('exploded');
        } else if (ratio < 0.85) {
          setActiveStage('dynamics');
        } else {
          setActiveStage('catalog');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 0.35;
      mouseRef.current.targetY = normY * 0.25;

      if (isMouseDownRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        manualRotRef.current.targetY += deltaX * 0.008;
        manualRotRef.current.targetX += deltaY * 0.008;
        manualRotRef.current.active = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only capture if clicking directly on the canvas container
      if (e.target === renderer.domElement) {
        isMouseDownRef.current = true;
        setIsManualRotating(true);
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      setIsManualRotating(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop with Delta Timing and Smooth Interpolation
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouseRef.current.targetX, 0.08);
      mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouseRef.current.targetY, 0.08);

      // Smooth manual rotation lerp
      manualRotRef.current.x = THREE.MathUtils.lerp(manualRotRef.current.x, manualRotRef.current.targetX, 0.1);
      manualRotRef.current.y = THREE.MathUtils.lerp(manualRotRef.current.y, manualRotRef.current.targetY, 0.1);

      const scroll = scrollRatioRef.current;
      const isMobile = window.innerWidth < 1024;

      // Base target transform values calculated from scroll
      let targetPosX = 0;
      let targetPosY = 0;
      let targetPosZ = 0;
      let targetRotY = 0;
      let targetRotX = 0;
      let targetRotZ = 0;
      let targetScale = 1.25;

      // Calculate explode intensity: either manual override or auto from scroll curve
      let explodeFactor = 0;
      if (explodeOverride >= 0) {
        explodeFactor = explodeOverride;
      } else {
        // Curve: starts exploding around scroll 0.22, peaks at 0.45, recedes at 0.65
        if (scroll >= 0.2 && scroll <= 0.68) {
          const t = (scroll - 0.2) / 0.48;
          explodeFactor = Math.sin(t * Math.PI);
        }
      }

      // Stage choreography
      if (scroll < 0.25) {
        // STAGE 0: HERO (Assembled isometric pose on right side)
        targetPosX = isMobile ? 0 : 1.75;
        targetPosY = -0.15;
        targetPosZ = 0;
        targetRotY = -0.55 + Math.sin(time * 0.6) * 0.06;
        targetRotX = 0.22 + mouseRef.current.y * 0.4;
        targetRotZ = -0.05;
        targetScale = isMobile ? 0.95 : 1.35;
      } else if (scroll < 0.65) {
        // STAGE 1: ENGINEERING & EXPLODED SCHEMATIC (Left side, direct view)
        targetPosX = isMobile ? 0 : -1.8;
        targetPosY = 0.1;
        targetPosZ = 0.5;
        targetRotY = 0.75 + (scroll - 0.25) * 1.8;
        targetRotX = 0.15;
        targetRotZ = 0;
        targetScale = isMobile ? 0.9 : 1.25;
      } else if (scroll < 0.85) {
        // STAGE 2: DYNAMICS & TORQUE TEST (Rotates into action angle)
        targetPosX = isMobile ? 0 : 1.5;
        targetPosY = -0.3;
        targetPosZ = 0.2;
        targetRotY = -1.2 + (scroll - 0.65) * 2.5;
        targetRotX = 0.35;
        targetRotZ = 0.1;
        targetScale = isMobile ? 0.85 : 1.2;
      } else {
        // STAGE 3: CATALOG DEPOT (Subtle background orientation)
        targetPosX = isMobile ? 0 : -2.2;
        targetPosY = -1.2;
        targetPosZ = -0.8;
        targetRotY = 0.4 + time * 0.15;
        targetRotX = 0.25;
        targetRotZ = 0;
        targetScale = isMobile ? 0.7 : 0.95;
      }

      // Focus part adjustment
      if (focusPart === 'stator') {
        targetRotY = 1.2;
        targetRotX = 0.4;
      } else if (focusPart === 'gearbox') {
        targetRotY = 0.6;
        targetRotX = 0.1;
      } else if (focusPart === 'battery') {
        targetRotY = -0.2;
        targetRotX = -0.3;
      } else if (focusPart === 'chuck') {
        targetRotY = 0.3;
        targetRotX = 0.2;
      }

      // Apply smooth lerp to root group
      if (rootGroup) {
        // Combine scroll targets with manual rotation drag
        const finalRotY = targetRotY + mouseRef.current.x * 0.5 + manualRotRef.current.y;
        const finalRotX = targetRotX + manualRotRef.current.x;

        rootGroup.position.x = THREE.MathUtils.lerp(rootGroup.position.x, targetPosX, 0.08);
        rootGroup.position.y = THREE.MathUtils.lerp(rootGroup.position.y, targetPosY, 0.08);
        rootGroup.position.z = THREE.MathUtils.lerp(rootGroup.position.z, targetPosZ, 0.08);

        rootGroup.rotation.y = THREE.MathUtils.lerp(rootGroup.rotation.y, finalRotY, 0.08);
        rootGroup.rotation.x = THREE.MathUtils.lerp(rootGroup.rotation.x, finalRotX, 0.08);
        rootGroup.rotation.z = THREE.MathUtils.lerp(rootGroup.rotation.z, targetRotZ, 0.08);

        const currentScale = rootGroup.scale.x;
        const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
        rootGroup.scale.set(nextScale, nextScale, nextScale);

        // Chuck continuous rotation
        if (chuckGroupRef.current) {
          const spinSpeed = scroll > 0.65 && scroll < 0.85 ? 18.0 : 1.5;
          chuckGroupRef.current.rotation.z += delta * spinSpeed;
        }

        // --- Exploded Separation Transforms ---
        // 1. Chuck pulls forward
        if (chuckGroupRef.current) {
          const targetChuckZ = 1.6 + explodeFactor * 1.4;
          chuckGroupRef.current.position.z = THREE.MathUtils.lerp(chuckGroupRef.current.position.z, targetChuckZ, 0.1);
        }

        // 2. Planetary Gearbox slides forward
        if (gearboxMeshRef.current) {
          const targetGearZ = 1.05 + explodeFactor * 0.75;
          gearboxMeshRef.current.position.z = THREE.MathUtils.lerp(gearboxMeshRef.current.position.z, targetGearZ, 0.1);
        }

        // 3. Stator Core reveals copper windings & lifts out
        if (statorGroupRef.current) {
          const targetStatorY = 0.2 + explodeFactor * 0.85;
          const targetStatorZ = explodeFactor * 0.35;
          statorGroupRef.current.position.y = THREE.MathUtils.lerp(statorGroupRef.current.position.y, targetStatorY, 0.1);
          statorGroupRef.current.position.z = THREE.MathUtils.lerp(statorGroupRef.current.position.z, targetStatorZ, 0.1);
          statorGroupRef.current.rotation.z = THREE.MathUtils.lerp(statorGroupRef.current.rotation.z, explodeFactor * 0.4, 0.1);
        }

        // 4. Armor Shells split open laterally
        if (shellLeftRef.current) {
          const targetShellX = -0.05 - explodeFactor * 0.95;
          shellLeftRef.current.position.x = THREE.MathUtils.lerp(shellLeftRef.current.position.x, targetShellX, 0.1);
        }
        if (shellRightRef.current) {
          const targetShellX = 0.05 + explodeFactor * 0.95;
          shellRightRef.current.position.x = THREE.MathUtils.lerp(shellRightRef.current.position.x, targetShellX, 0.1);
        }

        // 5. 24V Battery pack drops downward along the rail
        if (batteryGroupRef.current) {
          const targetBattY = -1.6 - explodeFactor * 1.35;
          const targetBattZ = -0.35 - explodeFactor * 0.45;
          batteryGroupRef.current.position.y = THREE.MathUtils.lerp(batteryGroupRef.current.position.y, targetBattY, 0.1);
          batteryGroupRef.current.position.z = THREE.MathUtils.lerp(batteryGroupRef.current.position.z, targetBattZ, 0.1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      scene.clear();
    };
  }, [explodeOverride, focusPart]);

  const resetManualRotation = useCallback(() => {
    manualRotRef.current.targetX = 0;
    manualRotRef.current.targetY = 0;
    manualRotRef.current.active = false;
    setExplodeOverride(-1);
    setFocusPart(null);
  }, [setExplodeOverride, setFocusPart]);

  if (!webGlSupported) {
    return (
      <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-end p-12">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-sm text-slate-400">
          Hardware 3D Canvas running in compatibility mode.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 3D Canvas Layer */}
      <div
        ref={containerRef}
        className={`fixed inset-0 z-10 ${
          isManualRotating ? 'cursor-grabbing' : 'pointer-events-none'
        }`}
        style={{ touchAction: 'pan-y' }}
      />

      {/* Floating 3D Interaction Control HUD */}
      <div className="fixed bottom-6 right-6 z-30 pointer-events-auto flex flex-col items-end gap-3">
        {hudOpen ? (
          <div className="bg-[#12161f]/90 border border-slate-800 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5 w-72 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 font-semibold text-slate-200">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>3D Viewport Controls</span>
              </div>
              <button
                onClick={() => setHudOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Minimize 3D HUD"
              >
                Hide
              </button>
            </div>

            {/* Stage Indicator */}
            <div className="flex items-center justify-between text-slate-400">
              <span>Scroll Phase</span>
              <span className="font-mono text-amber-400 uppercase font-semibold">
                {activeStage === 'hero' && '01 // Assembly'}
                {activeStage === 'exploded' && '02 // Exploded'}
                {activeStage === 'dynamics' && '03 // Torque Test'}
                {activeStage === 'catalog' && '04 // Depot Dock'}
              </span>
            </div>

            {/* Exploded Mode Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Explode Mechanism
                </span>
                <span className="font-mono text-slate-400">
                  {explodeOverride < 0 ? 'Auto (Scroll)' : `${Math.round(explodeOverride * 100)}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodeOverride < 0 ? 0 : explodeOverride}
                  onChange={(e) => setExplodeOverride(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
                {explodeOverride >= 0 && (
                  <button
                    onClick={() => setExplodeOverride(-1)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono whitespace-nowrap"
                    title="Return to scroll synchronization"
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>

            {/* Tool Shell Material Selector */}
            <div>
              <span className="text-slate-400 block mb-1.5">Housing Finish</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setToolColor('amber')}
                  className={`py-1.5 px-2 rounded-lg border font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5 ${
                    toolColor === 'amber'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  Amber
                </button>
                <button
                  onClick={() => setToolColor('stealth')}
                  className={`py-1.5 px-2 rounded-lg border font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5 ${
                    toolColor === 'stealth'
                      ? 'border-slate-400 bg-slate-400/10 text-slate-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                  Stealth
                </button>
                <button
                  onClick={() => setToolColor('crimson')}
                  className={`py-1.5 px-2 rounded-lg border font-medium text-[11px] transition-colors flex items-center justify-center gap-1.5 ${
                    toolColor === 'crimson'
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  Crimson
                </button>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400">
              <button
                onClick={() => setWorklightsOn(!worklightsOn)}
                className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg border transition-colors ${
                  worklightsOn
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Worklights {worklightsOn ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={resetManualRotation}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
                title="Reset Camera & Rotation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset View
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setHudOpen(true)}
            className="bg-[#12161f]/90 border border-slate-800 hover:border-amber-500/60 text-slate-200 p-3 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105"
            title="Open 3D Controls"
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold">3D Controls</span>
          </button>
        )}
      </div>
    </>
  );
};
