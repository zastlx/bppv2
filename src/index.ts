const mataches = {
    React: "useState",
    ReactDOM: "render"
};
let modules: {
    React: typeof React | undefined,
    ReactDOM: typeof ReactDOM | undefined
} = {
    React: undefined,
    ReactDOM: undefined
};
/*const vendor: {
    [key: string]: {
        [key: string]: any
    }
    // @ts-ignore
} = await import(document.querySelector(`link[href*="vendor"]`).href);

for (const key in mataches) {
    modules[key] = Object.entries(vendor).find(([_, value]) => value[mataches[key]]);
    if (modules[key]) console.log(`Found ${key} in vendor, key is ${modules[key][0]}`);
    else console.error(`${key} not found in vendor`);
    if (modules[key]) modules[key] = modules[key][1];
}

console.log("mods", modules);
console.log("vendor", vendor);
console.log("matches", mataches);*/


