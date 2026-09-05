import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clouds, Cloud, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface CloudsStageProps {
  scrollProgress: number; // 0.0 to 1.0
  scrollProgressRef?: React.MutableRefObject<number>;
}

export const CloudsStage: React.FC<CloudsStageProps> = ({ scrollProgress, scrollProgressRef }) => {
  const stageGroupRef = useRef<THREE.Group>(null);
  const highStratosphereRef = useRef<THREE.Group>(null);
  const skyAboveDatacenterRef = useRef<THREE.Group>(null);
  const skyHorizonRef = useRef<THREE.Group>(null);
  const leftFlankRef = useRef<THREE.Group>(null);
  const rightFlankRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Detect mobile device
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Atmospheric golden sunlight motes (Desktop only)
  const dustCoords = useMemo(() => {
    const count = isMobile ? 0 : 180;
    if (count === 0) return new Float32Array(0);
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 50;
      coords[i * 3 + 1] = 14 + Math.random() * 32;
      coords[i * 3 + 2] = 14 + (Math.random() - 0.5) * 35;
    }
    return coords;
  }, [isMobile]);

  useFrame((_, delta) => {
    const currentProgress = scrollProgressRef ? scrollProgressRef.current : scrollProgress;
    
    // Clouds remain visible in the sky through descent and outside gate (up to progress 0.26)
    // Hidden once camera breaches deep inside the datacenter corridor (progress >= 0.26)
    const isSkyVisible = currentProgress < 0.26;
    if (stageGroupRef.current) {
      stageGroupRef.current.visible = isSkyVisible;
    }
    if (!isSkyVisible) return;

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
    }

    // Smooth continuous parting and dynamic atmospheric drift
    const partProgress = THREE.MathUtils.clamp(currentProgress / 0.18, 0, 1);
    const eased = Math.sin((partProgress * Math.PI) / 2);

    // 1. High Stratosphere Cloud Deck (Parts and lifts overhead during descent)
    if (highStratosphereRef.current) {
      highStratosphereRef.current.position.y = THREE.MathUtils.lerp(30.0, 36.0, eased);
      highStratosphereRef.current.position.z = THREE.MathUtils.lerp(22.0, 24.0, eased);
    }

    // 2. Towering Cumulus High Above Datacenter (Drifts gently in the upper sky above the gate)
    if (skyAboveDatacenterRef.current) {
      skyAboveDatacenterRef.current.position.x = Math.sin(delta * 0.05) * 0.5;
    }

    // 3. Flanking Cloud Banks (Drift outwards gently during approach)
    if (leftFlankRef.current) {
      leftFlankRef.current.position.x = THREE.MathUtils.lerp(-16.0, -22.0, eased);
    }
    if (rightFlankRef.current) {
      rightFlankRef.current.position.x = THREE.MathUtils.lerp(16.0, 22.0, eased);
    }
  });

  return (
    <group ref={stageGroupRef} visible={scrollProgress < 0.26}>
      {/* ========================================================================= */}
      {/* HIGH-PRECISION REALISTIC 3D VOLUMETRIC CLOUDS (PURE WHITE)                 */}
      {/* Covers both high stratosphere overview AND sky above datacenter & gate     */}
      {/* ========================================================================= */}
      <Clouds
        limit={isMobile ? 96 : 180}
        range={isMobile ? 96 : 180}
        frustumCulled={false}
        material={THREE.MeshLambertMaterial}
        texture="/textures/cloud.png"
      >
        {/* 1. High-Altitude Stratosphere Ceiling (Visible at scroll 0, floats up during descent) */}
        <group ref={highStratosphereRef} position={[0, 30.0, 22.0]}>
          <Cloud
            seed={3}
            segments={isMobile ? 12 : 24}
            bounds={[36, 8, 16]}
            volume={20}
            color="#FFFFFF"
            fade={8}
            opacity={0.95}
            speed={0.10}
          />
        </group>

        {/* 2. Towering Clouds High Above Datacenter Roof (Directly in front of camera at Z = -8, Y = 25) */}
        <group ref={skyAboveDatacenterRef} position={[0, 25.0, -8.0]}>
          <Cloud
            seed={9}
            segments={isMobile ? 14 : 26}
            bounds={[48, 8, 16]}
            volume={22}
            color="#FFFFFF"
            fade={10}
            opacity={0.96}
            speed={0.08}
          />
        </group>

        {/* 3. Distant Horizon Sky Cloud Deck (Visible behind facility in the background sky) */}
        <group ref={skyHorizonRef} position={[0, 20.0, -26.0]}>
          <Cloud
            seed={14}
            segments={isMobile ? 12 : 24}
            bounds={[55, 8, 14]}
            volume={20}
            color="#FFFFFF"
            fade={12}
            opacity={0.92}
            speed={0.06}
          />
        </group>

        {/* 4. Left Flank Atmospheric Cloud Bank (Surrounding entrance gate on left) */}
        <group ref={leftFlankRef} position={[-16.0, 16.0, 5.0]}>
          <Cloud
            seed={21}
            segments={isMobile ? 10 : 20}
            bounds={[18, 6, 14]}
            volume={16}
            color="#FFFFFF"
            fade={8}
            opacity={0.93}
            speed={0.09}
          />
        </group>

        {/* 5. Right Flank Atmospheric Cloud Bank (Surrounding entrance gate on right) */}
        <group ref={rightFlankRef} position={[16.0, 16.0, 5.0]}>
          <Cloud
            seed={27}
            segments={isMobile ? 10 : 20}
            bounds={[18, 6, 14]}
            volume={16}
            color="#FFFFFF"
            fade={8}
            opacity={0.93}
            speed={0.09}
          />
        </group>
      </Clouds>

      {/* Floating Atmospheric Sunlight Motes (Desktop Only) */}
      {!isMobile && (
        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[dustCoords, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.18}
            color="#F5A623"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};

// Guarantee Drei preloads cloud textures during Preloader initialization
useTexture.preload('/textures/cloud.png');
useTexture.preload('/textures/cloud.svg');
