'use client';
import Link from 'next/link';
import styles from './style.module.scss';

export default function Header() {

    return (
        <div className={styles.header}>
            <Link href='/'>
                <p className={styles.logo}>[Ә]</p>
            </Link>
        </div>
    );
}