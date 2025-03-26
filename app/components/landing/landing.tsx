'use client';

import styles from './style.module.scss';
import Background from './background/background';
import LogoContainer from './logocontainer/logocontainer';
import { LandingProps } from '@/app/utils/types/LandingProps';
import TextContainer from './textcontainer/textcontainer';
import { FluidCursor } from '../fluidcursor/fluidcursor';
import Contact from '../contact/contact';
import Link from 'next/link';

export default function Landing({ isLoading }: LandingProps) {
    return (
        <div className={styles.landing}>
            <Background />
            <div className={styles.content}>
                <TextContainer isLoading={isLoading}/>
                <LogoContainer/>
                <div className={styles.verticalText}>
                    <Link href={'https://linktr.ee/simone.fyi'} target='_blank'>サイモン</Link>
                </div>
            </div>
            <FluidCursor/>
            <Contact/>
        </div>
    );
}