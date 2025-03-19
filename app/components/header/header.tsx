'use client';
import Link from 'next/link';
import styles from './style.module.scss';
import { useContext } from 'react';
import { GlobalContext } from '@/app/utils/contexts/globalcontext';

export default function Header() {
    const { editGlobalState } = useContext(GlobalContext);

    return (
        <div className={styles.header}>
            <Link href='/'>
                <p className={styles.logo}>[Ә]</p>
            </Link>

            <div className={styles.links}>
                    <p className={styles.link} style={{cursor: 'pointer'}} onClick={() => editGlobalState()}>CONTACT</p>
                <p className={styles.linkSeparator}> / </p>
                <Link href='https://github.com/simoneraffaelli' target='_blank'>
                    <p className={styles.link}>GH</p>
                </Link>
                <p className={styles.linkSeparator}> / </p>
                <Link href='https://bsky.app/profile/simone.fyi' target='_blank'>
                    <p className={styles.link}>BSKY</p>
                </Link>
            </div>
        </div>
    );
}