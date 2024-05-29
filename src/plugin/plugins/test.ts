// ./index.ts
import { Devs } from "#utils/consts";
import { bppPlugin } from ".";

class TestPlugin extends bppPlugin {
    constructor() {
        super("Test", "1.0.0", "A test plugin", [Devs.zastix]);

        this.addPatches([
            {
                find: "import",
                replacement: {
                    match: /import/g,
                    replace: "console.log(`gyat`);import"
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