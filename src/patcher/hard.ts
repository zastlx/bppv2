import { iPatch } from "#types/patcher";
import { Loggable } from "#utils/logger";

interface iFile {
    // Relative path to the file (e.g "./index.random.js")
    path: string;
    // Source code before any patches have been applied
    original: string;
    // Source code after all patches have been applied
    patched: string;
    // Plugins that have patched this file
    patchedBy: string[];
}

class PatchManager extends Loggable {
    private blacklistedFiles: RegExp[] = [];
    private inited = false;
    private allPatches: iPatch[] = [];
    public files: iFile[] = [];

    constructor() {
        super("PatchManager");
    }

    init() {
        this.log("Initialized");
        this.inited = true;
    }

    addFile(file: iFile) {
        this.files.push(file);
    }

    addPatch(patch: iPatch) {
        this.allPatches.push(patch);
    }

    addPatches(patches: iPatch[]) {
        this.allPatches.push(...patches);
    }

    private _applyPatches() {
        for (let file of this.files) {
            file.patched = file.original;

            let patches = this.allPatches.filter(patch => {
                if (patch.find instanceof RegExp) return patch.find.test(file.original);
                else return file.original.includes(patch.find);
            });

            for (let patch of patches) {
                if (!file.patchedBy.includes(patch.plugin)) file.patchedBy.push(patch.plugin);

                if (Array.isArray(patch.replacement))
                    for (let replacement of patch.replacement) {
                        if (replacement.replace instanceof Function) file.patched = file.patched.replace(replacement.match, replacement.replace(file.patched.match(replacement.match)[0], ...file.patched.match(replacement.match).slice(1))).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                        else file.patched = file.patched.replace(replacement.match, replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                    }
                //file.patched = file.patched.replace(replacement.match, replacement.replace.replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`));
                else {
                    if (patch.replacement.replace instanceof Function) file.patched = patch.replacement.replace(file.patched.match(patch.replacement.match)[0], ...file.patched.match(patch.replacement.match).slice(1)).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                    else file.patched = file.patched.replace(patch.replacement.match, patch.replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                }
            }
        }
    }

    async softReload(applyPatches: boolean) {
        this.files = [];
        const reactTooltipStyles = [
            {
                css: ":root{--rt-color-white:#fff;--rt-color-dark:#222;--rt-color-success:#8dc572;--rt-color-error:#be6464;--rt-color-warning:#f0ad4e;--rt-color-info:#337ab7;--rt-opacity:0.9;--rt-transition-show-delay:0.15s;--rt-transition-closing-delay:0.15s}.core-styles-module_tooltip__3vRRp{position:absolute;top:0;left:0;pointer-events:none;opacity:0;will-change:opacity}.core-styles-module_fixed__pcSol{position:fixed}.core-styles-module_arrow__cvMwQ{position:absolute;background:inherit}.core-styles-module_noArrow__xock6{display:none}.core-styles-module_clickable__ZuTTB{pointer-events:auto}.core-styles-module_show__Nt9eE{opacity:var(--rt-opacity);transition:opacity var(--rt-transition-show-delay)ease-out}.core-styles-module_closing__sGnxF{opacity:0;transition:opacity var(--rt-transition-closing-delay)ease-in}",
                type: "core"
            },
            {
                css: ".styles-module_tooltip__mnnfp{padding:8px 16px;border-radius:3px;font-size:90%;width:max-content}.styles-module_arrow__K0L3T{width:8px;height:8px}[class*='react-tooltip__place-top']>.styles-module_arrow__K0L3T{transform:rotate(45deg)}[class*='react-tooltip__place-right']>.styles-module_arrow__K0L3T{transform:rotate(135deg)}[class*='react-tooltip__place-bottom']>.styles-module_arrow__K0L3T{transform:rotate(225deg)}[class*='react-tooltip__place-left']>.styles-module_arrow__K0L3T{transform:rotate(315deg)}.styles-module_dark__xNqje{background:var(--rt-color-dark);color:var(--rt-color-white)}.styles-module_light__Z6W-X{background-color:var(--rt-color-white);color:var(--rt-color-dark)}.styles-module_success__A2AKt{background-color:var(--rt-color-success);color:var(--rt-color-white)}.styles-module_warning__SCK0X{background-color:var(--rt-color-warning);color:var(--rt-color-white)}.styles-module_error__JvumD{background-color:var(--rt-color-error);color:var(--rt-color-white)}.styles-module_info__BWdHW{background-color:var(--rt-color-info);color:var(--rt-color-white)}",
                type: "base"
            }
        ];

        document.open();
        let dom = (new DOMParser()).parseFromString(await (await fetch(document.location.href)).text(), "text/html");
        Array.from(dom.head.getElementsByTagName("link")).filter(a => a.rel === "modulepreload" && !this.blacklistedFiles.some(b => b.test(a.href))).forEach(x => x.remove());

        const scripts = [...dom.head.getElementsByTagName("script")].filter(a => this.blacklistedFiles.every(b => !b.test(a.src))).map(x => x.cloneNode());
        for (let z of scripts) {
            let script = z as HTMLScriptElement;
            if (script.nodeType !== 1) continue;
            if (script.tagName !== "SCRIPT") continue;
            this.addFile({
                path: script.src,
                original: await (await fetch(script.src)).text(),
                patched: "",
                patchedBy: []
            });
        }
        this._applyPatches();
        [...dom.head.children].forEach(x => {
            if (x.tagName === "SCRIPT") x.remove();
        });
        document.write(dom.documentElement.innerHTML);
        document.close();
        for (let x of scripts) {
            let script = x as HTMLScriptElement;
            if (script.nodeType !== 1) continue;
            if (script.tagName !== "SCRIPT") continue;

            const newScript = document.createElement("script");
            newScript.type = "module";
            newScript.async = true;
            newScript.src = applyPatches ? URL.createObjectURL(new Blob([this.files.find((a) => a.path === script.src).patched], { type: "application/javascript" })) : script.src;
            document.head.append(newScript);
        }

        for (let style of reactTooltipStyles) {
            let styleElement = document.createElement("style");
            styleElement.textContent = style.css;
            styleElement.id = `react-tooltip-${style.type}-styles`;
            document.head.append(styleElement);
        }
    }
}

export { PatchManager };