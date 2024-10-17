'use client';
import React, { useMemo, useRef } from "react";
import fragmentShader from "./fragmentShader.glsl";
import vertexShader from "./vertexShader.glsl";
import { useFrame } from "@react-three/fiber";
import { BufferGeometry, MathUtils, Mesh, NormalBufferAttributes, Object3DEventMap, ShaderMaterial } from "three";

export default function Blob() {

    const _mesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, ShaderMaterial, Object3DEventMap>>(null);
    const hover = useRef(false);
    const uniforms = useMemo(() => {
        return {
            u_time: { value: 0 },
            u_intensity: { value: 0.3 },
        };
    }, []);

    useFrame((state) => {
        const { clock } = state;
        if (_mesh.current) {
            _mesh.current.material.uniforms.u_time.value =
                0.4 * clock.getElapsedTime();

            _mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
                _mesh.current.material.uniforms.u_intensity.value,
                hover.current ? 1 : 0.25,
                0.02
            );
        }
    });

    return (
        <mesh
            ref={_mesh}
            scale={1.5}
            position={[0, 0, 0]}
            onPointerOver={() => (hover.current = true)}
            onPointerOut={() => (hover.current = false)}
        >
            <icosahedronGeometry args={[2, 20]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
}

