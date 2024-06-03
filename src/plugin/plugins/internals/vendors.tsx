import React from "react";
import ReactDOM from "react-dom";
import * as SocketIOClient from "socket.io-client";
import { after } from "spitroast";

import { InternalsPlugin } from ".";

const handleVendors = (this_: InternalsPlugin) => {
    const checks = {
        React: "useState",
        ReactDOM: ".onRecoverableError",
        SocketIOClient: "io"
        // ReactHelmetProvider: "canUseDom",
        // ReactHelmet: "Helmet does not support rendering"
    };

    this_.vendors.vendors = Object.fromEntries(Object.entries(this_.vendors._vendors));
    this_.vendors.normalized = {
        React: Object.values(this_.vendors.vendors).find((vendor) => vendor[checks.React]) as (typeof React),
        ReactDOM: Object.values(this_.vendors.vendors).find((vendor) => vendor.toString().includes(checks.ReactDOM)) as (typeof ReactDOM),
        SocketIOClient: Object.values(this_.vendors.vendors).find((vendor) => vendor[checks.SocketIOClient]) as (typeof SocketIOClient)
    };
    this_.vendors.map = {
        React: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.React),
        ReactDOM: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.ReactDOM),
        SocketIOClient: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.SocketIOClient)
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

    after("createContext", this_.vendors.normalized.React, (args, ret) => {
        const store = Object.entries(storeChecks).find((a) => args[0]?.[a[1]])?.[0];
        if (!store) return;

        this_.storeProviders[store] = ret;
    });
};

const CompHook = (Comp: React.FC, this_: InternalsPlugin) => () => {
    for (const store in this_.storeProviders) {
        this_.stores[store] = this_.vendors.normalized.React.useContext(this_.storeProviders[store]);
    }

    return <Comp />;
};

export { handleVendors, CompHook };