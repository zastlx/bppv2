// ./index.ts
import React from "react";
import ReactDOM from "react-dom";

import { Devs } from "#utils/consts";
import { bppPlugin } from ".";
import { before } from "spitroast";

class InternalsPlugin extends bppPlugin {
    constructor() {
        super("Internals", "0.0.1", "A plugin handling internal features of BPP", [Devs.zastix]);



        this.addPatches([
            {
                // this was a string that im 99% sure wont match any file execpt index, if v2 implments code splitting this will be updated
                find: "iridescent",
                replacement: [
                    // i have no idea why it trys to import itself??
                    {
                        match: /import"\.\/index\.(.{0,})\.js";/,
                        replace: ""
                    },
                    {
                        match: /import\{(.{0,})\}from"\.\/vendor\.(.{0,10})\.js\"/,
                        replace: (match, ...groups) => {
                            // im sorry for anyone who has to read this
                            return `$self.vendors=await import(\"${location.origin}/vendor.$2.js\");$self.handleVendors();const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors;`;
                        }
                    }
                    /*{
                        match: /from"\.\/vendor\.(.{0,})\.js";/g,
                        replace: `from\"${location.origin}/vendor.$1.js\";$self.vendors=await import(\"${location.origin}/vendor.$1.js\");$self.handleVendors();`
                    }*/
                ]
            }
        ]);
    }
    handleVendors() {
        const checks = {
            React: "useState",
            ReactDOM: ".onRecoverableError",
            Phaser: "Game"
        };
        this.vendorsNormalized = {
            React: Object.values(this.vendors).find(vendor => vendor[checks.React]) as (typeof React),
            ReactDOM: Object.values(this.vendors).find(vendor => vendor.toString().includes(checks.ReactDOM)) as (typeof ReactDOM),
            Phaser: Object.values(this.vendors).find(vendor => vendor[checks.Phaser]) as (typeof Phaser)
        }

        // softpatching vendors can occur here
    }
    vendors: { [key: string]: any };
    vendorsNormalized: {
        React: typeof React,
        ReactDOM: typeof ReactDOM,
        Phaser: typeof Phaser
    };
};

export default new InternalsPlugin();