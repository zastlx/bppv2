import { iPluginManager } from "#types";
import { bppPlugin } from "./plugins";
import getPlugins from ".";
import logger from "#utils/logger";

class pluginManager implements iPluginManager {
    private plugins: bppPlugin[] = [];
    private inited: boolean = false;

    init(): void {
        this.plugins = getPlugins();
        this.inited = true;

        // init hard-patches here

        logger.info("PluginManager", "Initialized");
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
}

export default pluginManager;