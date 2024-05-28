export type PatchType = "a" | "b" | "i";
export declare const patchTypes: PatchType[];
export type Patch = {
    o: Function;
    a: Map<symbol, Function>;
    b: Map<symbol, Function>;
    i: Map<symbol, Function>;
};
interface PatchedObject {
    [funcName: string]: Patch;
}
export declare const patchedObjects: Map<object, PatchedObject>;
export {};
