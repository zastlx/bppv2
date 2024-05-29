import { iPluginManager } from "#types";
import { bppPlugin } from "./plugins";
import getPlugins from "~plugins";
import logger from "#utils/logger";

import { hard as hardPatcher } from "#patcher";
import { Loggable } from "#utils/logger";

class PluginManager extends Loggable implements iPluginManager {
    private plugins: bppPlugin[] = [];
    private inited: boolean = false;

    constructor() {
        super("PluginManager");
    }

    init(): void {
        this.plugins = getPlugins();

        this.log("Initialized");
        this.inited = true;
    }

    enableAll(): void {
        this.plugins.forEach(plugin => plugin.onEnable());
    }

    disableAll(): void {
        this.plugins.forEach(plugin => plugin.onDisable());
    }

    getPlugin(name: string): bppPlugin {
        return this.plugins.find(plugin => plugin.name === name);
    }

    getPlugins(): bppPlugin[] {
        return this.plugins;
    }

    hasInitialized(): boolean {
        return this.inited;
    }
}

export default PluginManager;