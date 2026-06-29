export const paginationVariants = {
    standard: {
        active: "bg-transparent h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-primary",
        activeInner: "w-3 h-3 bg-primary rounded-full items-center justify-center",
        inactive: "bg-secondary"
    },
    white: {
        active: "bg-transparent h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-white",
        activeInner: "w-3 h-3 bg-white rounded-full items-center justify-center",
        inactive: "bg-white/40 hover:bg-white/70"
    },
    dark: {
        active: "bg-transparent h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-neutral-800",
        activeInner: "w-3 h-3 bg-neutral-800 rounded-full items-center justify-center",
        inactive: "bg-neutral-400 hover:bg-neutral-600"
    },
    primary: {
        active: "bg-transparent h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-primary",
        activeInner: "w-3 h-3 bg-primary rounded-full items-center justify-center",
        inactive: "bg-primary/40 hover:bg-primary/70"
    }
};

export default paginationVariants;
