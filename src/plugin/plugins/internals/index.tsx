import { Devs } from "#utils/consts";
import { bppPlugin } from "..";
import { BPP } from "#index";
import { ChatStyles, DashboardStyles, LeaderboardStyles } from "#types/blacket/styles";
import { stylePatches } from "./stylePatches";
import routes from "#pages";

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
                        replace: (_match, ...groups) => {
                            const actions: string[] = [];

                            // // im sorry for anyone who has to read this      
                            // return `$self.vendors={};$self.vendors._vendors=await import("${BPP.patchManager.files.find((file) => file.path.match(/vendor/)).patchedPath}");$self.handleVendors($self);const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors.vendors;$self.pages=$self.pages.map(a=>{a.component=a.component();return a;});$self.styles={};`;

                            actions.push("BPP.vendorManager.vendors={};");
                            actions.push(`BPP.vendorManager.vendors._vendors=await import("${BPP.patchManager.files.find((file) => file.path.match(/vendor/)).patchedPath}");`)
                            actions.push("BPP.vendorManager.init();");

                            const vendorMap = Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1);
                            actions.push(`const {${vendorMap}}=BPP.vendorManager.vendors.vendors;`);

                            actions.push("$self.pages=$self.pages.map(a=>{a.component=a.component();return a;});");
                            actions.push("$self.styles={};");

                            return actions.join("");
                        }
                    },
                    // add bpp pages
                    {
                        match: /AuctionHouse:(.{0,3}),/,
                        replace: (_match, ...groups) => {
                            return `AuctionHouse:${groups[0]},${this.pages.map((page, i) => `${page.name}:$self.pages[${i}]`).join(",")},`;
                        }
                    },
                    // turn store button into bpp button
                    {
                        match: /{to:"\/store",icon:"fas fa-cart-shopping",className:(.{0,3}),backgroundColor:"#2b22c2",children:"Visit Store"}/,
                        replace: "{to:\"/bpp\",icon:\"fas fa-plus\",className:$1,backgroundColor:\"#ff00d8\",children:\"BPP\"}"
                    },
                    {
                        match: /t:(.{0,2})\.jsx\((.{0,2}),{children:(.{0,2})\.jsx\((.{0,2}),/,
                        replace: "t:$1.jsx($2,{children:$3.jsx(BPP.storeManager.componentHook($4,$self),"
                    },
                    ...stylePatches
                ]
            }
        ]);
    }

    // this should be removed in production
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blacketScope(txt: string): any { }
    pages = routes;
    styles: {
        dashboard: DashboardStyles,
        leaderboard: LeaderboardStyles,
        chat: ChatStyles
    };
}

export default new InternalsPlugin();
export { InternalsPlugin };