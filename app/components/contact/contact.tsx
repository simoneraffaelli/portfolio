import Link from 'next/link';
import styles from './style.module.scss';
import { useGlobalContext } from '@/app/utils/contexts/globalcontext';
import { motion, Variants } from 'framer-motion';
import { ArrowDownLeft } from 'lucide-react';

export default function Contact() {
    const { globalState, editGlobalState } = useGlobalContext(); 

    const variants: Variants = 
        {
            hidden: {
                opacity: 0,
                x: "-100vw",
                transition: { 
                    ease: [0.76, 0, 0.24, 1],
                    duration: 0.5,
                },
                display: 'none'
            },
            visible: {
                opacity: 1,
                x: 0,
                transition: { 
                    ease: [0.76, 0, 0.24, 1],
                    duration: 0.7,
                },
                display: 'flex'

            },
        };

        const contactAreaVariants: Variants = 
        {
            hidden: {
                opacity: 0,
                x: "-10%",
                transition: { ease: [0.76, 0, 0.24, 1], duration: 0.2 },
            },
            visible: {
                opacity: 1,
                x: 0,
                transition: { 
                    ease: [0.76, 0, 0.24, 1],
                    duration: 1,
                    delay: 0.7,
                    type: 'spring',
                },

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
            <motion.div className={styles.contactArea}
            variants={contactAreaVariants}
            animate={globalState.contactButtonState ? 'visible' : 'hidden'}>
                <p className={styles.contactTitle}>You can reach me at</p>
                <div className={styles.mailArea}>
                    <Link href="mailto:ciao@simone.ooo" className={styles.contactEmail}>
                        ciao@simone.ooo
                    </Link>
                </div>
                <p className={styles.contactText}>Currently based in Italy</p>

                <span>{globalState.contactButtonState}</span>
            </motion.div>
        </motion.div>
    );
}