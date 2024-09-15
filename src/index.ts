import { Logger } from "#utils/logger";

import PluginManager from "#plugin/pluginManager";
import SettingsManager from "#settings/settingsManager";
import events from "#utils/eventManager";
import { PatchManager } from "#patcher/hard";
import { Devs, devsArray } from "#utils/consts";
import { StoreManager } from "#api/stores";
import { VendorManager } from "#api/vendors";

export class BPPClass extends Logger {
    public pluginManager: PluginManager = new PluginManager();
    public patchManager: PatchManager = new PatchManager();
    public storeManager: StoreManager = new StoreManager();
    public vendorManager: VendorManager = new VendorManager([]);
    public settingsManager: SettingsManager = new SettingsManager();
    public pages: any = {}
    public consts = {
        Devs,
        devsArray
    };
    public utils = {
        events
    };

    constructor() {
        super("BPP", "#5BCEFA");
        this.pluginManager.init();
        this.patchManager.init();
        this.storeManager.init(this);

        this.patchManager.addPatches(this.pluginManager.getPlugins().map((plugin) => plugin.patches).flat());
        this.patchManager.softReload(true);
    }
}

const BPP = new BPPClass();
window.BPP = BPP;


(async () => {
    if (isDev) {
        if (window.devWs) return;

        console.log("Dev mode enabled, connecting to dev hot-reload server...");
        // @ts-expect-error external module
        const ReconnectingWebSocket = (await import("https://cdn.jsdelivr.net/npm/reconnecting-websocket/+esm")).default;
        window.devWs = new ReconnectingWebSocket("ws://localhost:3000/ws", [], {
            maxRetries: 10
        });

        window.devWs.onopen = () => window.devWs.send(JSON.stringify({
            type: "register"
        }));

        window.devWs.onmessage = async (msg) => {
            const data = JSON.parse(msg.data);
            switch (data.type) {
                case "reload":
                    delete window.BPP;
                    // avoid direct-eval to make esbuild shut up
                    (0, eval)(await (await fetch("http://localhost:3000/bpp.min.js")).text());
                    break;
                case "hmr":

            }
        };
    }
})();

export { BPP };