type ReplaceFn = (match: string, ...groups: string[]) => string;

interface iPatchReplacement {
    match: string | RegExp;
    replace: string | ReplaceFn;

}

interface iPatch {
    find: string | RegExp;
    all?: boolean;

    noWarn?: boolean;
    replacement: iPatchReplacement | iPatchReplacement[];
}

export { iPatch, ReplaceFn };