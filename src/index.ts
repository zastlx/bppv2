import logger from "#utils/logger";

import PluginManager from "#plugin/pluginManager";
import events from "#utils/eventManager";
import { PatchManager } from "#patcher/hard";
import { Devs, devsArray } from "#utils/consts";
import ReconnectingWebSocket from "reconnecting-websocket";

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

pam.addPatches(pm.getPlugins().map((plugin) => plugin.patches).flat());

// Reload the patches
pam.softReload(true);

if (isDev) {
    const devWS = new ReconnectingWebSocket("ws://localhost:3000/ws");
    devWS.onopen = () => devWS.send(JSON.stringify({
        type: "register"
    }));

    devWS.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
            case "reload":
                eval(await (await fetch("http://localhost:3000/bpp.min.js")).text());
                break;
        }
    };
}

export { pam, pm };