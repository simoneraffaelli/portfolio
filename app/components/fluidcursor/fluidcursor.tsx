import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from '@whatisjery/react-fluid-distortion';

export function FluidCursor() {
    return (
        <Canvas
        style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
        }}>
        <EffectComposer>
            <Fluid 
            showBackground={false}
            rainbow={true}
            fluidColor="#8e4cff"
            intensity={0.3}
            force={1.1}
            distortion={0.4}
            curl={1.9}
            swirl={4}
            backgroundColor="#070410"
            blend={10}
            pressure={0.8}
            densityDissipation={0.96}
            velocityDissipation={1}
            radius={0.3}
            />
        </EffectComposer>
    </Canvas>
    );
}