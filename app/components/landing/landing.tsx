'use client';

import styles from './style.module.scss';
import Background from './background/background';
import LogoContainer from './logocontainer/logocontainer';
import { LandingProps } from '@/app/utils/types/LandingProps';
import TextContainer from './textcontainer/textcontainer';
import { FluidCursor } from '../fluidcursor/fluidcursor';
import Contact from '../contact/contact';

export default function Landing({ isLoading }: LandingProps) {
    return (
        <div className={styles.landing}>
            <Background />
            <div className={styles.content}>
                <TextContainer isLoading={isLoading}/>
                <LogoContainer/>
            </div>
            <FluidCursor/>
            <Contact/>
        </div>
    );
}