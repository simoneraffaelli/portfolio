export const textOpacity = {
    initial: {
        opacity: 0
    },
    enter: {
        opacity: 0.75,
        transition: { duration: 0.6, delay: 0.2 }
    },
    exit: {
        opacity: 0,
        transition: { ease: "easeIn", duration: 0.3 }
    }
}

export const unblurAndFadeOut = {
    initial: {
        opacity: .6,
        backdropfilter: "blur(10px)",
    },
    exit: {
        opacity: 0,
        backdropfilter: "blur(0px)",
        transition: { ease: "easeIn", duration: 0.7 }
    }
}