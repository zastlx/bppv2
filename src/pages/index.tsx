import { BPP } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import Main from "./main/route";


const routes = [
    isDev ? {
        ...Main,
        component: () => {
            const { useState, useEffect } = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).vendors.normalized.React;
            const [a, forceUpdate] = useState<number>(0);
            useEffect(() => {
                BPP.pages.BPP = forceUpdate;
                return () => { delete BPP.pages.BPP; }
            }, [a]);
            return <Main.component />;
        }
    } : Main
];

export default routes;