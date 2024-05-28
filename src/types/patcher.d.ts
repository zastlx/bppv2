interface iPatch {
    find: string | RegExp;
    all?: boolean;

    noWarn?: boolean;
    replacement: {
        match: string | RegExp;
        replace: (m, rest) => string;
    }
}

export { iPatch };