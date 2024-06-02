import { OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
// import sassPlugin from "esbuild-sass-plugin";
import { readdir, readFile, writeFile, rm } from "fs/promises";

const userScriptBanner = await readFile("./scripts/banner.txt");

const getAllPluginsPlugin: Plugin = {
    name: "getAllPlugins",
    setup: (build: PluginBuild) => {
        const filter = /^~plugins$/;
        build.onResolve({ filter }, async (args: OnResolveArgs) => {
            return {
                path: args.path,
                namespace: "getAllPlugins"
            };
        });
        build.onLoad({ filter: /.*/, namespace: "getAllPlugins" }, async () => {
            const files: string[] = (await readdir("src/plugin/plugins"));
            let code = files.reduce((a, b) => {
                if (b === "index.ts") return a;
                return `import ${b.replace(".ts", "")}Plugin from "plugin/plugins/${b}"\n` + a;
            }, "");
            code += `export default () => [${files.filter((file) => file !== "index.ts").map((file) => file.replace(".ts", "").concat("Plugin")).join(", ")}];`;

            return {
                contents: code,
                resolveDir: "./src/"
            };
        });
    }
};

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "iife",
    target: ["esnext"],
    plugins: [getAllPluginsPlugin],
    minify: false,
    footer: {
        js: "//made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2"
    },
    sourcemap: false,
    outfile: "dist/bpp.full.js"
});


await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "iife",
    target: ["esnext"],
    plugins: [getAllPluginsPlugin],
    minify: true,
    footer: {
        js: "// made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2"
    },
    sourcemap: true,
    outfile: "dist/bpp.min.js"
});

// embedding css into the script bcuz esbuild has no support for that :/
let min = (await readFile("dist/bpp.min.js", "utf-8")).trim();
let full = (await readFile("dist/bpp.full.js", "utf-8")).trim();
const cssMin = (await readFile("dist/bpp.min.css", "utf-8")).trim().split("\n");
const cssFull = (await readFile("dist/bpp.full.css", "utf-8")).trim();
cssMin.pop();
min = min.replace("CSS_HERE", cssMin.join("\n"));
full = full.replace("\"CSS_HERE\"", `\`${cssFull}\``);

await writeFile("dist/bpp.min.js", min);
await writeFile("dist/bpp.full.js", full);

await rm("dist/bpp.min.css");
await rm("dist/bpp.min.css.map");
await rm("dist/bpp.full.css");

// userscript creation
const userScriptCode = `${userScriptBanner}\n${await readFile("dist/bpp.min.js")}`;
await writeFile("dist/bpp.user.js", userScriptCode.replaceAll("//# sourceMappingURL=bpp.js.map", ""));