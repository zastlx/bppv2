import { iDev } from "./consts";
import { iPatch } from "./patcher";
import { iPluginManager, iPlugin } from "./plugin";

import { PatchManager } from "#patcher/hard";
import PluginManager from "#plugin/pluginManager";
import { Loggable, Logger } from "#utils/logger";
import { Events } from "#utils/eventManager";

interface BppGlobal {
    pluginManager: PluginManager;
    patchManager: PatchManager;
    consts: {
        Devs: Record<string, iDev>;
        devsArray: iDev[];
    };
    utils: {
        logger: Logger;
        events: Events;
    };
}

declare global {
    interface Window {
        BPP: BppGlobal
    }
}

export {
    iDev,
    iPatch,
    iPlugin,
    iPluginManager
};