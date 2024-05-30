// ./index.ts
import React from "react";
import ReactDOM from "react-dom";

import { Devs } from "#utils/consts";
import { bppPlugin } from ".";
import { before } from "spitroast";

class TestPlugin extends bppPlugin {
    constructor() {
        super("Test", "0.0.1", "Test", [Devs.zastix]);
    }

    onEnable(): void {
        console.log(<h1>gyat</h1>);
    }
};

export default new TestPlugin();