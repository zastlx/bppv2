import { iPlugin, iPatch, iDev } from "#types";

export abstract class bppPlugin implements iPlugin {
    public readonly name: string;
    public readonly version: string;
    public readonly description: string;
    public readonly authors: iDev[];

    public patches: iPatch[];

    constructor(name: string, version: string = "0.0.1", description: string = "An example plugin", authors?: iDev[]) {
        this.name = name;
        this.version = version;
        this.description = description;
        this.authors = authors;
        this.patches = [];
    }

    abstract onEnable(): void;
    abstract onDisable(): void;
}