import logger from "#utils/logger";

import pluginManager from "#plugin/pluginManager";
import events from "#utils/eventManager";
import { PatchManager } from "#patcher/hard";

logger.info("BPP", "Starting up BPP...");


const pm = new pluginManager();
pm.init();

const pam = new PatchManager();
pam.init();

pam.addPatches(pm.getPlugins().map(plugin => plugin.patches).flat());

// Reload the patches
pam.softReload(true);

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