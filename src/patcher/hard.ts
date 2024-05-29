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
    private blacklistedFiles: RegExp[] = [/vendor/g];
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
                file.patchedBy.push(patch.plugin);

                if (Array.isArray(patch.replacement))
                    for (let replacement of patch.replacement)
                        file.patched = file.patched.replace(replacement.match, replacement.replace);
                else file.patched = file.patched.replace(patch.replacement.match, patch.replacement.replace);
            }
        }
    }

    async softReload(applyPatches: boolean) {
        this.files = [];

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
    }
}

export { PatchManager };