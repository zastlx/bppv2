import { Patch } from './patcher.d';

interface iPlugin {
    name: string;
    description: string;
    version: string;

    authors: Dev[];

    onEnable(): void;
    onDisable(): void;

    patches: Patch[];
}

interface iPluginManager {
    init(): void;

    enableAll(): void;
    disableAll(): void;
    getPlugin(name: string): iPlugin;
    getPlugins(): iPlugin[];
}

export { iPlugin, iPluginManager };