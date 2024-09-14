import { iDev } from "./consts";
import { iPatch } from "./patcher";
import { iPluginManager, iPlugin } from "./plugin";

import { PatchManager } from "#patcher/hard";
import PluginManager from "#plugin/pluginManager";
import { Events } from "#utils/eventManager";

export interface BppGlobal {
    pluginManager: PluginManager;
    patchManager: PatchManager;
    consts: {
        Devs: Record<string, iDev>;
        devsArray: iDev[];
    };
    utils: {
        events: Events;
    };
}

declare global {
    interface Window {
        BPP: BppGlobal;
        devWs: any;
    }

    // esbuild defines
    const isDev: boolean;
}

export interface LinkProps {
    children?: React.ReactNode;
    relative?: "route" | "path";
    replace?: boolean;
    state?: any;
    to: string;
    className?: string;
}

export {
    iDev,
    iPatch,
    iPlugin,
    iPluginManager
};