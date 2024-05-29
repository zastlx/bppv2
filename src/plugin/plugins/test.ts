// ./index.ts
import { Devs } from "#utils/consts";
import { bppPlugin } from ".";

class TestPlugin extends bppPlugin {
    constructor() {
        super("Test", "1.0.0", "A test plugin", [Devs.zastix]);

        this.addPatch({
            find: "import\"",
            replacement: {
                match: "import\"",
                replace: (m, rest) => {
                    return "console.log('Hi, I am an example patch!');\n" + m
                }
            }
        });
    }

    onEnable(): void {
        this.log("Test plugin enabled");
    };

    onDisable(): void {
        this.log("Test plugin disabled");
    };
};

export default new TestPlugin();