import { Suspense } from 'react';
import styles from './style.module.scss';

export default function Background() {

    return (
        <div className={styles.bkgContainer}>
            <video 
                className='w-dvw h-dvh'
                no-controls="true"
                autoPlay
                loop
                muted
                preload="none"
                style={{objectFit: "fill", opacity: 0.2}}
                aria-label="Video player">
                <source src="/video_bkg.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
