export const textAnimations = {
    hidden: {
        opacity: 0,
        y: 12,
        filter: "blur(10px)",
        transition: {
            ease: "easeIn", duration: 0.4,
        },
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            ease: "easeIn", duration: 0.4,
        },
    },
};