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

console.log("BPP is ready!");
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
console.log(window.BPP);

pam.addPatches(pm.getPlugins().map(plugin => plugin.patches).flat());

// Reload the patches
pam.softReload(true);

// react tooltip doesnt add back its styles after a soft-reload so we have to do that manually