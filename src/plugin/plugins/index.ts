import { iPlugin, iPatch, iDev } from "#types";
import { Loggable } from "#utils/logger";

export abstract class bppPlugin extends Loggable implements iPlugin {
    public readonly name: string;
    public readonly version: string;
    public readonly description: string;
    public readonly authors: iDev[];

    public patches: iPatch[];

    constructor(name: string, version: string = "0.0.1", description: string = "An example plugin", authors?: iDev[]) {
        super(name);

        this.name = name;
        this.version = version;
        this.description = description;
        this.authors = authors;
        this.patches = [];
    }

    addPatch(patch: iPatch): void {
        this.patches.push(patch);
    }

    abstract onEnable(): void;
    abstract onDisable(): void;
}