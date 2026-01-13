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
            intensity={1}
            force={1.1}
            distortion={2}
            curl={5}
            swirl={10}
            fluidColor="#433265"
            rainbow={false}
            backgroundColor="#000000"
            showBackground={false}
            blend={10}
            pressure={0.80}
            densityDissipation={0.96}
            velocityDissipation={1}
            radius={0.5}
            />
        </EffectComposer>
    </Canvas>
    );
}