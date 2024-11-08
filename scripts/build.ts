import chalk from "chalk";
import { OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
// import sassPlugin from "esbuild-sass-plugin";
import { readdir, readFile, writeFile, rm, exists } from "fs/promises";

const time = Date.now();

const userScriptBanner = await readFile("./scripts/banner.txt");

const defines = {
    isDev: `${process.argv.includes("--dev")}`
};

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
    define: defines,
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
    legalComments: "none",
    footer: {
        js: "// made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2"
    },
    define: defines,
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

const rmIfExist = async (path: string) => await exists(path) && await rm(path);

// await rmIfExist("dist/bpp.min.css");
// await rmIfExist("dist/bpp.min.css.map");
// await rmIfExist("dist/bpp.full.css");

// userscript creation
const userScriptCode = `${userScriptBanner}\n${await readFile("dist/bpp.min.js")}`;
await writeFile("dist/bpp.user.js", userScriptCode.replaceAll("//# sourceMappingURL=bpp.js.map", ""));

// get size of files in kb
const minSize = (await readFile("dist/bpp.min.js")).length / 1024;
const fullSize = (await readFile("dist/bpp.full.js")).length / 1024;
const userScriptSize = (await readFile("dist/bpp.user.js")).length / 1024;


console.log(`
- ⚡ Built in ${chalk.redBright((Date.now() - time) / 1000)}s
    ${chalk.magenta("dist/")}bpp.min.js    ${chalk.redBright(minSize.toFixed(2))}kb
    ${chalk.magenta("dist/")}bpp.full.js   ${chalk.redBright(fullSize.toFixed(2))}kb
    ${chalk.magenta("dist/")}bpp.user.js   ${chalk.redBright(userScriptSize.toFixed(2))}kb
`);