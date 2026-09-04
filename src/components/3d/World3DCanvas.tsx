import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CloudsStage } from './CloudsStage';
import { DatacenterCorridor } from './DatacenterCorridor';
import { Project } from '../../types';

interface World3DCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  scrollProgressRef?: React.MutableRefObject<number>;
  onInspectProject: (project: Project) => void;
  onWarmed?: () => void;
}

// SceneWarmer: Pre-compiles all materials and shaders across ALL sectors before preloader completes
function SceneWarmer({ onWarmed }: { onWarmed?: () => void }) {
  const { gl, scene, camera } = useThree();
  const warmedRef = useRef(false);

  useFrame(() => {
    if (!warmedRef.current) {
      let meshCount = 0;
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) meshCount++;
      });

      // Once all GLTF models (racks, motherboard, room, plane) are mounted in the scene graph
      if (meshCount > 15) {
        // 1. Compile stratosphere & clouds view
        gl.compile(scene, camera);

        // 2. Pre-compile interior datacenter & server rack shaders
        const interiorCam = camera.clone() as THREE.PerspectiveCamera;
        interiorCam.position.set(0, 1.35, 6);
        interiorCam.lookAt(0, 1.35, -20);
        interiorCam.updateMatrixWorld();
        gl.compile(scene, interiorCam);

        // 3. Pre-compile Rack 4 Motherboard & Red Core chip shaders
        const chipCam = camera.clone() as THREE.PerspectiveCamera;
        chipCam.position.set(-1.8, 1.35, -9);
        chipCam.lookAt(-2.4, 1.25, -9);
        chipCam.updateMatrixWorld();
        gl.compile(scene, chipCam);

        // 4. Pre-compile Lounge Room & Runway Experience shaders
        const roomCam = camera.clone() as THREE.PerspectiveCamera;
        roomCam.position.set(0, 1.35, -30);
        roomCam.lookAt(0, 1.35, -33.5);
        roomCam.updateMatrixWorld();
        gl.compile(scene, roomCam);

        warmedRef.current = true;
        onWarmed?.();
      }
    }
  });

  return null;
}

// Static reusable vectors to eliminate per-frame heap allocations & GC pressure
const _tempTargetPos = new THREE.Vector3();
const _tempTargetLookAt = new THREE.Vector3();

// Camera Rig: Gate lands first -> Datacenter Cathedral fades in -> Gate breaches -> Silicon Doors -> Red Chip
function CameraRig({
  scrollProgress: propScrollProgress,
  scrollProgressRef,
}: {
  scrollProgress: number;
  scrollProgressRef?: React.MutableRefObject<number>;
}) {
  const currentPos = useRef(new THREE.Vector3(0, 38, 42));
  const currentLookAt = useRef(new THREE.Vector3(0, 30, 5));
  const currentFov = useRef(48);

  useFrame((state) => {
    // Subtle Mouse Parallax
    const mouseX = state.pointer.x * 0.16;
    const mouseY = state.pointer.y * 0.12;

    const targetPos = _tempTargetPos;
    const targetLookAt = _tempTargetLookAt;
    let targetFov = 48;

    const aspect = state.viewport.aspect;
    const isPortrait = aspect < 1.15;
    const portraitZOffset = isPortrait ? THREE.MathUtils.clamp((1.15 - aspect) * 4.0, 0, 3.2) : 0;

    const scrollProgress = scrollProgressRef ? scrollProgressRef.current : propScrollProgress;

    if (scrollProgress <= 0.085) {
      // 1. HERO STRATOSPHERE OVERVIEW (0% to 8.5%)
      // Cruising high in the sunny stratosphere (10,000m) looking forward across the clouds
      const p = scrollProgress / 0.085;
      targetPos.set(
        mouseX * 0.25,
        THREE.MathUtils.lerp(38, 34, p) + mouseY * 0.25,
        THREE.MathUtils.lerp(42, 38, p)
      );
      // Looking forward across the open sky horizon
      targetLookAt.set(0, THREE.MathUtils.lerp(30, 26, p), 5);

    } else if (scrollProgress <= 0.175) {
      // 2. GRAND STRATOSPHERE-TO-GROUND DESCENT (8.5% to 17.5%)
      // Diving 34 meters down through the clouds to eye-level outside the airlock gate
      const p = (scrollProgress - 0.085) / (0.175 - 0.085);
      const s = p * p * (3 - 2 * p); // Silky cubic smoothstep

      const camY = THREE.MathUtils.lerp(34, 1.35, s);
      const camZ = THREE.MathUtils.lerp(38, 16.0 + portraitZOffset, s);

      targetPos.set(
        mouseX * 0.12,
        camY + mouseY * 0.12,
        camZ
      );
      // Lands camera gaze smoothly onto the biometric entrance gate (Z=12.5)
      targetLookAt.set(
        0,
        THREE.MathUtils.lerp(26, 1.4, s),
        THREE.MathUtils.lerp(5, 12.5, s)
      );

    } else if (scrollProgress <= 0.250) {
      // 3. STANDING OUTSIDE THE SEALED GATE (17.5% to 25%)
      // Section 2: "The Datacenter Cathedral" overlay active in front of the gate
      const p = (scrollProgress - 0.175) / (0.250 - 0.175);
      targetPos.set(
        mouseX * 0.15,
        1.35 + mouseY * 0.12,
        THREE.MathUtils.lerp(16.0 + portraitZOffset, 14.8 + portraitZOffset, p)
      );
      targetLookAt.set(0, 1.4, 12.5);

    } else if (scrollProgress <= 0.300) {
      // 4. AIRLOCK DOUBLE DOORS SLIDE OPEN & CAMERA FLIES THROUGH (25% to 30%)
      const p = (scrollProgress - 0.250) / 0.050;
      targetPos.set(
        mouseX * 0.15,
        1.35 + mouseY * 0.12,
        THREE.MathUtils.lerp(14.8 + portraitZOffset, 10.5, p)
      );
      targetLookAt.set(0, 1.35, -20);

    } else if (scrollProgress <= 0.385) {
      // 5. STATION 1: RACK 1 ON RIGHT (Z = 6.0) -> SILICON SUBSTRATE CARD 1 (30% to 38.5%)
      // Turns camera smoothly towards the rack card so it is centered on mobile and desktop
      const p = (scrollProgress - 0.300) / (0.385 - 0.300);
      const camZ = THREE.MathUtils.lerp(10.5, 7.5, p);
      const bell = Math.sin(p * Math.PI);
      const camX = -bell * 0.32;
      const lookX = bell * 1.35;
      const lookZ = THREE.MathUtils.lerp(camZ - 20, 7.0, bell);

      targetPos.set(camX + mouseX * 0.08, 1.35 + mouseY * 0.08, camZ);
      targetLookAt.set(lookX, 1.35, lookZ);

    } else if (scrollProgress <= 0.405) {
      // TRANSITION 1 -> 2: Walking from Rack 1 to Rack 2 (38.5% to 40.5%)
      const p = (scrollProgress - 0.385) / (0.405 - 0.385);
      const camZ = THREE.MathUtils.lerp(7.5, 5.5, p);

      targetPos.set(mouseX * 0.08, 1.35 + mouseY * 0.08, camZ);
      targetLookAt.set(0, 1.35, camZ - 20);

    } else if (scrollProgress <= 0.485) {
      // 6. STATION 2: RACK 2 ON LEFT (Z = 1.0) -> SILICON SUBSTRATE CARD 2 (40.5% to 48.5%)
      // Turns camera smoothly left towards the rack card
      const p = (scrollProgress - 0.405) / (0.485 - 0.405);
      const camZ = THREE.MathUtils.lerp(5.5, 2.5, p);
      const bell = Math.sin(p * Math.PI);
      const camX = bell * 0.32;
      const lookX = -bell * 1.35;
      const lookZ = THREE.MathUtils.lerp(camZ - 20, 1.0, bell);

      targetPos.set(camX + mouseX * 0.08, 1.35 + mouseY * 0.08, camZ);
      targetLookAt.set(lookX, 1.35, lookZ);

    } else if (scrollProgress <= 0.505) {
      // TRANSITION 2 -> 3: Walking from Rack 2 to Rack 3 (48.5% to 50.5%)
      const p = (scrollProgress - 0.485) / (0.505 - 0.485);
      const camZ = THREE.MathUtils.lerp(2.5, 0.5, p);

      targetPos.set(mouseX * 0.08, 1.35 + mouseY * 0.08, camZ);
      targetLookAt.set(0, 1.35, camZ - 20);

    } else if (scrollProgress <= 0.585) {
      // 7. STATION 3: RACK 3 ON RIGHT (Z = -4.0) -> SILICON SUBSTRATE CARD 3 (50.5% to 58.5%)
      // Turns camera smoothly right towards the rack card
      const p = (scrollProgress - 0.505) / (0.585 - 0.505);
      const camZ = THREE.MathUtils.lerp(0.5, -2.5, p);
      const bell = Math.sin(p * Math.PI);
      const camX = -bell * 0.32;
      const lookX = bell * 1.35;
      const lookZ = THREE.MathUtils.lerp(camZ - 20, -4.0, bell);

      targetPos.set(camX + mouseX * 0.08, 1.35 + mouseY * 0.08, camZ);
      targetLookAt.set(lookX, 1.35, lookZ);

    } else if (scrollProgress <= 0.605) {
      // 8. GLIDING TO MASTER RACK 4 (Z = -9.0) & TURNING TOWARDS CHASSIS (58.5% to 60.5%)
      const p = (scrollProgress - 0.585) / (0.605 - 0.585);
      const camZ = THREE.MathUtils.lerp(-2.2, -9.0, p);
      const camX = THREE.MathUtils.lerp(0.0, -1.0, p);
      const camY = THREE.MathUtils.lerp(1.35, 1.48, p);

      targetPos.set(camX + mouseX * 0.08, camY + mouseY * 0.08, camZ);
      targetLookAt.set(
        THREE.MathUtils.lerp(0.0, -2.4, p),
        THREE.MathUtils.lerp(1.35, 1.34, p),
        -9.0
      );

    } else if (scrollProgress <= 0.620) {
      // 9. GLIDING INSIDE RACK 4 IN FRONT OF MOTHERBOARD (60.5% to 62%)
      const p = (scrollProgress - 0.605) / (0.620 - 0.605);
      const camX = THREE.MathUtils.lerp(-1.0, -2.15, p);
      const camY = THREE.MathUtils.lerp(1.48, 1.46, p);

      targetPos.set(camX + mouseX * 0.03, camY + mouseY * 0.03, -9.0);
      targetLookAt.set(-2.4, 1.34, -9.0);

    } else if (scrollProgress <= 0.700) {
      // 10. SOLID REST STOP: SETTLED INSIDE RACK 4 // SECTOR 4 FULLY ACTIVE (62% to 70%)
      // 224vh of pure scrolling on 2800vh track: peaceful, stationary, unhurried
      targetPos.set(-2.15 + mouseX * 0.03, 1.46 + mouseY * 0.03, -9.0);
      targetLookAt.set(-2.4, 1.34, -9.0);

    } else if (scrollProgress <= 0.715) {
      // 11. STEPPING BACK OUT INTO THE CORRIDOR AISLE (70% to 71.5%)
      const p = (scrollProgress - 0.700) / (0.715 - 0.700);
      const camX = THREE.MathUtils.lerp(-2.15, 0.0, p);
      const camY = THREE.MathUtils.lerp(1.46, 1.35, p);

      targetPos.set(camX + mouseX * 0.08, camY + mouseY * 0.08, -9.0);
      targetLookAt.set(
        THREE.MathUtils.lerp(-2.4, 0.0, p),
        THREE.MathUtils.lerp(1.34, 1.35, p),
        THREE.MathUtils.lerp(-9.0, -34.0, p)
      );

    } else if (scrollProgress <= 0.760) {
      // 12. PROLONGED CINEMATIC WALK DOWN CORRIDOR TOWARDS ROOM (71.5% to 76.0%)
      const p = (scrollProgress - 0.715) / (0.760 - 0.715);
      const s = p * p * (3 - 2 * p); // Smoothstep
      const camZ = THREE.MathUtils.lerp(-9.0, -28.0, s);

      targetPos.set(mouseX * 0.03, 1.35 + mouseY * 0.02, camZ);
      targetLookAt.set(0, 1.20, -34.0);
      targetFov = 48;

    } else if (scrollProgress <= 0.830) {
      // 13 & 14. BUTTER-SMOOTH GLIDE THROUGH GLASS DOORS TO LAPTOP TABLE (76.0% to 83.0%)
      // Continuous cubic spline with zero jerk, zero FOV bounce, zero lookAt snap
      const p = (scrollProgress - 0.760) / (0.830 - 0.760);
      const s = p * p * (3 - 2 * p); // Cubic smoothstep

      const camZ = THREE.MathUtils.lerp(-28.0, -32.25, s);
      const camY = THREE.MathUtils.lerp(1.35, 0.88, s);
      const camX = THREE.MathUtils.lerp(0.0, -0.048, s);

      targetPos.set(camX + mouseX * 0.02, camY + mouseY * 0.015, camZ);
      targetLookAt.set(
        THREE.MathUtils.lerp(0.0, -0.048, s),
        THREE.MathUtils.lerp(1.20, 0.8625, s),
        THREE.MathUtils.lerp(-34.0, -32.887, s)
      );
      targetFov = THREE.MathUtils.lerp(48, 44, s);

    } else if (scrollProgress <= 0.895) {
      // 15. SEATED IN COMFORTABLE WORKING PROXIMITY AT LAPTOP (81.0% to 89.5%)
      // Camera is zoomed in close to the screen (camZ = -32.48, FOV = 40) for crystal-clear readability
      const p = (scrollProgress - 0.810) / (0.895 - 0.810);
      const s = p * p * (3 - 2 * p);
      const camZ = THREE.MathUtils.lerp(-32.25, -32.48, s);
      const camY = THREE.MathUtils.lerp(0.88, 0.868, s);

      targetPos.set(-0.048 + mouseX * 0.01, camY + mouseY * 0.008, camZ);
      targetLookAt.set(-0.048, 0.8625, -32.887);
      targetFov = THREE.MathUtils.lerp(44, 40, s);

    } else {
      // 16. THE DEEP DIVE: ZOOM IN, ZOOM IN, ZOOM IN INTO THE LAPTOP SCREEN (89.5% to 100%)
      // Continuous forward-only zoom straight into the laptop screen (ZERO reverse flight!)
      // FOV narrows to 20° as the screen expands to completely fill 100% of the viewport!
      const p = Math.min(1, (scrollProgress - 0.895) / (0.975 - 0.895));
      const s = p * p * (3 - 2 * p);
      const camZ = THREE.MathUtils.lerp(-32.48, -32.845, s);
      const camY = THREE.MathUtils.lerp(0.868, 0.8625, s);

      targetPos.set(-0.048 + mouseX * 0.004, camY + mouseY * 0.004, camZ);
      targetLookAt.set(-0.048, 0.8625, -33.5);
      targetFov = THREE.MathUtils.lerp(40, 20, s);
    }

    // Aspect-ratio compensation for mobile & tablet portrait screens:
    // When aspect < 1.25, expand vertical FOV so the horizontal view never clips
    const aspectFactor = aspect < 1.25 ? THREE.MathUtils.clamp(1.18 / Math.max(0.42, aspect), 1.0, 1.55) : 1.0;
    const effectiveFov = targetFov * aspectFactor;

    // Smooth FOV interpolation for wide-angle room perspective
    if (Math.abs(currentFov.current - effectiveFov) > 0.05) {
      currentFov.current = THREE.MathUtils.lerp(currentFov.current, effectiveFov, 0.08);
      const persCam = state.camera as THREE.PerspectiveCamera;
      if (persCam.isPerspectiveCamera) {
        persCam.fov = currentFov.current;
        persCam.updateProjectionMatrix();
      }
    }

    // Silky smooth cinematic camera damping
    currentPos.current.lerp(targetPos, 0.08);
    currentLookAt.current.lerp(targetLookAt, 0.08);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
export const World3DCanvas: React.FC<World3DCanvasProps> = ({
  scrollProgress,
  scrollProgressRef,
  onInspectProject,
  onWarmed,
}) => {
  // Celestial sky in clouds, transitions to clean architectural white in datacenter
  const skyBackground =
    scrollProgress < 0.25
      ? 'linear-gradient(180deg, #6B9FD4 0%, #9BC4E6 35%, #FDE4BD 70%, #F8F6F8 100%)'
      : scrollProgress < 0.30
      ? `linear-gradient(180deg, rgba(107,159,212,${Math.max(0, 1 - (scrollProgress - 0.25) / 0.05)}) 0%, #F8F6F8 100%)`
      : scrollProgress > 0.96
      ? 'linear-gradient(180deg, #6B9FD4 0%, #9BC4E6 35%, #FDE4BD 70%, #F8F6F8 100%)'
      : '#F8F6F8';

  // Fixed, rock-solid DPR calibration:
  // Mobile: 1.0 (crisp on high-PPI screens without any buffer resize lag)
  // Desktop: up to 1.75
  // NEVER resizes mid-scroll, completely eliminating scroll stutter!
  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );

  const stableDpr = isMobile ? 1.0 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75);

  return (
    <div
      className="fixed inset-0 w-full h-screen pointer-events-none z-0 overflow-hidden transition-colors duration-500"
      style={{ background: skyBackground }}
    >
      <Canvas
        camera={{ position: [0, 38, 42], fov: 48 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          localClippingEnabled: true
        }}
        dpr={stableDpr}
      >
        {/* Clean Neutral Studio Lighting (NO YELLOW/GOLD TINT OVER CHIP) */}
        <ambientLight intensity={1.2} color="#FFFFFF" />
        <directionalLight
          position={[25, 35, 30]}
          intensity={1.8}
          color="#FFFFFF"
          castShadow={!isMobile}
        />
        <directionalLight
          position={[-15, 20, -15]}
          intensity={0.8}
          color="#F1F5F9"
        />

        {/* Pre-compile all shaders and models into GPU memory during preloader */}
        <SceneWarmer onWarmed={onWarmed} />

        {/* Suspense wrapper for models */}
        <Suspense fallback={null}>
          <CloudsStage scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef} />
          <DatacenterCorridor
            scrollProgress={scrollProgress}
            scrollProgressRef={scrollProgressRef}
            onInspectProject={onInspectProject}
          />
        </Suspense>

        {/* Cinematic Camera Rig */}
        <CameraRig scrollProgress={scrollProgress} scrollProgressRef={scrollProgressRef} />
      </Canvas>

      {/* Persistent HUD Depth Status Monitor - Positioned safely below navbar on mobile */}
      <div className="absolute top-20 sm:top-auto sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 font-label text-[9px] sm:text-[11px] text-titanium/90 tracking-wider sm:tracking-widest pointer-events-none flex items-center gap-2 bg-white/95 px-2.5 sm:px-3.5 py-1 sm:py-1.5 border border-border-subtle rounded-full shadow-md max-w-[90vw] sm:max-w-[85vw] truncate z-20">
        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-sun-gold animate-pulse shrink-0"></span>
        <span className="font-semibold text-obsidian/90 truncate">
          {scrollProgress < 0.085
            ? 'SECTOR_01 // CLOUD STRATOSPHERE [10,000M]'
            : scrollProgress < 0.170
            ? 'SECTOR_02 // STRATOSPHERE DESCENT [APPROACHING FACILITY]'
            : scrollProgress < 0.250
            ? 'SECTOR_02 // AIRLOCK ENTRANCE [BIOMETRIC DOUBLE GATE SEALED]'
            : scrollProgress < 0.300
            ? 'SECTOR_02 // AIRLOCK BREACH [DOUBLE DOORS PARTING // ENTERING]'
            : scrollProgress < 0.385
            ? 'SECTOR_03 // RACK #01 [SILICON: DISTRIBUTED ARCH]'
            : scrollProgress < 0.485
            ? 'SECTOR_03 // RACK #02 [SILICON: MACHINE LEARNING]'
            : scrollProgress < 0.585
            ? 'SECTOR_03 // RACK #03 [SILICON: SYSTEMS & HARDWARE]'
            : scrollProgress < 0.620
            ? 'SECTOR_04 // RACK #04 [OPENING BARE-METAL CHASSIS]'
            : scrollProgress < 0.700
            ? 'SECTOR_04 // BARE-METAL CHIP [AUTHENTIC RED CORE]'
            : scrollProgress < 0.715
            ? 'SECTOR_05 // CORRIDOR RETURN [EXIT AISLE]'
            : scrollProgress < 0.755
            ? 'SECTOR_05 // CORRIDOR ADVANCE [APPROACHING ROOM]'
            : scrollProgress < 0.770
            ? 'SECTOR_05 // ARCHITECT RESIDENCE [SANCTUARY LOUNGE]'
            : scrollProgress < 0.805
            ? 'SECTOR_06 // EXECUTIVE WORKSTATION [APPROACHING LAPTOP]'
            : scrollProgress < 0.875
            ? 'SECTOR_06 // ARCHITECT LOGBOOK [TRANSMISSION ACTIVE]'
            : scrollProgress < 0.895
            ? 'SECTOR_07 // FLIGHT DECK [RUNWAY 01 ACTIVE]'
            : scrollProgress < 0.965
            ? 'SECTOR_07 // AERONAUTIC TAKEOFF [AIRBORNE CLIMB]'
            : 'SECTOR_01 // STRATOSPHERE RE-ENTRY [CONTINUOUS FLIGHT LOOP]'}
        </span>
      </div>
    </div>
  );
};
