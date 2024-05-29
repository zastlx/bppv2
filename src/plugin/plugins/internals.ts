// ./index.ts
import React from "react";
import ReactDOM from "react-dom";

import { Devs } from "#utils/consts";
import { bppPlugin } from ".";

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
                        match: /import"\.\/index\.(.{0,})\.js";/g,
                        replace: ""
                    },
                    {
                        match: /from"\.\/vendor\.(.{0,})\.js";/g,
                        replace: `from\"${location.origin}/vendor.$1.js\";$self.vendors=await import(\"${location.origin}/vendor.$1.js\");$self.handleVendors();`
                    }
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
        debugger;
        this.vendorsNormalized = {
            React: Object.values(this.vendors).find(vendor => vendor[checks.React]) as (typeof React),
            ReactDOM: Object.values(this.vendors).find(vendor => vendor.toString().includes(checks.ReactDOM)) as (typeof ReactDOM),
            Phaser: Object.values(this.vendors).find(vendor => vendor[checks.Phaser]) as (typeof Phaser)
        }
    }
    vendors: { [key: string]: any };
    vendorsNormalized: {
        React: typeof React,
        ReactDOM: typeof ReactDOM,
        Phaser: typeof Phaser
    };
};

export default new InternalsPlugin();