import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild, build } from "esbuild";
import { readdir } from "fs/promises";

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
        const filter: RegExp = new RegExp(`src/plugin/plugins\\/${regexBuildNegativeLookahead("index")}\\.ts$`);

        build.onResolve({ filter }, async (args: OnResolveArgs) => {
            const files: string[] = await readdir(args.resolveDir);
            return {
                path: args.path,
                namespace: "getAllPlugins",
            };
        });
        build.onLoad({ filter: /.*/, namespace: "getAllPlugins" }, async (args: OnLoadArgs) => {
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