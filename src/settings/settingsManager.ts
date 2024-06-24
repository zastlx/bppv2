import { iPluginManager } from "#types";
import { Logger } from "#utils/logger";
import { BPP } from "#index";


interface Settings {
    main: {
    }
    plugins: {
        [name: string]: boolean
    }
}

class SettingsManager extends Logger {
    private inited: boolean = false;
    private settings = {
        get main() {
            return {};
        },
        set main() {
        },
        set plugins() {
        },
        get plugins() {
            let plugins = JSON.parse(localStorage.getItem("plugins") || "{}");
            if (Object.keys(plugins).length === 0) {
                plugins = BPP.pluginManager.getPlugins().reduce((a, b) => (a[b.name] = false, a), {});
                localStorage.setItem("plugins", JSON.stringify(plugins));
            }
        }
    };

    constructor() {
        super("SettingsManager", "#FFFFFF");
    }

    init(): void {
        this.info("Initialized");


        this.inited = true;
    }

    public updatePluginState(name: string, state: boolean): void {

}

export default SettingsManager;