'use client';

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

interface LoungeRoomProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const LoungeRoom: React.FC<LoungeRoomProps> = ({
  position = [0, 1.465, -33.13],
  rotation = [0, 0, 0],
}) => {
  const { scene } = useGLTF('/room2.glb', '/draco/');

  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 3D Room 2 Model - Draco compressed 1.6MB with WebP textures */}
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload('/room2.glb', '/draco/');
