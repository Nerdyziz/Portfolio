import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Server, Brain, Cpu } from 'lucide-react';
import { AirlockGate } from './AirlockGate';
import { LoungeRoom } from './LoungeRoom';
import { RoomGlassDoors } from './RoomGlassDoors';
import { LaptopRunwayExperience } from './LaptopRunwayExperience';
import { SkillCategory, Project } from '../../types';
import { skillCategories } from '../../data/portfolioData';
import { soundEngine } from '../../utils/audio';

interface DatacenterCorridorProps {
  scrollProgress: number; // 0.0 to 1.0
  onInspectProject?: (project: Project) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Server: <Server className="w-4 h-4 text-sun-gold" />,
  Brain: <Brain className="w-4 h-4 text-sun-gold" />,
  Cpu: <Cpu className="w-4 h-4 text-sun-gold" />
};

// Single animated rack with a hinged glass door and an embedded Silicon Substrate card
function RackWithDoor({
  position,
  rotation,
  rackTemplate,
  doorAngle = 0,
  cardOpacity = 0,
  skillData,
  isLeft = false,
  children
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  rackTemplate: THREE.Group;
  doorAngle: number;
  cardOpacity?: number;
  skillData?: SkillCategory;
  isLeft?: boolean;
  children?: React.ReactNode;
}) {
  const hingeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (hingeRef.current) {
      const targetAngle = isLeft ? -doorAngle : doorAngle;
      hingeRef.current.rotation.y = THREE.MathUtils.lerp(
        hingeRef.current.rotation.y,
        targetAngle,
        0.14
      );
    }
  });

  // Near-corner hinge: placed on the side facing oncoming viewer (+Z in world)
  const hingeX = isLeft ? -0.58 : 0.58;
  const doorX = isLeft ? 0.58 : -0.58;
  const handleX = isLeft ? 0.46 : -0.46;

  return (
    <group position={position} rotation={rotation}>
      {/* Rack Chassis Frame from data_center_rack.glb */}
      <primitive object={rackTemplate} />

      {/* Near-corner hinge: swings door out into aisle facing oncoming camera (+Z) */}
      <group ref={hingeRef} position={[hingeX, 0, 0.44]}>
        <group position={[doorX, 1.15, 0]}>
          {/* Titanium perimeter frame */}
          <mesh castShadow>
            <boxGeometry args={[1.14, 2.26, 0.04]} />
            <meshStandardMaterial
              color="#E2E5EA"
              metalness={0.75}
              roughness={0.25}
            />
          </mesh>

          {/* Tempered frosted cleanroom glass pane */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[0.92, 2.0]} />
            <meshStandardMaterial
              color="#F1F5F9"
              transparent
              opacity={0.38}
              roughness={0.12}
              metalness={0.1}
            />
          </mesh>

          {/* Door Handle on swinging edge */}
          <mesh position={[handleX, 0, 0.035]}>
            <boxGeometry args={[0.03, 0.5, 0.03]} />
            <meshStandardMaterial
              color="#CBD5E1"
              metalness={0.85}
              roughness={0.2}
            />
          </mesh>

          {/* Latch Status LED */}
          <mesh position={[handleX, 0.32, 0.03]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshBasicMaterial
              color={doorAngle > 0.1 ? '#10B981' : '#64748B'}
            />
          </mesh>

          {/* SILICON SUBSTRATE CARD EMBEDDED ON 3D GLASS DOOR */}
          {skillData && cardOpacity > 0.01 && (
            <Html
              transform
              position={[isLeft ? 0.05 : -0.05, 0, 0.03]}
              distanceFactor={1.55}
              style={{
                width: '250px',
                pointerEvents: cardOpacity > 0.1 ? 'auto' : 'none',
                userSelect: 'none',
                opacity: cardOpacity,
                transition: 'opacity 0.2s ease-out'
              }}
            >
              <div
                onMouseEnter={() => soundEngine.playClick(950)}
                className="glass-panel p-4 rounded-2xl bg-white/95 shadow-2xl border border-border-gold/40 text-obsidian"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded-md bg-alabaster border border-border-subtle">
                      {iconMap[skillData.iconName] || <Cpu className="w-3.5 h-3.5 text-sun-gold" />}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-titanium">
                      [SILICON_{skillData.id.toUpperCase()}]
                    </span>
                  </div>
                  <span className="font-label text-[9px] text-emerald-700 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base font-bold text-obsidian mb-2.5 leading-snug">
                  {skillData.title}
                </h3>

                {/* Skill List */}
                <ul className="space-y-1.5 mb-3.5">
                  {skillData.skills.map((skill, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 font-mono text-[11px] text-titanium font-medium"
                    >
                      <span className="w-1.5 h-1.5 bg-sun-gold rounded-full shrink-0"></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>

                {/* Mastery Level Indicator */}
                <div className="pt-2.5 border-t border-border-subtle">
                  <div className="flex justify-between items-center text-[10px] font-label text-titanium mb-1.5">
                    <span>HARDWARE_MASTERY</span>
                    <span className="text-sun-gold font-bold">{skillData.level} / 5</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 h-1.5">
                    {[1, 2, 3, 4, 5].map((seg) => (
                      <div
                        key={seg}
                        className={`h-full rounded-xs transition-all duration-300 ${
                          seg <= skillData.level
                            ? 'bg-sun-gold shadow-[0_0_6px_rgba(245,166,35,0.6)]'
                            : 'bg-border-subtle'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* Interior contents (Motherboard inside chassis shelf) */}
      {children}
    </group>
  );
}

export const DatacenterCorridor: React.FC<DatacenterCorridorProps> = ({
  scrollProgress
}) => {
  // Mobile detection for lighting and draw-call optimization
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Load 3D models from /public immediately on page load with local Draco decoder
  const rackGLTF = useGLTF('/data_center_rack.glb', '/draco/');
  const motherBoardGLTF = useGLTF('/MotherBoard.glb', '/draco/');

  // Prepare Rack templates: ALL racks use the EXACT SAME consistent data_center_rack.glb model!
  const rackR1 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const rackL2 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const rackR3 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const rackL4 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);

  // Static closed opposite racks
  const staticL1 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const staticR2 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const staticL3 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);
  const staticR4 = useMemo(() => rackGLTF.scene.clone(true), [rackGLTF.scene]);

  // Untouched MotherBoard.glb with authentic RED chip preserved
  const motherBoardModel = useMemo(() => {
    const clone = motherBoardGLTF.scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [motherBoardGLTF.scene]);

  // =========================================================================
  // 1. AIRLOCK DOUBLE GATE TIMING (Z = 12.5)
  // Sealed when descending (0.0 -> 0.25). Parts open at 0.25 -> 0.30!
  // =========================================================================
  const gateOpenProgress = (() => {
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress >= 0.25 && scrollProgress < 0.30) {
      return (scrollProgress - 0.25) / 0.05;
    }
    return 1;
  })();

  // =========================================================================
  // 2. STATION 1: RACK 1 ON RIGHT (Z = 6.0) -> SILICON CARD 1 (DISTRIBUTED ARCH)
  // =========================================================================
  const door1Angle = (() => {
    if (scrollProgress < 0.31) return 0;
    if (scrollProgress >= 0.31 && scrollProgress < 0.33) {
      return ((scrollProgress - 0.31) / 0.02) * (Math.PI * 0.44);
    }
    if (scrollProgress >= 0.33 && scrollProgress <= 0.37) {
      return Math.PI * 0.44;
    }
    if (scrollProgress > 0.37 && scrollProgress <= 0.39) {
      return (1 - (scrollProgress - 0.37) / 0.02) * (Math.PI * 0.44);
    }
    return 0;
  })();

  const card1Opacity = (() => {
    if (scrollProgress < 0.32 || scrollProgress > 0.38) return 0;
    if (scrollProgress >= 0.32 && scrollProgress < 0.335) {
      return (scrollProgress - 0.32) / 0.015;
    }
    if (scrollProgress >= 0.335 && scrollProgress <= 0.365) {
      return 1;
    }
    if (scrollProgress > 0.365 && scrollProgress <= 0.38) {
      return 1 - (scrollProgress - 0.365) / 0.015;
    }
    return 0;
  })();

  // =========================================================================
  // 3. STATION 2: RACK 2 ON LEFT (Z = 1.0) -> SILICON CARD 2 (MACHINE LEARNING)
  // =========================================================================
  const door2Angle = (() => {
    if (scrollProgress < 0.41) return 0;
    if (scrollProgress >= 0.41 && scrollProgress < 0.43) {
      return ((scrollProgress - 0.41) / 0.02) * (Math.PI * 0.44);
    }
    if (scrollProgress >= 0.43 && scrollProgress <= 0.47) {
      return Math.PI * 0.44;
    }
    if (scrollProgress > 0.47 && scrollProgress <= 0.49) {
      return (1 - (scrollProgress - 0.47) / 0.02) * (Math.PI * 0.44);
    }
    return 0;
  })();

  const card2Opacity = (() => {
    if (scrollProgress < 0.42 || scrollProgress > 0.48) return 0;
    if (scrollProgress >= 0.42 && scrollProgress < 0.435) {
      return (scrollProgress - 0.42) / 0.015;
    }
    if (scrollProgress >= 0.435 && scrollProgress <= 0.465) {
      return 1;
    }
    if (scrollProgress > 0.465 && scrollProgress <= 0.48) {
      return 1 - (scrollProgress - 0.465) / 0.015;
    }
    return 0;
  })();

  // =========================================================================
  // 4. STATION 3: RACK 3 ON RIGHT (Z = -4.0) -> SILICON CARD 3 (SYSTEMS / HARDWARE)
  // =========================================================================
  const door3Angle = (() => {
    if (scrollProgress < 0.51) return 0;
    if (scrollProgress >= 0.51 && scrollProgress < 0.53) {
      return ((scrollProgress - 0.51) / 0.02) * (Math.PI * 0.44);
    }
    if (scrollProgress >= 0.53 && scrollProgress <= 0.57) {
      return Math.PI * 0.44;
    }
    if (scrollProgress > 0.57 && scrollProgress <= 0.59) {
      return (1 - (scrollProgress - 0.57) / 0.02) * (Math.PI * 0.44);
    }
    return 0;
  })();

  const card3Opacity = (() => {
    if (scrollProgress < 0.52 || scrollProgress > 0.58) return 0;
    if (scrollProgress >= 0.52 && scrollProgress < 0.535) {
      return (scrollProgress - 0.52) / 0.015;
    }
    if (scrollProgress >= 0.535 && scrollProgress <= 0.565) {
      return 1;
    }
    if (scrollProgress > 0.565 && scrollProgress <= 0.58) {
      return 1 - (scrollProgress - 0.565) / 0.015;
    }
    return 0;
  })();

  // =========================================================================
  // 5. STATION 4: FINAL MASTER RACK 4 ON LEFT (Z = -9.0) -> OPENS TO MOTHERBOARD
  // Stays open throughout Neural Core rest stop (0.62 -> 0.70)
  // =========================================================================
  const door4Angle = (() => {
    if (scrollProgress < 0.60) return 0;
    if (scrollProgress >= 0.60 && scrollProgress < 0.62) {
      return ((scrollProgress - 0.60) / 0.02) * (Math.PI * 0.55);
    }
    if (scrollProgress >= 0.62 && scrollProgress <= 0.70) {
      return Math.PI * 0.55;
    }
    if (scrollProgress > 0.70 && scrollProgress <= 0.71) {
      return (1 - (scrollProgress - 0.70) / 0.01) * (Math.PI * 0.55);
    }
    return 0;
  })();

  // =========================================================================
  // 6. ROOM SLIDING DOUBLE GLASS DOORS AT Z = -29.75
  // As the camera glides down the corridor and approaches (0.740 -> 0.755), doors part open!
  // =========================================================================
  const roomGlassDoorOpenProgress = (() => {
    if (scrollProgress < 0.740) return 0;
    if (scrollProgress >= 0.740 && scrollProgress < 0.755) {
      return (scrollProgress - 0.740) / 0.015;
    }
    return 1;
  })();

  return (
    <group position={[0, 0, 0]}>
      {/* Solid Architectural Facility Roof (Confined strictly to interior Z <= 12.5) */}
      <mesh position={[0, 4.25, -8.75]}>
        <boxGeometry args={[9.3, 0.2, 42.5]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Interior Left Cleanroom Wall */}
      <mesh position={[-4.5, 2.1, -8.75]}>
        <boxGeometry args={[0.3, 4.2, 42.5]} />
        <meshStandardMaterial color="#E8ECEF" roughness={0.5} />
      </mesh>

      {/* Interior Right Cleanroom Wall */}
      <mesh position={[4.5, 2.1, -8.75]}>
        <boxGeometry args={[0.3, 4.2, 42.5]} />
        <meshStandardMaterial color="#E8ECEF" roughness={0.5} />
      </mesh>

      {/* Cleanroom Floor (Confined strictly to interior Z <= 12.5) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8.75]} receiveShadow>
        <planeGeometry args={[9, 42.5]} />
        <meshStandardMaterial
          color="#F5F5F7"
          roughness={0.16}
          metalness={0.08}
        />
      </mesh>

      {/* Overhead architectural linear LED skylight panels inside the corridor */}
      {[-24, -16, -8, 0, 8].map((z, idx) => {
        // Keep all 5 emissive lightboxes rendered visually; on mobile activate 3 lights to avoid multi-pass shading stalls
        const hasPointLight = !isMobile || idx % 2 === 0;
        return (
          <group key={idx} position={[0, 4.18, z]}>
            <mesh>
              <boxGeometry args={[1.8, 0.02, 4.5]} />
              <meshBasicMaterial color="#FFFFFF" />
            </mesh>
            {hasPointLight && (
              <pointLight
                color="#FFFFFF"
                intensity={isMobile ? 1.2 : 0.9}
                distance={isMobile ? 10 : 8}
                decay={2}
              />
            )}
          </group>
        );
      })}

      {/* 5. ARCHITECTURAL END-CAP WALLS AT Z = -29.8 */}
      <group position={[0, 0, -29.8]}>
        {/* Left end-cap corridor wall */}
        <mesh position={[-3.35, 2.1, 0]}>
          <boxGeometry args={[2.3, 4.2, 0.2]} />
          <meshStandardMaterial color="#E8ECEF" roughness={0.5} />
        </mesh>
        {/* Right end-cap corridor wall */}
        <mesh position={[3.35, 2.1, 0]}>
          <boxGeometry args={[2.3, 4.2, 0.2]} />
          <meshStandardMaterial color="#E8ECEF" roughness={0.5} />
        </mesh>
      </group>

      {/* 6. SLIDING DOUBLE GLASS DOORS & INTEGRATED PORTAL AT Z = -29.75 */}
      <RoomGlassDoors openProgress={roomGlassDoorOpenProgress} position={[0, 0, -29.75]} />

      {/* THE MODERN ARCHITECT ROOM 2 (room2.glb) - Pre-compiled during preloader */}
      <LoungeRoom position={[0, 1.465, -33.13]} />

      {/* 7. LAPTOP RUNWAY & AIRPLANE TAKEOFF EXPERIENCE - Pre-compiled during preloader */}
      <LaptopRunwayExperience scrollProgress={scrollProgress} />

      {/* 2-WAY DOUBLE AIRLOCK ENTRANCE GATE AT Z = 12.5 */}
      <AirlockGate gateOpenProgress={gateOpenProgress} />

      {/* ROW 1 (z = 6.0): RACK 1 ON RIGHT -> SILICON SUBSTRATE CARD 1 (DISTRIBUTED ARCH) */}
      <RackWithDoor
        position={[2.4, 0, 6]}
        rotation={[0, -Math.PI / 2, 0]}
        rackTemplate={rackR1}
        doorAngle={door1Angle}
        cardOpacity={card1Opacity}
        skillData={skillCategories[0]} // DISTRIBUTED ARCH
        isLeft={false}
      />
      <group position={[-2.4, 0, 6]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={staticL1} />
      </group>

      {/* ROW 2 (z = 1.0): RACK 2 ON LEFT -> SILICON SUBSTRATE CARD 2 (MACHINE LEARNING) */}
      <RackWithDoor
        position={[-2.4, 0, 1]}
        rotation={[0, Math.PI / 2, 0]}
        rackTemplate={rackL2}
        doorAngle={door2Angle}
        cardOpacity={card2Opacity}
        skillData={skillCategories[1]} // MACHINE LEARNING
        isLeft={true}
      />
      <group position={[2.4, 0, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={staticR2} />
      </group>

      {/* ROW 3 (z = -4.0): RACK 3 ON RIGHT -> SILICON SUBSTRATE CARD 3 (SYSTEMS / HARDWARE) */}
      <RackWithDoor
        position={[2.4, 0, -4]}
        rotation={[0, -Math.PI / 2, 0]}
        rackTemplate={rackR3}
        doorAngle={door3Angle}
        cardOpacity={card3Opacity}
        skillData={skillCategories[2]} // SYSTEMS / HARDWARE
        isLeft={false}
      />
      <group position={[-2.4, 0, -4]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={staticL3} />
      </group>

      {/* ROW 4 (z = -9.0): FINAL MASTER RACK 4 ON LEFT (EXACT SAME MODEL AS ALL OTHER DECKS) */}
      <RackWithDoor
        position={[-2.4, 0, -9]}
        rotation={[0, Math.PI / 2, 0]}
        rackTemplate={rackL4}
        doorAngle={door4Angle}
        isLeft={true}
      >
        {/* MotherBoard.glb placed strictly inside the datacenter deck chassis shelf - Pre-compiled during preloader */}
        <group position={[0, 1.25, 0]}>
          <group scale={[0.065, 0.065, 0.065]}>
            <primitive object={motherBoardModel} />
          </group>

          {/* Clean Neutral Studio Lighting directly over Motherboard (PURE RED CHIP) */}
          <pointLight
            position={[0, 0.6, 0]}
            color="#FFFFFF"
            intensity={4.5}
            distance={3.5}
            decay={2}
          />
          <directionalLight
            position={[0.5, 2.0, 0.5]}
            color="#FFFFFF"
            intensity={2.5}
          />
        </group>
      </RackWithDoor>
      <group position={[2.4, 0, -9]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={staticR4} />
      </group>
    </group>
  );
};

useGLTF.preload('/data_center_rack.glb', '/draco/');
useGLTF.preload('/MotherBoard.glb', '/draco/');
