import { Patch } from './patcher.d';

export interface iPlugin {
    name: string;
    description: string;
    version: string;
    enabled: boolean;

    authors: Dev[];

    onEnable(): void;
    onDisable(): void;

    patches: Patch[];
};

export interface iPluginManager {
    init(): void;

    enableAll(): void;
    disableAll(): void;
    enablePlugin(name: string): void;
    disablePlugin(name: string): void;
    togglePlugin(name: string): void;
    getPlugin(name: string): iPlugin;
    getPlugins(): iPlugin[];
};