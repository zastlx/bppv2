import getPatchFunc from "./getPatchFunc.js";
import { unpatchAll } from "./unpatch.js";
const before = getPatchFunc("b");
const instead = getPatchFunc("i");
const after = getPatchFunc("a");
export { instead, before, after, unpatchAll };
