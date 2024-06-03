import logger from "#utils/logger";

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

pam.addPatches(pm.getPlugins().map((plugin) => plugin.patches).flat());

// Reload the patches
pam.softReload(true);

(async () => {
    if (isDev) {
        console.log("Dev mode enabled, connecting to dev hot-reload server...");
        // @ts-expect-error external module
        const ReconnectingWebSocket = (await import("https://cdn.jsdelivr.net/npm/reconnecting-websocket/+esm")).default;
        const devWS = new ReconnectingWebSocket("ws://localhost:3000/ws", [], {
            maxRetries: 10
        });
        devWS.onopen = () => devWS.send(JSON.stringify({
            type: "register"
        }));

        devWS.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            switch (data.type) {
                case "reload":
                    delete window.BPP;
                    eval(await (await fetch("http://localhost:3000/bpp.min.js")).text());
                    break;
            }
        };
    }
})();

export { pam, pm };