import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AirlockGateProps {
  gateOpenProgress: number; // 0.0 (sealed closed) to 1.0 (fully parted open)
  scrollProgressRef?: React.MutableRefObject<number>;
}

const getGateOpenProgress = (scrollProgress: number) => {
  if (scrollProgress < 0.25) return 0;
  if (scrollProgress < 0.30) return (scrollProgress - 0.25) / 0.05;
  return 1;
};

export const AirlockGate: React.FC<AirlockGateProps> = ({ gateOpenProgress, scrollProgressRef }) => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const liveGateOpenProgress = scrollProgressRef
      ? getGateOpenProgress(scrollProgressRef.current)
      : gateOpenProgress;

    // Left door glides from X = -0.62 to X = -2.6 (slides completely clear into bulkhead)
    const targetLeftX = THREE.MathUtils.lerp(-0.62, -2.6, liveGateOpenProgress);
    // Right door glides from X = +0.62 to X = +2.6 (slides completely clear into bulkhead)
    const targetRightX = THREE.MathUtils.lerp(0.62, 2.6, liveGateOpenProgress);

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.lerp(
        leftDoorRef.current.position.x,
        targetLeftX,
        0.12
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.lerp(
        rightDoorRef.current.position.x,
        targetRightX,
        0.12
      );
    }
  });

  const isUnlocked = gateOpenProgress > 0.05;

  return (
    <group position={[0, 0, 12.5]}>
      {/* ========================================================================= */}
      {/* SOLID PERIMETER BULKHEAD ARCH & WALLS                                     */}
      {/* ========================================================================= */}
      {/* Left Wall Bulkhead */}
      <mesh position={[-3.8, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.2, 0.25]} />
        <meshStandardMaterial color="#E8ECEF" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Right Wall Bulkhead */}
      <mesh position={[3.8, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.2, 0.25]} />
        <meshStandardMaterial color="#E8ECEF" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Top Header Lintel Bulkhead above the gate */}
      <mesh position={[0, 3.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.9, 0.28]} />
        <meshStandardMaterial color="#DDE2E7" roughness={0.25} metalness={0.5} />
      </mesh>

      {/* Transom Access Signboard */}
      <group position={[0, 3.6, 0.16]}>
        <mesh>
          <boxGeometry args={[2.4, 0.28, 0.04]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Lintel status indicator line */}
        <mesh position={[0, -0.16, 0.01]}>
          <boxGeometry args={[2.6, 0.02, 0.02]} />
          <meshBasicMaterial color={isUnlocked ? '#10B981' : '#F59E0B'} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* BIOMETRIC AIRLOCK GATE FRAME (PORTAL OPENING: W = 2.4m, H = 3.3m)          */}
      {/* ========================================================================= */}
      {/* Left Frame Post */}
      <mesh position={[-1.3, 1.65, 0.05]} castShadow>
        <boxGeometry args={[0.2, 3.3, 0.2]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Right Frame Post */}
      <mesh position={[1.3, 1.65, 0.05]} castShadow>
        <boxGeometry args={[0.2, 3.3, 0.2]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Top Frame Beam */}
      <mesh position={[0, 3.3, 0.05]}>
        <boxGeometry args={[2.8, 0.15, 0.2]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Floor Threshold Guide Track */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.0, 0.04, 0.3]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ========================================================================= */}
      {/* LEFT SLIDING BI-PARTING DOOR (Glides -X)                                  */}
      {/* ========================================================================= */}
      <group ref={leftDoorRef} position={[-0.62, 1.65, 0]}>
        {/* Door Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.22, 3.15, 0.08]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* High-Performance Frosted Cleanroom Glass Pane */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.98, 2.85]} />
          <meshStandardMaterial
            color="#F1F5F9"
            transparent
            opacity={0.38}
            roughness={0.12}
            metalness={0.1}
          />
        </mesh>

        {/* Vertical Grab Rail Handle */}
        <mesh position={[0.48, 0, 0.06]}>
          <boxGeometry args={[0.04, 1.2, 0.04]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Biometric Status LED Stripe */}
        <mesh position={[0.48, 0.75, 0.06]}>
          <boxGeometry args={[0.025, 0.08, 0.02]} />
          <meshBasicMaterial color={isUnlocked ? '#10B981' : '#EF4444'} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* RIGHT SLIDING BI-PARTING DOOR (Glides +X)                                 */}
      {/* ========================================================================= */}
      <group ref={rightDoorRef} position={[0.62, 1.65, 0]}>
        {/* Door Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.22, 3.15, 0.08]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.7} roughness={0.25} />
        </mesh>

        {/* High-Performance Frosted Cleanroom Glass Pane */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.98, 2.85]} />
          <meshStandardMaterial
            color="#F1F5F9"
            transparent
            opacity={0.38}
            roughness={0.12}
            metalness={0.1}
          />
        </mesh>

        {/* Vertical Grab Rail Handle */}
        <mesh position={[-0.48, 0, 0.06]}>
          <boxGeometry args={[0.04, 1.2, 0.04]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Biometric Status LED Stripe */}
        <mesh position={[-0.48, 0.75, 0.06]}>
          <boxGeometry args={[0.025, 0.08, 0.02]} />
          <meshBasicMaterial color={isUnlocked ? '#10B981' : '#EF4444'} />
        </mesh>
      </group>
    </group>
  );
};
