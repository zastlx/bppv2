import { PatchType } from "./shared";
declare const _default: <CallbackType extends Function>(patchType: PatchType) => (funcName: string, funcParent: any, callback: CallbackType, oneTime?: boolean) => () => boolean;
export default _default;
