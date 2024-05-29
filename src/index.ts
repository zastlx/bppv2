import logger, { Loggable } from "#utils/logger";

import PluginManager from "#plugin/pluginManager";
import events from "#utils/eventManager";
import { PatchManager } from "#patcher/hard";
import { Devs, devsArray } from "#utils/consts";

logger.info("BPP", "Starting up BPP...");


const pm = new PluginManager();
pm.init();

const pam = new PatchManager();
pam.init();

window.BPP = {
    pluginManager: pm,
    patchManager: pam,
    consts: {
        Devs,
        devsArray
    },
    utils: {
        logger,
        events
    }
};

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