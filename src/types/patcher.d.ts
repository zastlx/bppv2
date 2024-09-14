export type ReplaceFn = (match: string, ...groups: string[]) => string;

export interface iPatchReplacement {
    match: string | RegExp;
    replace: string | ReplaceFn;
}

export interface iPatch {
    plugin: string;
    find: string | RegExp;
    all?: boolean;

    noWarn?: boolean;
    replacement: iPatchReplacement | iPatchReplacement[];
}