export const navigationVariants = {
    standard: {
        button: "bg-secondary text-white border-transparent hover:bg-secondary/90",
        iconColor: "currentColor"
    },
    white: {
        button: "bg-white text-neutral-800 border-neutral-200 shadow-md hover:bg-neutral-50",
        iconColor: "currentColor"
    },
    dark: {
        button: "bg-neutral-800 text-white border-transparent hover:bg-neutral-900",
        iconColor: "currentColor"
    },
    primary: {
        button: "bg-primary text-white border-transparent hover:bg-primary/90",
        iconColor: "currentColor"
    }
};

export const navigationShapes = {
    default: {
        leftWrapper: "left-0",
        rightWrapper: "right-0",
        leftButton: "rounded-r-lg",
        rightButton: "rounded-l-lg"
    },
    round: {
        leftWrapper: "left-4",
        rightWrapper: "right-4",
        leftButton: "rounded-full shadow-md border",
        rightButton: "rounded-full shadow-md border"
    },
    square: {
        leftWrapper: "left-0",
        rightWrapper: "right-0",
        leftButton: "rounded-none border-y border-r",
        rightButton: "rounded-none border-y border-l"
    }
};

export default { variants: navigationVariants, shapes: navigationShapes };
