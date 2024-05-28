interface iPatch {
    find: string;
    all?: boolean;

    noWarn?: boolean;
    replacement: {
        match: RegExp;
        replace: (m, rest) => string;
    }
}

export { iPatch };