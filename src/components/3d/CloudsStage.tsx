import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clouds, Cloud, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface CloudsStageProps {
  scrollProgress: number; // 0.0 to 1.0
  scrollProgressRef?: React.MutableRefObject<number>;
}

export const CloudsStage: React.FC<CloudsStageProps> = ({ scrollProgress, scrollProgressRef }) => {
  const centralCumulusRef = useRef<THREE.Group>(null);
  const leftBankRef = useRef<THREE.Group>(null);
  const rightBankRef = useRef<THREE.Group>(null);
  const underFloorSeaRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);

  const cloudTexture = useTexture('/textures/cloud.png');

  // Detect mobile device to halve alpha overdraw while preserving cloud volume & fluffiness
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Atmospheric golden sunlight particles (Tier-adapted for mobile fillrate)
  const dustCoords = useMemo(() => {
    const count = isMobile ? 35 : 180;
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
    // Only compute if in the sky / descent zone
    if (currentProgress >= 0.24) return;

    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
    }

    // Clouds parting smoothly during descent (0.0 to 0.17)
    const partProgress = THREE.MathUtils.clamp(currentProgress / 0.17, 0, 1);
    const eased = Math.sin((partProgress * Math.PI) / 2);

    if (centralCumulusRef.current) {
      centralCumulusRef.current.position.y = THREE.MathUtils.lerp(28.0, 8.0, eased);
      centralCumulusRef.current.position.z = THREE.MathUtils.lerp(20.0, 14.0, eased);
    }

    if (leftBankRef.current) {
      leftBankRef.current.position.x = THREE.MathUtils.lerp(-5.0, -22.0, eased);
      leftBankRef.current.position.z = THREE.MathUtils.lerp(22.0, 14.0, eased);
    }

    if (rightBankRef.current) {
      rightBankRef.current.position.x = THREE.MathUtils.lerp(5.0, 22.0, eased);
      rightBankRef.current.position.z = THREE.MathUtils.lerp(22.0, 14.0, eased);
    }

    if (underFloorSeaRef.current) {
      underFloorSeaRef.current.position.y = THREE.MathUtils.lerp(18.0, 4.0, eased);
    }
  });

  // ZERO clouds inside the datacenter facility (only render in the sky / descent phase)
  return (
    <group visible={scrollProgress < 0.22}>
      {/* ========================================================================= */}
      {/* HIGH-ALTITUDE STRATOSPHERE CLOUDS (CONFINED STRICTLY TO EXTERIOR Z >= 14) */}
      {/* ========================================================================= */}
      {isMobile ? (
        <group>
          {/* 1. Main Central Cumulus Billboard (Mobile: zero-overdraw single plane) */}
          <group ref={centralCumulusRef} position={[0, 28.0, 20.0]}>
            <mesh>
              <planeGeometry args={[26, 12]} />
              <meshBasicMaterial map={cloudTexture} transparent opacity={0.88} depthWrite={false} color="#FFFDF8" />
            </mesh>
          </group>

          {/* 2. Flank Left Cloud Bank Billboard */}
          <group ref={leftBankRef} position={[-5.0, 26.0, 22.0]}>
            <mesh>
              <planeGeometry args={[20, 10]} />
              <meshBasicMaterial map={cloudTexture} transparent opacity={0.85} depthWrite={false} color="#FFFFFF" />
            </mesh>
          </group>

          {/* 3. Flank Right Cloud Bank Billboard */}
          <group ref={rightBankRef} position={[5.0, 26.0, 22.0]}>
            <mesh>
              <planeGeometry args={[20, 10]} />
              <meshBasicMaterial map={cloudTexture} transparent opacity={0.85} depthWrite={false} color="#FFFBF0" />
            </mesh>
          </group>

          {/* 4. Lower Sky Cloud Ocean Billboard */}
          <group ref={underFloorSeaRef} position={[0, 18.0, 22.0]}>
            <mesh rotation={[-Math.PI * 0.15, 0, 0]}>
              <planeGeometry args={[36, 14]} />
              <meshBasicMaterial map={cloudTexture} transparent opacity={0.92} depthWrite={false} color="#FFFDF6" />
            </mesh>
          </group>
        </group>
      ) : (
        <Clouds
          limit={150}
          range={150}
          frustumCulled={false}
          material={THREE.MeshLambertMaterial}
          texture="/textures/cloud.png"
        >
          {/* 1. Main Central Cumulus (Greets the user in center view at scroll 0) */}
          <group ref={centralCumulusRef} position={[0, 28.0, 20.0]}>
            <Cloud
              seed={3}
              segments={28}
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
              segments={24}
              bounds={[14, 5, 10]}
              volume={14}
              color="#FFFFFF"
              fade={8}
              opacity={0.93}
              speed={0.1}
            />
          </group>

          {/* 3. Flank Right Cloud Bank (Sunlit Golden) */}
          <group ref={rightBankRef} position={[5.0, 26.0, 22.0]}>
            <Cloud
              seed={11}
              segments={24}
              bounds={[14, 5, 10]}
              volume={14}
              color="#FFFBF0"
              fade={8}
              opacity={0.93}
              speed={0.1}
            />
          </group>

          {/* 4. Lower Sky Cloud Ocean (At Z=22, stays outside the gate at Z=12.5) */}
          <group ref={underFloorSeaRef} position={[0, 18.0, 22.0]}>
            <Cloud
              seed={18}
              segments={30}
              bounds={[36, 6, 16]}
              volume={20}
              color="#FFFDF6"
              fade={8}
              opacity={0.95}
              speed={0.08}
            />
          </group>
        </Clouds>
      )}

      {/* Floating Golden Atmospheric Sunlight Motes */}
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
    </group>
  );
};

// Guarantee Drei preloads the cloud texture during Preloader initialization
useTexture.preload('/textures/cloud.png');
