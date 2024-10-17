'use client';
import { useEffect, useState } from "react";
import Landing from "./components/landing/landing";
import { AnimatePresence } from "framer-motion";
import Preloader from "./components/preloader/Preloader";
import Skill from "./components/skill/skill";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setTimeout( () => {
      setIsLoading(false);
      document.body.style.cursor = 'default'
      window.scrollTo(0,0);
    }, 3000)
  }, []);

  return (
    <main className={`w-dvh overflow-hidden ${isLoading ? 'h-dvh' : ''}`}>
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader />}
      </AnimatePresence>
      <Landing />
      <Skill/>
    </main>
  );
}
