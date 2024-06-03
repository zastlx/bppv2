import { iPatchReplacement } from "#types/patcher";

const stylePatches: iPatchReplacement[] = [
    ["wrapper", "leaderboard"],
    ["parentHolder", "dashboard"],
    ["container", "chat"]
].map((a) => {
    return {
        match: new RegExp(`const (.{0,4})={${a[0]}:"${a[1]}`),
        replace: `const $1=$self.styles["${a[1]}"]={${a[0]}:"${a[1]}`
    };
});

export { stylePatches };