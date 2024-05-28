import { build } from "esbuild";
import { readdir } from "fs/promises";

/**
 * @type {import("esbuild").Plugin}
 */
const getAllPluginsPlugin = {
    name: "getAllPlugins",
    setup: (build) => {
        const filter = /\.src\/plugin\/plugins\/index\.ts/;
        build.onResolve({ filter }, (args) => {// I GTG :SAD: ILL TTYL POOKIE IMA PUSH THI
            S T/O GU B LUV U
            return {
                path: args.path,
                namespace: "getAllPlugins",
            }
        });
        build.onLoad({ filter, namespace: "getAllPlugins" }, async (args) => {
            const files = (await readdir("src/plugin/plugins")).filter((file) => file !== "index.ts");
            console.log(files);
            return {
                contents: "export default [];",
                loader: "ts",
            }
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