import { Variant } from "framer-motion";

export type AnimatedTextProps = {
    text: string | string[];
    className?: string;
    trigger: boolean;
    synchedIndex?: number;
    animation?: {
        hidden: Variant;
        visible: Variant;
    };
};