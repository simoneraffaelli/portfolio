import Link from 'next/link';
import styles from './style.module.scss';
import { useGlobalContext } from '@/app/utils/contexts/globalcontext';
import { motion, Variants } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowDownLeft } from 'lucide-react';

export default function Contact() {
    const { globalState, editGlobalState } = useGlobalContext(); 

    const variants: Variants = 
        {
            hidden: {
                opacity: 0,
                x: "-100vw",
                transition: { ease: "easeInOut", duration: 0.5 },
                display: 'none'
            },
            visible: {
                opacity: 1,
                x: 0,
                transition: { ease: [0.15, 0.60, 0.2, 1.01], duration: 0.7 },
                display: 'flex'

            },
        };

    return (
        <motion.div className={`${styles.contactContainer}`} 
        initial='hidden'
        variants={variants} 
        animate={globalState.contactButtonState ? 'visible' : 'hidden'}>
            <div className={styles.contactTitleArea}>
                <ArrowDownLeft size={48} onClick={() => editGlobalState()} style={{cursor: 'pointer'}}/>
            </div>
            <div className={styles.contactArea}>
                <p className={styles.contactTitle}>You can reach me at</p>
                <div className={styles.mailArea}>
                    <Link href="mailto:simone@raffaelli.me" className={styles.contactEmail}>
                        simone@raffaelli.me
                    </Link>
                </div>
                <p className={styles.contactText}>Currently based in Italy</p>

                <span>{globalState.contactButtonState}</span>
            </div>
        </motion.div>
    );
}