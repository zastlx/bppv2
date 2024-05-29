interface iPatchReplacement {
    match: string | RegExp;
    replace: string;

}

interface iPatch {
    plugin: string;
    find: string | RegExp;
    all?: boolean;

    noWarn?: boolean;
    replacement: iPatchReplacement | iPatchReplacement[];
}

export { iPatch };