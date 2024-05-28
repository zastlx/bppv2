import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
import { readdir } from "fs/promises";

// builds the hacky workaround for negative lookahead so i don't have to manually write alla dat
function regexBuildNegativeLookahead(value) {
    const chars = value.split("");
    let regex = "";
    let currentPrepended = "";
    for (let i = 0; i < chars.length; i++) {
        currentPrepended += chars[i - 1] || "";
        regex += `${currentPrepended}[^${chars[i]}]|`;
    }
    regex = regex.slice(0, -1);
    return "(?:" + regex + ")";
}

const getAllPluginsPlugin = {
    name: "getAllPlugins",
    setup: (build) => {
        // since esbuild uses go regex, we can't use lookbehinds or lookaheads, the hacky trick MUST be used
        const filter = new RegExp(`src/plugin/plugins\\/${regexBuildNegativeLookahead("index")}\\.ts$`);

        build.onResolve({ filter }, async (args) => {
            const files = await readdir(args.resolveDir);
            return {
                path: args.path,
                namespace: "getAllPlugins",
            };
        });
        build.onLoad({ filter: /.*/, namespace: "getAllPlugins" }, async (args) => {
            return {
                contents: `
                    export default [
                        ${args.path}
                    ];
                `,
                loader: "ts",
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
    outfile: "dist/out.js",
});