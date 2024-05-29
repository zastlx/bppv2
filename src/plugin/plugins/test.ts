// ./index.ts
import { Devs } from "#utils/consts";
import { bppPlugin } from ".";

class TestPlugin extends bppPlugin {
    constructor() {
        super("Internals", "0.0.1", "A plugin handling internal features of BPP", [Devs.zastix]);

        this.addPatches([
            {
                find: "import",
                replacement: {
                    match: /from"\.\/vendor\.(.{0,})\.js";/g,
                    replace: `from\"${location.origin}/vendor.$1.js\";`
                }
            },
            // i have no idea why it trys to import itself??
            {
                find: "import",
                replacement: {
                    match: /import"\.\/index\.(.{0,})\.js";/g,
                    replace: ""
                }
            }
        ]);
    }

    onEnable(): void {
        this.log("Test plugin enabled");
    };

    onDisable(): void {
        this.log("Test plugin disabled");
    };
};

export default new TestPlugin();