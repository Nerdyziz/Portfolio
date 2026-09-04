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
  const centralCumulusRef = useRef<THREE.Group>(null);
  const leftBankRef = useRef<THREE.Group>(null);
  const rightBankRef = useRef<THREE.Group>(null);
  const underFloorSeaRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Detect mobile device
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Atmospheric golden sunlight particles (Desktop only: eliminates mobile point sprite overhead)
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
    
    // Clouds remain visible in the sky through descent and outside gate (up to progress 0.24)
    // Only hidden once entering inside the datacenter corridor (progress >= 0.24)
    const isSkyVisible = currentProgress < 0.24;
    if (stageGroupRef.current) {
      stageGroupRef.current.visible = isSkyVisible;
    }
    if (!isSkyVisible) return;

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
    }

    // Clouds parting and lifting smoothly during descent (0.0 to 0.18)
    // Keeps clouds high up in the sky so camera never intersects them and sky above datacenter is full of clouds
    const partProgress = THREE.MathUtils.clamp(currentProgress / 0.18, 0, 1);
    const eased = Math.sin((partProgress * Math.PI) / 2);

    if (centralCumulusRef.current) {
      centralCumulusRef.current.position.y = THREE.MathUtils.lerp(28.0, 32.0, eased);
      centralCumulusRef.current.position.z = THREE.MathUtils.lerp(20.0, 18.0, eased);
    }

    if (leftBankRef.current) {
      leftBankRef.current.position.x = THREE.MathUtils.lerp(-5.0, -18.0, eased);
      leftBankRef.current.position.y = THREE.MathUtils.lerp(26.0, 28.0, eased);
      leftBankRef.current.position.z = THREE.MathUtils.lerp(22.0, 18.0, eased);
    }

    if (rightBankRef.current) {
      rightBankRef.current.position.x = THREE.MathUtils.lerp(5.0, 18.0, eased);
      rightBankRef.current.position.y = THREE.MathUtils.lerp(26.0, 28.0, eased);
      rightBankRef.current.position.z = THREE.MathUtils.lerp(22.0, 18.0, eased);
    }

    if (underFloorSeaRef.current) {
      underFloorSeaRef.current.position.y = THREE.MathUtils.lerp(18.0, 14.0, eased);
      underFloorSeaRef.current.position.z = THREE.MathUtils.lerp(22.0, 20.0, eased);
    }
  });

  return (
    <group ref={stageGroupRef} visible={scrollProgress < 0.24}>
      {/* ========================================================================= */}
      {/* HIGH-ALTITUDE STRATOSPHERE CLOUDS (PURE WHITE, REALISTIC VOLUMETRIC)       */}
      {/* Visible in the sky throughout descent and above datacenter (Z >= 14)       */}
      {/* ========================================================================= */}
      <Clouds
        limit={isMobile ? 64 : 150}
        range={isMobile ? 64 : 150}
        frustumCulled={false}
        material={THREE.MeshLambertMaterial}
        texture="/textures/cloud.png"
      >
        {/* 1. Main Central Cumulus (High sky overview at scroll 0, floats up during descent) */}
        <group ref={centralCumulusRef} position={[0, 28.0, 20.0]}>
          <Cloud
            seed={3}
            segments={isMobile ? 12 : 28}
            bounds={[20, 6, 12]}
            volume={16}
            color="#FFFDF8"
            fade={8}
            opacity={0.95}
            speed={0.12}
          />
        </group>

        {/* 2. Flank Left Cloud Bank */}
        <group ref={leftBankRef} position={[-5.0, 26.0, 22.0]}>
          <Cloud
            seed={7}
            segments={isMobile ? 10 : 24}
            bounds={[14, 5, 10]}
            volume={14}
            color="#FFFFFF"
            fade={8}
            opacity={0.93}
            speed={0.1}
          />
        </group>

        {/* 3. Flank Right Cloud Bank */}
        <group ref={rightBankRef} position={[5.0, 26.0, 22.0]}>
          <Cloud
            seed={11}
            segments={isMobile ? 10 : 24}
            bounds={[14, 5, 10]}
            volume={14}
            color="#FFFDF8"
            fade={8}
            opacity={0.93}
            speed={0.1}
          />
        </group>

        {/* 4. Lower Sky Cloud Ocean (Stays outside the facility in the background sky) */}
        <group ref={underFloorSeaRef} position={[0, 18.0, 22.0]}>
          <Cloud
            seed={18}
            segments={isMobile ? 14 : 30}
            bounds={[36, 6, 16]}
            volume={20}
            color="#FFFDF6"
            fade={8}
            opacity={0.95}
            speed={0.08}
          />
        </group>
      </Clouds>

      {/* Floating Golden Atmospheric Sunlight Motes (Desktop Only) */}
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

// Guarantee Drei preloads the cloud texture during Preloader initialization
useTexture.preload('/textures/cloud.png');
