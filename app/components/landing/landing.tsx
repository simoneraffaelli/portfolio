'use client';

import styles from './style.module.scss';
import Background from './background/background';
import TextContainer from './textcontainer/textcontainer';
import { LandingProps } from '@/app/utils/types/LandingProps';

export default function Landing({ isLoading }: LandingProps) {

    return (
        <div className={styles.landing}>
            <Background />
            <TextContainer isLoading={isLoading} />
        </div>
    );
}