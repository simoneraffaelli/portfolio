'use client';

import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/Addons.js";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";


useGLTF.preload('text_1.glb');
type GLTFResult = GLTF & {
  nodes: {
    Text: THREE.Mesh
    Text001: THREE.Mesh
    Text002: THREE.Mesh
  }
  materials: {}
}
export default function Logo() {
  const { nodes } = useGLTF('/text_1.glb') as unknown as GLTFResult
  const r = useRef<THREE.Mesh>();

  nodes.Text002.geometry.center();
  nodes.Text001.geometry.center();
  nodes.Text.geometry.center();

  useFrame(() => {
    r?.current?.rotateY(0.002);
  });

  return (
    <>
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text.geometry}
          position={[-0.3, 0, -1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
         <MeshTransmissionMaterial thickness={0.2} roughness={0} transmission={1} ior={1.2} chromaticAberration={0.02} backside />
        </mesh>

        <mesh
          ref={r}
          castShadow
          receiveShadow
          geometry={nodes.Text002.geometry}
          material={nodes.Text002.material}
          position={[0, 0, -1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshTransmissionMaterial thickness={0.2} roughness={0} transmission={1} ior={1.2} chromaticAberration={0.02} backside  />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Text001.geometry}
          material={nodes.Text001.material}
          position={[0.3, 0, -1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <MeshTransmissionMaterial thickness={0.2} roughness={0} transmission={1} ior={1.2} chromaticAberration={0.02} backside />
        </mesh>
        
      </group>
    </>
  );
}