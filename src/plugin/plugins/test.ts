// ./index.ts
import { bppPlugin } from ".";

class TestPlugin extends bppPlugin {
    constructor() {
        super("Test");
    }

    onEnable(): void {
        console.log("Test plugin enabled");
    };

    onDisable(): void {
        console.log("Test plugin disabled");
    };
};

export default { TestPlugin };