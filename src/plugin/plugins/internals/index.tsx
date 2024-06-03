import React from "react";
import ReactDOM from "react-dom";

import { ConfigStoreContext, ChatStoreContext, FontStoreContext, PackStoreContext, ModalStoreContext, SocketStoreContext, LoadingStoreContext, CachedUserStoreContext, LeaderboardStoreContext, ContextMenuContext } from "#types/blacket/stores";
import { Devs } from "#utils/consts";
import { bppPlugin } from "..";
import { BPPPage } from "./customPages";
import * as SocketIOClient from "socket.io-client";
import { pam } from "#index";
import { after } from "spitroast";
import { ContextDependency } from "react-reconciler";

// we really need to move most of this plugins functionality into bpp itself, i dont think its nice having one plugin for all off the internal patches and functionality, we need to refactor at some point

class InternalsPlugin extends bppPlugin {
    constructor() {
        super("Internals", "0.0.1", "A plugin handling internal features of BPP", [Devs.zastix]);

        this.addPatches([
            {
                find: "textures.getFrame(\"__DEFAULT\").glTexture",
                replacement: [{
                    match: /\.Phaser=(.{0,2})\(\)}\(this,/,
                    replace: ".Phaser=$1()}(window,"
                }]
            },
            {
                find: "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
                replacement: [
                    {
                        match: /from".\/index.(.{0,10}).js/,
                        replace: `from"${location.origin}/index.$1.js`
                    }
                    // not needed bcuz by patching the vendor file i inedvertantly fixed the react-tooltip styles not being added back :/
                    /* {
                        match: /"react-tooltip-inject-styles",\((.{0,2})=>{(.{0,2})\.detail\.disableCore\|\|(.{0,4})\({css:"(.{0,})",type:"(.{0,4})"}\),(.{0,2}).detail.disableBase\|\|(.{0,4})\(\{css:"\\n(.{0,})",type:"(.{0,4})"\}\)\}\)/,
                        replace: (match, ...groups) => {
                            return `"react-tooltip-inject-styles", ($self.reinjectReactTooltip=(${groups[0]}=>{${groups[1]}.detail.disableCore||${groups[2]}({css:"${groups[3]}",type:"${groups[4]}"}),${groups[1]}.detail.disableBase||${groups[2]}({css:"\\n${groups[7]}",type:"${groups[82]}"})}))`;
                        }
                    }*/
                ]
            },
            {
                // this was a string that im 99% sure wont match any file execpt index, if rewrite implments code splitting this will be updated
                find: "iridescent",
                replacement: [
                    // i have no idea why it trys to import itself??
                    {
                        match: /import"\.\/index\.(.{0,})\.js";/,
                        // (this has nothing to do with it importing itself, its just convient to declare the blacketScope func here)
                        replace: "$self.blacketScope=(a)=>eval(a);"
                    },
                    {
                        match: /import\{(.{0,})\}from"\.\/vendor\.(.{0,10})\.js"/,
                        replace: (match, ...groups) => {
                            // im sorry for anyone who has to read this                            
                            return `$self.vendors={};$self.vendors._vendors=await import("${pam.files.find((file) => file.path.match(/vendor/)).patchedPath}");$self.handleVendors();const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors.vendors;$self.pages=$self.pages.map(a=>{a.component=a.component();return a;})`;
                        }
                    },
                    {
                        match: /AuctionHouse:(.{0,3}),/,
                        replace: (match, ...groups) => {
                            return `AuctionHouse:${groups[0]},${this.pages.map((page, i) => `${page.name}:$self.pages[${i}]`).join(",")},`;
                        }
                    },
                    {
                        match: /{to:"\/store",icon:"fas fa-cart-shopping",className:(.{0,3}),backgroundColor:"#2b22c2",children:"Visit Store"}/,
                        replace: "{to:\"/bpp\",icon:\"fas fa-plus\",className:$1,backgroundColor:\"#ff00d8\",children:\"BPP\"}"
                    },
                    {
                        match: /path:"\/dashboard"/,
                        replace: "path:\"/dashboard\",topRight:[]"
                    }
                ]
            }
        ]);
    }
    handleVendors() {
        const checks = {
            React: "useState",
            ReactDOM: ".onRecoverableError",
            SocketIOClient: "io"
            // ReactHelmetProvider: "canUseDom",
            // ReactHelmet: "Helmet does not support rendering"
        };

        this.vendors.vendors = Object.fromEntries(Object.entries(this.vendors._vendors));
        this.vendors.normalized = {
            React: Object.values(this.vendors.vendors).find((vendor) => vendor[checks.React]) as (typeof React),
            ReactDOM: Object.values(this.vendors.vendors).find((vendor) => vendor.toString().includes(checks.ReactDOM)) as (typeof ReactDOM),
            SocketIOClient: Object.values(this.vendors.vendors).find((vendor) => vendor[checks.SocketIOClient]) as (typeof SocketIOClient)
        };
        this.vendors.map = {
            React: Object.keys(this.vendors.vendors).find((vendor) => this.vendors.vendors[vendor] === this.vendors.normalized.React),
            ReactDOM: Object.keys(this.vendors.vendors).find((vendor) => this.vendors.vendors[vendor] === this.vendors.normalized.ReactDOM),
            SocketIOClient: Object.keys(this.vendors.vendors).find((vendor) => this.vendors.vendors[vendor] === this.vendors.normalized.SocketIOClient)
        };

        // softpatching vendors can occur here
        const storeChecks = {
            modal: "setModals",
            user: "setUser",
            socket: "initializeSocket",
            fonts: "setFonts",
            config: "setConfig",
            loading: "setLoading",
            leaderboard: "setLeaderboard",
            blooks: "setBlooks",
            rarities: "setRarities",
            packs: "setPacks",
            items: "setItems",
            banners: "setBanners",
            badges: "setBadges",
            emojis: "setEmojis",
            cachedUsers: "addCachedUser",
            chat: "usersTyping",
            contextManu: "closeContextMenu"
        };

        after("createContext", this.vendors.normalized.React, (args, ret) => {
            const store = Object.entries(storeChecks).find((a) => args[0]?.[a[1]])?.[0];
            if (!store) return;

            this.storeProviders[store] = ret;
        });

        after("useContext", this.vendors.normalized.React, (args, ret) => {
            const store = Object.entries(storeChecks).find((a) => ret?.[a[1]])?.[0];
            if (!store) return;

            this.stores[store] = ret;
        });

    }
    stores: Partial<{
        config: ContextDependency<ConfigStoreContext>,
        loading: ContextDependency<LoadingStoreContext>,
        modals: ContextDependency<ModalStoreContext>,
        socket: ContextDependency<SocketStoreContext>,
        cachedUsers: ContextDependency<CachedUserStoreContext>,
        leaderboard: ContextDependency<LeaderboardStoreContext>,
        packs: ContextDependency<PackStoreContext>,
        chat: ContextDependency<ChatStoreContext>,
        fonts: ContextDependency<FontStoreContext>,
        contextMenu: ContextDependency<ContextMenuContext>
    }> = {};
    storeProviders: Partial<{
        config: ConfigStoreContext,
        loading: LoadingStoreContext,
        modals: ModalStoreContext,
        socket: SocketStoreContext,
        cachedUsers: CachedUserStoreContext,
        leaderboard: LeaderboardStoreContext,
        packs: PackStoreContext,
        chat: ChatStoreContext,
        fonts: FontStoreContext
        contextMenu: ContextMenuContext,
    }> = {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blacketScope(txt: string): any { }
    pages = [BPPPage];
    vendors: {
        vendors: { [key: string]: any }
        _vendors: { [key: string]: any }
        normalized: {
            React: typeof React,
            ReactDOM: typeof ReactDOM,
            SocketIOClient: typeof SocketIOClient
        }
        map: {
            React: string,
            ReactDOM: string,
            SocketIOClient: string
        }
    };
}

export default new InternalsPlugin();
export { InternalsPlugin };