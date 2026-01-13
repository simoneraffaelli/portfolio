import { easeIn } from "framer-motion"

export const textOpacity = {
    initial: {
        opacity: 0
    },
    enter: {
        opacity: 1,
        transition: { duration: 0.6, delay: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { ease: easeIn, duration: 0.3 }
    }
}

export const unblurAndFadeOut = {
    initial: {
        opacity: 1,
        backdropFilter: "blur(10px)",
    },
    exit: {
        opacity: 0,
        backdropFilter: "blur(0px)",
        transition: { ease: easeIn, duration: 0.7 }
    }
}