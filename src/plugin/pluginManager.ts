import { iPluginManager } from "#types";
import { Logger } from "#utils/logger";
import { bppPlugin } from "./plugins";
import getPlugins from "~plugins";

class PluginManager extends Logger implements iPluginManager {
    private plugins: bppPlugin[] = [];
    public pluginList: {
        [name: string]: bppPlugin
    } = {};
    private inited: boolean = false;

    constructor() {
        super("PluginManager", "#F5A9B8");
    }

    init(): void {
        this.plugins = getPlugins();
        this.pluginList = this.plugins.reduce((a, b) => (a[b.name] = b, a), {});

        this.info("Initialized");
        this.inited = true;
    }

    enableAll(): void {
        this.plugins.forEach((plugin) => plugin.onEnable());
    }

    disableAll(): void {
        this.plugins.forEach((plugin) => plugin.onDisable());
    }

    getPlugin(name: string): bppPlugin {
        return this.plugins.find((plugin) => plugin.name === name);
    }

    getPlugins(): bppPlugin[] {
        return this.plugins;
    }

    hasInitialized(): boolean {
        return this.inited;
    }
}

export default PluginManager;