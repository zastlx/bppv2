import React, { Context } from "react";
import ReactDOM from "react-dom";
import { CompHook, handleVendors } from "./vendors";

import { ConfigStoreContext, ChatStoreContext, FontStoreContext, PackStoreContext, ModalStoreContext, SocketStoreContext, LoadingStoreContext, CachedUserStoreContext, LeaderboardStoreContext, ContextMenuContext } from "#types/blacket/stores";
import { Devs } from "#utils/consts";
import { bppPlugin } from "..";
import * as SocketIOClient from "socket.io-client";
import { BPP } from "#index";
import { ChatStyles, DashboardStyles, LeaderboardStyles } from "#types/blacket/styles";
import { stylePatches } from "./stylePatches";
import routes from "#pages";

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
                ]
            },
            {
                // this was a string that im 99% sure wont match any file execpt index, if rewrite implments code splitting this will be updated
                find: "iridescent",
                replacement: [
                    {
                        match: /import"\.\/index\.(.{0,})\.js";/,
                        replace: "$self.blacketScope=(a)=>eval(a);"
                    },
                    {
                        match: /import\{(.{0,})\}from"\.\/vendor\.(.{0,10})\.js"/,
                        replace: (match, ...groups) => {
                            // im sorry for anyone who has to read this                            
                            return `$self.vendors={};$self.vendors._vendors=await import("${BPP.patchManager.files.find((file) => file.path.match(/vendor/)).patchedPath}");$self.handleVendors($self);const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors.vendors;$self.pages=$self.pages.map(a=>{a.component=a.component();return a;});$self.styles={};`;
                        }
                    },
                    {
                        match: /AuctionHouse:(.{0,3}),/,
                        replace: (_match, ...groups) => {
                            return `AuctionHouse:${groups[0]},${this.pages.map((page, i) => `${page.name}:$self.pages[${i}]`).join(",")},`;
                        }
                    },
                    {
                        match: /{to:"\/store",icon:"fas fa-cart-shopping",className:(.{0,3}),backgroundColor:"#2b22c2",children:"Visit Store"}/,
                        replace: "{to:\"/bpp\",icon:\"fas fa-plus\",className:$1,backgroundColor:\"#ff00d8\",children:\"BPP\"}"
                    },
                    {
                        match: /t:(.{0,2})\.jsx\((.{0,2}),{children:(.{0,2})\.jsx\((.{0,2}),/,
                        replace: "t:$1.jsx($2,{children:$3.jsx($self.componentHook($4,$self),"
                    },
                    ...stylePatches
                ]
            }
        ]);
    }
    handleVendors = handleVendors;
    componentHook = CompHook;
    // alot of these stores are not typed bcuz i pulled them directly from blacket github repo and they are not typed there (thanks xotic)
    stores: Partial<{
        modal: Context<ModalStoreContext>,
        user: Context<any>,
        socket: Context<SocketStoreContext>,
        fonts: Context<FontStoreContext>,
        config: Context<ConfigStoreContext>,
        loading: Context<LoadingStoreContext>,
        leaderboard: Context<LeaderboardStoreContext>,
        blooks: Context<any>,
        rarities: Context<any>,
        packs: Context<PackStoreContext>,
        items: Context<any>,
        banners: Context<any>,
        badges: Context<any>,
        emojis: Context<any>,
        cachedUsers: Context<CachedUserStoreContext>,
        chat: Context<ChatStoreContext>,
        contextManu: Context<ContextMenuContext>
    }> = {};
    storeProviders: Partial<{
        modal: Context<ModalStoreContext>,
        user: Context<any>,
        socket: Context<SocketStoreContext>,
        fonts: Context<FontStoreContext>,
        config: Context<ConfigStoreContext>,
        loading: Context<LoadingStoreContext>,
        leaderboard: Context<LeaderboardStoreContext>,
        blooks: Context<any>,
        rarities: Context<any>,
        packs: Context<PackStoreContext>,
        items: Context<any>,
        banners: Context<any>,
        badges: Context<any>,
        emojis: Context<any>,
        cachedUsers: Context<CachedUserStoreContext>,
        chat: Context<ChatStoreContext>,
        contextManu: Context<ContextMenuContext>
    }> = {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blacketScope(txt: string): any { }
    pages = routes;
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
    styles: {
        dashboard: DashboardStyles,
        leaderboard: LeaderboardStyles,
        chat: ChatStyles
    };
}

export default new InternalsPlugin();
export { InternalsPlugin };