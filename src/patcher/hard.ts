import { iPatch } from "#types/patcher";

export function patchInline(patches: iPatch[], source: string) {
    // since vite doesnt compile down to function expressions, no expression conversion is needed :3
    let code = source;
    
    // attempting to be as faithful as possible to vencord's patcher
    for (let i = 0; i < patches.length; i++) {
        const patch = patches[i];

        const moduleMatches = typeof patches.find === 'string' ?
            code.includes(patch.find as string) : patches.find instanceof RegExp ?
                (patch.find as RegExp).test(code) : false;
        
        if (!moduleMatches) {
            if (!patch.noWarn) {
                console.warn(`[patcher] Could not find ${patch.find}`);
            }
            continue;
        }

        const finder = patch.all ?
            typeof patch.replacement.match === 'string' ?
                new RegExp(patch.replacement.match as string, 'g') :
                patch.replacement.match :
            typeof patch.replacement.match === 'string' ?
                new RegExp(patch.replacement.match as string) :
                patch.replacement.match;
        
        const matches = code.match(finder);
        if (!matches) {
            if (!patch.noWarn) {
                console.warn(`[patcher] Could not find ${patch.replacement.match}`);
            }
            continue;
        }

        code = code.replace(finder, (m, ...rest) => {
            return patch.replacement.replace(m, rest);
        });
    }

    return code;
}