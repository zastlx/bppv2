import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
import { readdir } from "fs/promises";

const getAllPluginsPlugin: Plugin = {
    name: "getAllPlugins",
    setup: (build: PluginBuild) => {
        const filter = /^~plugins$/;
        build.onResolve({ filter }, async (args: OnResolveArgs) => {
            return {
                path: args.path,
                namespace: "getAllPlugins",
            };
        });
        build.onLoad({ filter: /.*/, namespace: "getAllPlugins" }, async (args: OnLoadArgs) => {
            const files: string[] = (await readdir("src/plugin/plugins"));
            let code = files.reduce((a, b) => {
                if (b === "index.ts") return a;
                return `import ${b.replace(".ts", "")}Plugin from "plugin/plugins/${b}"\n` + a;
            }, "")
            code += `export default () => [${files.filter(file => file !== "index.ts").map(file => file.replace(".ts", "").concat("Plugin")).join(", ")}];`

            return {
                contents: code,
                resolveDir: "./src/",
            };
        });
    }
}

await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    target: ["esnext"],
    plugins: [getAllPluginsPlugin],
    minify: true,
    footer: {
        js: "// made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2"
    },
    outfile: "dist/out.js",
});