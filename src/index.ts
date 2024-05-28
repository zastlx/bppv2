import logger from "#utils/logger";

import pluginManager from "#plugin/pluginManager";
import events from "#utils/eventManager";

logger.info("BPP", "Starting up BPP...");


const pm = new pluginManager();
pm.init();


events.dispatch("registrar.done", {
    message: "BPP is ready!",
    data: {
        pluginManager: {
            plugins: pm.getPlugins().map(plugin => {
                return {
                    name: plugin.name,
                    version: plugin.version,
                    description: plugin.description,
                    authors: plugin.authors
                }
            }),
            pluginCount: pm.getPlugins().length,
            inited: pm.hasInitialized()
        }
    }
});