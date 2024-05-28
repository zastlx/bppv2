import { PatchType } from "./shared";
export declare function unpatch(funcParent: any, funcName: string, hookId: symbol, type: PatchType): boolean;
export declare function unpatchAll(): void;
