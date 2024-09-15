import chalk from "chalk";
import { readdir } from "node:fs/promises";

// TODO: read this from cli args instead of hardcode
const blacketDir = "/home/zastix/projects/blacket/Blacket/frontend";
const importMap = {
    "blacket-types": "@blacket/types",
    "@square/web-sdk": "@square/web-payments-sdk-types"
};


type Stores = [string, string][]; // [storeName, storePath]

const storeTypes = await readdir(`${blacketDir}/src/stores`, { recursive: true }).then(_files => {
    const files = _files.filter(file => file.endsWith(".d.ts"));

    // @ts-ignore
    const stores: Stores = files.map(file => file.split("/"));

    return stores;
});

let out = "";

for (const store of storeTypes) {
    out += await Bun.file(`${blacketDir}/src/stores/${store[0]}/${store[1]}`).text();
}

const imports = out.match(/import\s+(type\s+\*\s+as\s+\w+|\{(.{0,})\})\s+from\s+".{0,}";/g)!;

let hasImported: { [pkgName: string]: string[] } = {};

for (const imp of imports) {
    const array = out.split(imp);
    const last = array.pop();
    out = array.join(imp) + last;

    let match = imp.match(/import {(.{0,})} from "(.{0,})";/)!;

    if (!match) {
        out = `${imp}\n${out}`;
        continue;
    }

    let [_, names, path] = match;

    let pkgImports = names.split(", ").map(name => name.trim());
    let packageName = path.split("/").pop()!;
    if (path.startsWith("src")) packageName = `${blacketDir}/${path}`;
    hasImported[packageName] = hasImported[packageName] || [];

    for (let pkg of pkgImports) if (hasImported[packageName].includes(pkg)) pkgImports = pkgImports.filter(pkgName => pkgName !== pkg);
    if (pkgImports.length === 0) continue;

    hasImported[packageName].push(...pkgImports);
    out = `import { ${pkgImports.join(", ")} } from "${packageName}";\n${out}`;
};

for (let [pkg, imp] of Object.entries(importMap)) out = out.replaceAll(pkg, imp);

await Bun.write("src/types/blacket/stores.ts", out);
console.log(`[${chalk.magenta("storeTypes")}] Generated store types from Blacket frontend source.`);