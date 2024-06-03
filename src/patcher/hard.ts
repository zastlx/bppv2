import { iPatch } from "#types/patcher";
import { Loggable } from "#utils/logger";

interface iFile {
    // Relative path to the file (e.g "./index.random.js")
    path: string;
    // Path to the file (blob) after all patches have been applied
    patchedPath: string;
    // Source code before any patches have been applied
    original: string
    // Source code after all patches have been applied
    patched: string
    // Plugins that have patched this file
    patchedBy: string[]
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
        // vendor is always the last file, but patches inside of index rely on the vendor file being patched first, so we reverse the files array
        for (const file of this.files.reverse()) {
            file.patched = file.original;

            const patches = this.allPatches.filter((patch) => {
                if (patch.find instanceof RegExp) return patch.find.test(file.original);
                else return file.original.includes(patch.find);
            });

            for (const patch of patches) {
                if (!file.patchedBy.includes(patch.plugin)) file.patchedBy.push(patch.plugin);

                if (Array.isArray(patch.replacement))
                    for (const replacement of patch.replacement) {
                        if (replacement.replace instanceof Function) file.patched = file.patched.replace(replacement.match, replacement.replace(file.patched.match(replacement.match)[0], ...file.patched.match(replacement.match).slice(1))).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                        else file.patched = file.patched.replace(replacement.match, replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                    }
                // file.patched = file.patched.replace(replacement.match, replacement.replace.replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`));
                else {
                    if (patch.replacement.replace instanceof Function) file.patched = patch.replacement.replace(file.patched.match(patch.replacement.match)[0], ...file.patched.match(patch.replacement.match).slice(1)).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                    else file.patched = file.patched.replace(patch.replacement.match, patch.replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
                }
            }
            file.patchedPath = URL.createObjectURL(new Blob([`// ${file.path.replace(`${location.origin}/`, "")} ${file.patchedBy.length > 0 ? `- Patched By ${file.patchedBy.join(", ")}` : ""}\n`, file.patched], { type: "application/javascript" }));
        }
    }

    async softReload(applyPatches: boolean) {
        this.files = [];
        document.open();
        const dom = (new DOMParser()).parseFromString(await (await fetch(document.location.href)).text(), "text/html");
        Array.from(dom.head.getElementsByTagName("link")).filter((a) => a.rel === "modulepreload" && !this.blacklistedFiles.some((b) => b.test(a.href))).forEach((x) => x.remove());

        const scripts = [...dom.head.getElementsByTagName("script")].filter((a) => this.blacklistedFiles.every((b) => !b.test(a.src))).map((x) => x.cloneNode());
        for (const z of scripts) {
            const script = z as HTMLScriptElement;
            if (script.nodeType !== 1) continue;
            if (script.tagName !== "SCRIPT") continue;
            const file = {
                path: script.src,
                original: await (await fetch(script.src)).text(),
                patched: "",
                patchedBy: [],
                patchedPath: ""
            };
            this.addFile(file);
            if (script.src.match(/index/g)) this.addFile({
                path: `${location.origin}/vendor.${file.original.match(/from".\/vendor.(.{0,10}).js"/)[1]}.js`,
                original: await (await fetch(`${location.origin}/vendor.${file.original.match(/from".\/vendor.(.{0,10}).js"/)[1]}.js`)).text(),
                patched: "",
                patchedBy: [],
                patchedPath: ""
            });
        }
        this._applyPatches();
        [...dom.head.children].forEach((x) => {
            if (x.tagName === "SCRIPT") x.remove();
        });
        document.write(dom.documentElement.innerHTML);
        document.close();
        const style = document.createElement("style");
        // css is added on compile-time via build script
        style.innerHTML = "CSS_HERE";
        document.head.append(style);
        for (const x of scripts) {
            const script = x as HTMLScriptElement;
            if (script.nodeType !== 1) continue;
            if (script.tagName !== "SCRIPT") continue;

            const newScript = document.createElement("script");
            newScript.type = "module";
            newScript.async = true;
            newScript.src = applyPatches ? this.files.find((file) => file.path === script.src).patchedPath : script.src;
            document.head.append(newScript);
        }
    }
}

export { PatchManager };