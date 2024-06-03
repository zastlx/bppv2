import express from "express";
import expressWs from "express-ws";
import path from "path";
import { watch } from "fs/promises";
import { spawnSync } from "bun";
import chalk from "chalk";

const app = expressWs(express()).app;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

interface MessageData {
    type: string;
    data?: any;
}

const clients: any[] = [];

app.ws("/ws", (ws) => {
    ws.on("message", (msg: string) => {
        const data: MessageData = JSON.parse(msg);
        switch (data.type) {
            case "register":
                console.log(`[${chalk.magenta("WS")}] Client connected`);
                clients.push(ws);
                ws.send(JSON.stringify({ type: "register" }));
                break;
        }
    });

    ws.on("close", () => {
        console.log(`[${chalk.magenta("WS")}] Client disconnected`);
        clients.splice(clients.indexOf(ws), 1);
    });
});

app.use(express.static(path.join(__dirname, "..", "dist")));


app.listen(3000, () => {
    console.log("Server started on port 3000");
});

const watcher = watch("src", { recursive: true });
for await (const _ of watcher) {
    // stfu typescript
    _;
    console.log(`[${chalk.magenta("Watcher")}] ${chalk.green("File changed, rebuilding...")}`);
    await spawnSync({
        cmd: ["bun", "run", "build"],
        stdout: "pipe",
        stderr: "pipe"
    });
    console.log(`[${chalk.magenta("Watcher")}] ${chalk.green("Rebuilt!")}`);
    for (const client of clients) {
        client.send(JSON.stringify({ type: "reload" }));
    }
    console.log(`[${chalk.magenta("Watcher")}] ${chalk.green("Reloaded clients")}`);
}