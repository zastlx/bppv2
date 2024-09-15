import { readdir } from "node:fs/promises";

const files = await readdir("scripts/gen");

for (const file of files) if (file.endsWith(".ts")) await import(`./gen/${file}`);