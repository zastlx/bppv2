import React from "react";
import ReactDOM from "react-dom";

import { Devs } from "#utils/consts";
import { bppPlugin } from ".";
import * as SocketIOClient from "socket.io-client"

// we really need to move most of this plugins functionality into bpp itself, i dont think its nice having one plugin for all off the internal patches and functionality, we need to refactor at some point

class InternalsPlugin extends bppPlugin {
    constructor() {
        super("Internals", "0.0.1", "A plugin handling internal features of BPP", [Devs.zastix]);

        this.addPatches([
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
                        match: /import\{(.{0,})\}from"\.\/vendor\.(.{0,10})\.js\"/,
                        replace: (match, ...groups) => {
                            // im sorry for anyone who has to read this
                            return `$self.vendors={};$self.vendors._vendors=await import(\"${location.origin}/vendor.$2.js\");$self.handleVendors();const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors.vendors;`;
                        }
                    },
                    {
                        match: /AuctionHouse:(.{0,3}),/,
                        replace: "AuctionHouse:$1,"
                    },
                    // replace the store link with the BPP link
                    {
                        match: /{to:"\/store",icon:"fas fa-cart-shopping",className:(.{0,3}),backgroundColor:"#2b22c2",children:"Visit Store"}/,
                        replace: "{to:\"/bpp\",icon:\"fas fa-plus\",className:$1,backgroundColor:\"#ff00d8\",children:\"BPP\"}"
                    }
                ]
            }
        ]);
    }
    handleVendors() {
        const checks = {
            React: "useState",
            ReactDOM: ".onRecoverableError",
            Phaser: "Game",
            SocketIOClient: "io",
            //ReactHelmetProvider: "canUseDom",
            //ReactHelmet: "Helmet does not support rendering"
        };

        this.vendors.vendors = Object.fromEntries(Object.entries(this.vendors._vendors));
        this.vendors.normalized = {
            React: Object.values(this.vendors.vendors).find(vendor => vendor[checks.React]) as (typeof React),
            ReactDOM: Object.values(this.vendors.vendors).find(vendor => vendor.toString().includes(checks.ReactDOM)) as (typeof ReactDOM),
            Phaser: Object.values(this.vendors.vendors).find(vendor => vendor[checks.Phaser]) as (typeof Phaser),
            SocketIOClient: Object.values(this.vendors.vendors).find(vendor => vendor[checks.SocketIOClient]) as (typeof SocketIOClient),
        }
        this.vendors.map = {
            React: Object.keys(this.vendors.vendors).find(vendor => this.vendors.vendors[vendor] === this.vendors.normalized.React),
            ReactDOM: Object.keys(this.vendors.vendors).find(vendor => this.vendors.vendors[vendor] === this.vendors.normalized.ReactDOM),
            Phaser: Object.keys(this.vendors.vendors).find(vendor => this.vendors.vendors[vendor] === this.vendors.normalized.Phaser),
            SocketIOClient: Object.keys(this.vendors.vendors).find(vendor => this.vendors.vendors[vendor] === this.vendors.normalized.SocketIOClient),
        }

        // softpatching vendors can occur here

    }
    blacketScope(txt: string): any { }
    vendors: {
        vendors: { [key: string]: any },
        _vendors: { [key: string]: any },
        normalized: {
            React: typeof React,
            ReactDOM: typeof ReactDOM,
            Phaser: typeof Phaser,
            SocketIOClient: typeof SocketIOClient
        },
        map: {
            React: string,
            ReactDOM: string,
            Phaser: string,
            SocketIOClient: string
        },
    };
};

export default new InternalsPlugin();