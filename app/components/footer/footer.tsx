import style from './style.module.scss';
import React from 'react'
import Image from 'next/image'
import profilePic from '../../../public/me.jpg'
import Link from 'next/link';

export default function Footer() {
  return (
    <div
      className={`${style.footer} relative h-dvh`}
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
        <div
          className="fixed bottom-0 h-dvh w-full overflow-hidden bg-gradient-to-br from-[#394e7a] via-[#8e9ac7] to-[#4ee] duration-500 ease-in [transition-property:_#394e7a,_#8e9ac7,_#4ee] before:absolute before:left-[20%] before:top-[10%] before:h-[50%] before:w-[70%] before:origin-[60%] before:animate-blob before:rounded-3xl before:bg-gradient-to-br before:from-[#394e7a] before:to-[#8e9ac7] before:blur-[50px] before:brightness-10 after:absolute after:left-[40%] after:top-[30%] after:h-[80%] after:w-[70%] after:origin-[60%] after:animate-blob-reverse after:rounded-3xl after:bg-gradient-to-br after:from-[#394e7a] after:to-[#8e9ac7] after:blur-[50px] after:brightness-10"
        >
          <div className='absolute top-0 h-dvh w-full p-8 flex flex-col gap-2 z-50'>
            <div className='w-full h-3/4 pt-24 flex flex-row gap-6 shrink'>

            <div className={`${style.contactArea} relative rounded-lg h-full w-2/3 z-50 overflow-hidden`}>
              
              <div className='relative top-0 left-0 w-full h-full z-50 flex flex-col justify-between p-4 opacity-80'>
                <p className={style.contactTitle}>Any Question</p>
               <Link href='mailto:simone@raffaelli.me'>
                <p className={style.contactMail}>simone@raffaelli.me</p>
                </Link>
              </div>
            </div>


              
              <div className='rounded-lg bg-white opacity-70 h-full w-1/3 z-50 overflow-hidden'>
                <Image
                  src={profilePic}
                  alt="Picture of the author"
                  
                  sizes="(min-width: 808px) 50vw, 100vw"
                  style={{
                    objectFit: 'cover', // cover, contain, none
                  }}
                />
              </div>
            </div>

            <div className='w-full h-1/4 flex items-end shrink'>
              <p className={style.bottomText}>
                have a nice day
              </p>
            </div>
          </div>
        </div>

    </div>
  )
}