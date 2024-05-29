import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
import { readdir } from "fs/promises";
import { join } from "path";

// builds the hacky workaround for negative lookahead so i don't have to manually write alla dat
function regexBuildNegativeLookahead(value: string): string {
    const chars: string[] = value.split("");
    let regex: string = "";
    let currentPrepended: string = "";
    for (let i: number = 0; i < chars.length; i++) {
        currentPrepended += chars[i - 1] || "";
        regex += `${currentPrepended}[^${chars[i]}]|`;
    }
    regex = regex.slice(0, -1);
    return "(?:" + regex + ")";
}

const getAllPluginsPlugin: Plugin = {
    name: "getAllPlugins",
    setup: (build: PluginBuild) => {
        // since esbuild uses go regex, we can't use lookbehinds or lookaheads, the hacky trick MUST be used
        //const filter: RegExp = new RegExp(`src/plugin/plugins\\/${regexBuildNegativeLookahead("index")}\\.ts$`);
        const filter = /^~plugins$/;
        build.onResolve({ filter }, async (args: OnResolveArgs) => {
            const files: string[] = await readdir(args.resolveDir);
            console.log(args);
            return {
                path: args.path,
                namespace: "getAllPlugins",
            };
        });
        build.onLoad({ filter: /.*/, namespace: "getAllPlugins" }, async (args: OnLoadArgs) => {
            console.log(args);
            const files: string[] = (await readdir("src/plugin/plugins"));
            console.log(files);
            let code = files.reduce((a, b) => {
                if (b === "index.ts") return a;
                return `import ${b.replace(".ts", "")}Plugin from "plugin/plugins/${b}"\n` + a;
            }, "")
            code += `export default () => [${files.filter(file => file !== "index.ts").map(file => file.replace(".ts", "").concat("Plugin")).join(", ")}];`
            console.log(code);
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
    minify: false,
    footer: {
        js: "// made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2"
    },
    outfile: "dist/out.js",
});