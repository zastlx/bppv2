import { iPlugin, iPatch, iDev } from "#types";
import { Logger } from "#utils/logger";

export abstract class bppPlugin extends Logger implements iPlugin {
    public readonly name: string;
    public readonly version: string;
    public readonly description: string;
    public readonly authors: iDev[];

    public patches: iPatch[];
    public enabled: boolean = false;

    constructor(name: string, version: string = "0.0.1", description: string = "An example plugin", authors?: iDev[]) {
        super(name);

        this.name = name;
        this.version = version;
        this.description = description;
        this.authors = authors;
        this.patches = [];
    }

    addPatch(patch: Omit<iPatch, "plugin">): void {
        this.patches.push({
            ...patch,
            plugin: this.name
        });
    }

    addPatches(patches: Omit<iPatch, "plugin">[]): void {
        const _patches: iPatch[] = patches.map((patch) => ({ ...patch, plugin: this.name }));
        this.patches.push(..._patches);
    }

    onEnable(): void { }
    onDisable(): void { }
}