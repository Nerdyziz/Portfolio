import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LaptopRunwayExperienceProps {
  scrollProgress: number; // 0.0 to 1.0 (on 2800vh track)
}

export const LaptopRunwayExperience: React.FC<LaptopRunwayExperienceProps> = ({ scrollProgress }) => {
  const { scene: planeScene } = useGLTF('/plane.glb', '/draco/');

  // Clone plane model and remove the giant 491m floor plane
  const planeModel = useMemo(() => {
    const clone = planeScene.clone(true);
    clone.traverse((child) => {
      if (child.name === 'Plane') {
        child.visible = false;
      }
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [planeScene]);

  // Ultra-crisp 2048x2560 Retina dual-screen texture generated ONCE on mount:
  // Top half (y: 0 to 1280): Architect Logbook & Thank You Message
  // Bottom half (y: 1280 to 2560): Aerodrome Runway & Sky
  const canvasTexture = useMemo(() => {
    const isMobileDevice = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
    const canvas = document.createElement('canvas');
    const scaleFactor = isMobileDevice ? 0.5 : 1.0;
    const baseW = 2048;
    const baseH = 2560;
    canvas.width = Math.round(baseW * scaleFactor);
    canvas.height = Math.round(baseH * scaleFactor);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (scaleFactor !== 1.0) {
        ctx.scale(scaleFactor, scaleFactor);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // ==========================================
      // SECTION 1: THE ARCHITECT TERMINAL (0 to 1280)
      // ==========================================
      const termGrad = ctx.createLinearGradient(0, 0, 0, 1280);
      termGrad.addColorStop(0, '#050811');
      termGrad.addColorStop(0.5, '#090E1C');
      termGrad.addColorStop(1, '#070B14');
      ctx.fillStyle = termGrad;
      ctx.fillRect(0, 0, baseW, 1280);

      // Subtle tech grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.lineWidth = 2;
      for (let x = 0; x < baseW; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1280);
        ctx.stroke();
      }
      for (let y = 0; y < 1280; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(baseW, y);
        ctx.stroke();
      }

      // Top Terminal Header Bar (Height 96)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(0, 0, baseW, 96);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 96);
      ctx.lineTo(baseW, 96);
      ctx.stroke();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('[ AETHER // 01 ] ARCHITECT WORKSTATION // LOGBOOK', 50, 60);

      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'right';
      ctx.fillText('STATUS: ONLINE [432Hz]  ●  SYS_ID: ARCH-77', baseW - 50, 60);

      // Terminal Monospace Log Entries
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'left';

      // Line 1: Green sys message
      ctx.fillStyle = '#10B981';
      ctx.fillText('> SYSTEM_CORE: ONLINE  //  TELEMETRY STREAM SYNCHRONIZED', 90, 160);

      // Line 2: Blue info
      ctx.fillStyle = '#38BDF8';
      ctx.fillText('> ARCHITECT_ID: MOHAMMAD HASNAIN RAZA  [SOFTWARE ARCHITECT]', 90, 205);

      // Line 3: Location
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('> LOCATION: BENGALURU, INDIA  //  TIMEZONE: IST (UTC +5:30)', 90, 250);

      // Line 4: System Stack
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText('> CAPABILITIES: DISTRIBUTED SYSTEMS  ●  HIGH-PERF 3D WEB  ●  AI/ML', 90, 295);

      // Line 5: Divider
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 325);
      ctx.lineTo(baseW - 90, 325);
      ctx.stroke();

      // Big Headline: Thank You Message
      ctx.fillStyle = '#F5A623';
      ctx.font = '900 52px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('THANK YOU FOR EXPLORING THE ARCHITECTURE', 1024, 400);

      // Sub-headline
      ctx.fillStyle = '#E2E8F0';
      ctx.font = '500 28px sans-serif';
      ctx.fillText('You have reached the inner sanctum of the creative neural core.', 1024, 445);

      // Philosophy / Architecture Card
      ctx.fillStyle = 'rgba(26, 36, 54, 0.9)';
      ctx.strokeStyle = 'rgba(245, 166, 35, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(180, 480, baseW - 360, 280, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'italic 34px Georgia, serif';
      ctx.fillText('"From the clouds high above down to the sub-micron silicon substrate,', 1024, 565);
      ctx.fillText('every architecture was crafted with precision, purpose, and passion."', 1024, 620);

      ctx.fillStyle = '#F5A623';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('— MOHAMMAD HASNAIN RAZA // ARCHITECT', 1024, 700);

      // Catchy Departure Callout Container
      const calloutGrad = ctx.createLinearGradient(260, 830, baseW - 260, 990);
      calloutGrad.addColorStop(0, 'rgba(245, 166, 35, 0.35)');
      calloutGrad.addColorStop(1, 'rgba(212, 175, 55, 0.22)');
      ctx.fillStyle = calloutGrad;
      ctx.strokeStyle = '#F5A623';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(260, 830, baseW - 520, 160, 36);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 38px monospace';
      ctx.fillText('✈️ ALL SYSTEMS NOMINAL // PREPARING DEPARTURE', 1024, 895);

      ctx.fillStyle = '#FEF08A';
      ctx.font = '900 34px monospace';
      ctx.fillText("LET'S TAKE OFF & GO HOME", 1024, 950);

      // Bottom Scroll Indicator
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 28px monospace';
      ctx.fillText('▼ SCROLL DOWN TO ENGAGE RUNWAY & INITIATE TAKEOFF ▼', 1024, 1140);

      // ==========================================
      // SECTION 2: AERODROME RUNWAY (1280 to 2560)
      // ==========================================
      const rwyTop = 1280;
      const horizonY = rwyTop + 660; // Y = 1940

      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, rwyTop, 0, horizonY);
      skyGrad.addColorStop(0, '#38BDF8');
      skyGrad.addColorStop(0.55, '#BAE6FD');
      skyGrad.addColorStop(0.9, '#FEF08A');
      skyGrad.addColorStop(1, '#FFFBEB');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, rwyTop, baseW, horizonY - rwyTop);

      // Mountain Silhouette
      ctx.fillStyle = '#E0F2FE';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.bezierCurveTo(500, horizonY - 60, 800, horizonY - 30, 1024, horizonY - 20);
      ctx.bezierCurveTo(1300, horizonY - 30, 1600, horizonY - 70, 2048, horizonY);
      ctx.lineTo(2048, horizonY);
      ctx.lineTo(0, horizonY);
      ctx.fill();

      // Aerodrome Tarmac Ground
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, baseH);
      groundGrad.addColorStop(0, '#1E293B');
      groundGrad.addColorStop(1, '#090D16');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, baseW, baseH - horizonY);

      // Runway Trapezoid
      const rwyGrad = ctx.createLinearGradient(0, horizonY, 0, baseH);
      rwyGrad.addColorStop(0, '#334155');
      rwyGrad.addColorStop(1, '#1E293B');
      ctx.fillStyle = rwyGrad;
      ctx.beginPath();
      ctx.moveTo(1024 - 90, horizonY);
      ctx.lineTo(1024 + 90, horizonY);
      ctx.lineTo(1024 + 600, baseH);
      ctx.lineTo(1024 - 600, baseH);
      ctx.closePath();
      ctx.fill();

      // White Runway Edge Lines
      ctx.strokeStyle = '#F8FAFC';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(1024 - 90, horizonY);
      ctx.lineTo(1024 - 590, baseH);
      ctx.moveTo(1024 + 90, horizonY);
      ctx.lineTo(1024 + 590, baseH);
      ctx.stroke();

      // Centerline
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 16;
      ctx.setLineDash([70, 70]);
      ctx.beginPath();
      ctx.moveTo(1024, horizonY);
      ctx.lineTo(1024, baseH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Green Runway Threshold Lights
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const y = horizonY + t * (baseH - horizonY);
        const xL = (1024 - 90) + t * (-500);
        const xR = (1024 + 90) + t * (500);

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(xL - 12, y, 6 + t * 8, 0, Math.PI * 2);
        ctx.arc(xR + 12, y, 6 + t * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Runway Number "01"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 68px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('0 1', 1024, baseH - 50);

      // Top HUD Banner on Runway
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, rwyTop, baseW, 90);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('AETHER FLIGHT DECK // RWY 01-L [TAKEOFF CLEARANCE ACTIVE]', 40, rwyTop + 55);

      ctx.textAlign = 'right';
      ctx.fillText('POWER: 100% // HEADING: 360°', baseW - 40, rwyTop + 55);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.repeat.set(1, 0.5); // Shows half of the canvas at a time
    tex.offset.set(0, 0.5); // Starts on top half (Terminal Message)
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = isMobileDevice ? 4 : 16;
    return tex;
  }, []);

  // Update UV offset per frame:
  // scrollProgress <= 0.845: Terminal Message (offset.y = 0.5)
  // scrollProgress 0.845 to 0.875: Text scrolls UP, Runway scrolls UP into place!
  // scrollProgress >= 0.875: Runway active (offset.y = 0.0)
  useFrame(() => {
    if (!canvasTexture) return;

    if (scrollProgress <= 0.845) {
      canvasTexture.offset.y = 0.5;
    } else if (scrollProgress >= 0.875) {
      canvasTexture.offset.y = 0.0;
    } else {
      const p = (scrollProgress - 0.845) / (0.875 - 0.845);
      const s = p * p * (3 - 2 * p); // Cubic smoothstep
      canvasTexture.offset.y = THREE.MathUtils.lerp(0.5, 0.0, s);
    }
  });

  // Screen power smoothly lighting up using GPU color uniform (ZERO CPU redraw)
  const screenPower = Math.min(1, Math.max(0, (scrollProgress - 0.800) / 0.020));
  const screenColor = useMemo(() => new THREE.Color(screenPower, screenPower, screenPower), [screenPower]);

  // Jet engine glow intensity (ignites when runway is active and takeoff commences)
  const engineGlow = useMemo(() => {
    if (scrollProgress < 0.885) return 0;
    return Math.min(4, (scrollProgress - 0.885) * 50);
  }, [scrollProgress]);

  // Airplane World Transform:
  // Appears ONCE runway has scrolled into place (scrollProgress >= 0.875).
  // Physically moves UP and forward along the runway centerline into the horizon sky!
  const planeWorldTransform = useMemo(() => {
    // Hidden before runway scrolls up
    if (scrollProgress < 0.875) {
      return {
        position: [-0.048, 0.795, -32.865] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        scale: 0,
      };
    }

    // Phase 1: Sitting on runway threshold, engines spooling up (0.875 to 0.895)
    if (scrollProgress <= 0.895) {
      const p = (scrollProgress - 0.875) / (0.895 - 0.875);
      const scale = THREE.MathUtils.lerp(0.0030, 0.0029, p);

      return {
        position: [-0.048, 0.795, -32.865] as [number, number, number],
        rotation: [0, Math.PI, 0] as [number, number, number],
        scale,
      };
    }

    // Phase 2: Full Takeoff Roll & Climb toward Horizon (0.895 to 0.965)
    // Generous 70vh scroll range! Physically moves FORWARD along runway into the sky!
    if (scrollProgress <= 0.965) {
      const p = (scrollProgress - 0.895) / (0.965 - 0.895);

      // Runway roll stage (p < 0.35): accelerates forward along centerline, scaling down
      if (p < 0.35) {
        const rollP = p / 0.35;
        const posY = THREE.MathUtils.lerp(0.795, 0.845, rollP);
        const posZ = THREE.MathUtils.lerp(-32.865, -32.874, rollP);
        const scale = THREE.MathUtils.lerp(0.0029, 0.0018, rollP);
        return {
          position: [-0.048, posY, posZ] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
          scale,
        };
      }

      // Liftoff & Climb stage (0.35 <= p <= 1.0):
      // Nose pitches up (8°), lifts off, ascends into the golden sky above horizon!
      const climbP = (p - 0.35) / 0.65;
      const posY = THREE.MathUtils.lerp(0.845, 0.908, climbP); // Ascends into open sky
      const posZ = THREE.MathUtils.lerp(-32.874, -32.885, climbP);
      const scale = THREE.MathUtils.lerp(0.0018, 0.0006, climbP); // Scales down towards horizon
      const pitchUp = THREE.MathUtils.lerp(0, -0.14, Math.min(climbP * 1.5, 1)); // 8° climb attitude

      return {
        position: [-0.048, posY, posZ] as [number, number, number],
        rotation: [pitchUp, Math.PI, 0] as [number, number, number],
        scale,
      };
    }

    // Phase 3: Soaring into the distant sky (0.965 to 1.00)
    return {
      position: [-0.048, 0.908, -32.885] as [number, number, number],
      rotation: [-0.14, Math.PI, 0] as [number, number, number],
      scale: 0.0005,
    };
  }, [scrollProgress]);

  return (
    <group>
      {/* 1. LAPTOP SCREEN QUAD: EXACT 0.366m x 0.220m FITTING Display.001 WITH 10° TILT */}
      <mesh
        position={[-0.048, 0.8625, -32.887]}
        rotation={[-0.174, 0, 0]}
      >
        <planeGeometry args={[0.366, 0.220]} />
        <meshBasicMaterial
          map={canvasTexture}
          color={screenColor}
          toneMapped={false}
        />
      </mesh>

      {/* Screen soft light: PERMANENTLY MOUNTED (Intensity modulated to prevent hitching) */}
      <pointLight
        position={[-0.048, 0.8625, -32.83]}
        color="#BAE6FD"
        intensity={screenPower * 2.5}
        distance={1.5}
        decay={2}
      />

      {/* 2. THE 3D AIRPLANE (plane.glb) STRAIGHT ON RUNWAY CENTERLINE: PERMANENTLY MOUNTED */}
      <group
        position={planeWorldTransform.position}
        rotation={planeWorldTransform.rotation}
        scale={[planeWorldTransform.scale, planeWorldTransform.scale, planeWorldTransform.scale]}
      >
        <primitive object={planeModel} />

        {/* Jet Engine Glow Lights: PERMANENTLY MOUNTED (Ignites when takeoff commences) */}
        <pointLight position={[-7.5, 2.0, -10.0]} color="#38BDF8" intensity={engineGlow} distance={8} />
        <pointLight position={[7.5, 2.0, -10.0]} color="#38BDF8" intensity={engineGlow} distance={8} />
      </group>
    </group>
  );
};

useGLTF.preload('/plane.glb', '/draco/');
