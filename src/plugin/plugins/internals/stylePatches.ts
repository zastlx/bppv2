import { iPatchReplacement } from "#types/patcher";

const stylePatches: iPatchReplacement[] = [
    ["wrapper", "leaderboard"],
    ["parentHolder", "dashboard"]
].map((patch) => {
    return {
        match: new RegExp(`const (.{0,4})={${patch[0]}:"${patch[1]}`),
        replace: `const $1=$self.styles["${patch[1]}"]={${patch[0]}:"${patch[1]}`
    };
});

export { stylePatches };