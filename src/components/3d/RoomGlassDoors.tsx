'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoomGlassDoorsProps {
  openProgress: number; // 0 (closed) to 1 (fully open)
  scrollProgressRef?: React.MutableRefObject<number>;
  position?: [number, number, number];
}

const getRoomDoorOpenProgress = (scrollProgress: number) => {
  if (scrollProgress < 0.740) return 0;
  if (scrollProgress < 0.755) return (scrollProgress - 0.740) / 0.015;
  return 1;
};

export const RoomGlassDoors: React.FC<RoomGlassDoorsProps> = ({
  openProgress,
  scrollProgressRef,
  position = [0, 0, -29.75],
}) => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  // Slide displacement: each door slides outward by 2.15 meters into the wall pocket
  const slideOffset = openProgress * 2.15;

  const isMobile = typeof window !== 'undefined' && (
    window.innerWidth < 768 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );

  useFrame(() => {
    const liveOpenProgress = scrollProgressRef
      ? getRoomDoorOpenProgress(scrollProgressRef.current)
      : openProgress;
    const liveSlideOffset = liveOpenProgress * 2.15;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = -1.025 - liveSlideOffset;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = 1.025 + liveSlideOffset;
    }
  });

  return (
    <group position={position}>
      {/* 1. SEAMLESS ARCHITECTURAL DOORWAY PORTAL (NO Z-FIGHTING, NO CEILING GAP) */}
      <group position={[0, 0, 0]}>
        {/* Left portal post */}
        <mesh position={[-2.1, 1.47, 0]}>
          <boxGeometry args={[0.2, 2.94, 0.22]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Right portal post */}
        <mesh position={[2.1, 1.47, 0]}>
          <boxGeometry args={[0.2, 2.94, 0.22]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Doorway Header Transom Bar */}
        <mesh position={[0, 2.95, 0]}>
          <boxGeometry args={[4.4, 0.12, 0.22]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Top Bulkhead Seal: Fills space from door top (2.95m) to corridor roof (4.25m) */}
        <mesh position={[0, 3.63, 0]}>
          <boxGeometry args={[4.2, 1.25, 0.2]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.45} metalness={0.2} />
        </mesh>

        {/* Bottom door track */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[4.2, 0.03, 0.14]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Soft overhead portal entry lighting (Desktop only to conserve mobile fillrate) */}
        {!isMobile && (
          <pointLight position={[0, 2.85, 0.3]} color="#E0F2FE" intensity={1.2} distance={4.5} decay={2} />
        )}
      </group>

      {/* 2. LEFT SLIDING GLASS DOOR */}
      <group ref={leftDoorRef} position={[-1.025 - slideOffset, 1.47, 0]}>
        {/* Glass Pane */}
        <mesh>
          <boxGeometry args={[2.05, 2.88, 0.035]} />
          {isMobile ? (
            <meshStandardMaterial
              color="#E0F2FE"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.2}
            />
          ) : (
            <meshPhysicalMaterial
              color="#E0F2FE"
              transparent
              opacity={0.42}
              roughness={0.1}
              metalness={0.15}
              transmission={0.65}
              ior={1.52}
            />
          )}
        </mesh>

        {/* Slim Obsidian Frame */}
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[2.05, 0.04, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.42, 0]}>
          <boxGeometry args={[2.05, 0.04, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.01, 0, 0]}>
          <boxGeometry args={[0.04, 2.88, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.01, 0, 0]}>
          <boxGeometry args={[0.04, 2.88, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Minimalist Vertical Brushed Chrome Handle */}
        <mesh position={[0.82, -0.1, 0.04]}>
          <cylinderGeometry args={[0.014, 0.014, 0.9, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* 3. RIGHT SLIDING GLASS DOOR */}
      <group ref={rightDoorRef} position={[1.025 + slideOffset, 1.47, 0]}>
        {/* Glass Pane */}
        <mesh>
          <boxGeometry args={[2.05, 2.88, 0.035]} />
          {isMobile ? (
            <meshStandardMaterial
              color="#E0F2FE"
              transparent
              opacity={0.35}
              roughness={0.1}
              metalness={0.2}
            />
          ) : (
            <meshPhysicalMaterial
              color="#E0F2FE"
              transparent
              opacity={0.42}
              roughness={0.1}
              metalness={0.15}
              transmission={0.65}
              ior={1.52}
            />
          )}
        </mesh>

        {/* Slim Obsidian Frame */}
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[2.05, 0.04, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.42, 0]}>
          <boxGeometry args={[2.05, 0.04, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.01, 0, 0]}>
          <boxGeometry args={[0.04, 2.88, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.01, 0, 0]}>
          <boxGeometry args={[0.04, 2.88, 0.045]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Minimalist Vertical Brushed Chrome Handle */}
        <mesh position={[-0.82, -0.1, 0.04]}>
          <cylinderGeometry args={[0.014, 0.014, 0.9, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};
