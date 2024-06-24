import { BPP } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
const {
    modal,
    user,
    socket,
    fonts,
    config,
    loading,
    leaderboard,
    blooks,
    rarities,
    packs,
    items,
    banners,
    badges,
    emojis,
    cachedUsers,
    chat,
    contextManu
} = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).stores;

export {
    modal,
    user,
    socket,
    fonts,
    config,
    loading,
    leaderboard,
    blooks,
    rarities,
    packs,
    items,
    banners,
    badges,
    emojis,
    cachedUsers,
    chat,
    contextManu
};