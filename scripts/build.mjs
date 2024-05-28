import { build } from "esbuild";
import { readdir } from "fs/promises";

/**
 * @type {import("esbuild").Plugin}
 */
const getAllPluginsPlugin = {
    name: "getAllPlugins",
    setup: (build) => {
        const filter = /\.src\/plugin\/plugins\/([^i]|i[^n]|in[^d]|ind[^e]|inde[^x]|index[^.])\.ts$/;
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