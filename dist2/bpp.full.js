(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/utils/logger.ts
  var Logger = class {
    constructor(_name, color = "white") {
      this._name = _name;
      this.color = color;
    }
    static makeTitle(color, title) {
      return ["%c %c %s ", "", `background: ${color}; color: black; font-weight: bold; border-radius: 5px;`, title];
    }
    _log(level, levelColor, args) {
      console[level](
        `%c BPP %c %c ${this._name}`,
        `background: ${levelColor}; color: black; font-weight: bold; border-radius: 5px;`,
        "",
        `background: ${this.color}; color: black; font-weight: bold; border-radius: 5px;`,
        ...args
      );
    }
    info(...args) {
      this._log("info", "#a6d189", args);
    }
    error(...args) {
      this._log("error", "#e78284", args);
    }
    warn(...args) {
      this._log("warn", "#e5c890", args);
    }
  };
  var logger_default = Logger;

  // node_modules/spitroast/dist/esm/shared.js
  var patchTypes = ["a", "b", "i"];
  var patchedObjects = /* @__PURE__ */ new Map();

  // node_modules/spitroast/dist/esm/hook.js
  function hook_default(funcName, funcParent, funcArgs, ctxt, isConstruct) {
    const patch = patchedObjects.get(funcParent)?.[funcName];
    if (!patch)
      return isConstruct ? Reflect.construct(funcParent[funcName], funcArgs, ctxt) : funcParent[funcName].apply(ctxt, funcArgs);
    for (const hook of patch.b.values()) {
      const maybefuncArgs = hook.call(ctxt, funcArgs);
      if (Array.isArray(maybefuncArgs))
        funcArgs = maybefuncArgs;
    }
    let workingRetVal = [...patch.i.values()].reduce(
      (prev, current) => (...args) => current.call(ctxt, args, prev),
      // This calls the original function
      (...args) => isConstruct ? Reflect.construct(patch.o, args, ctxt) : patch.o.apply(ctxt, args)
    )(...funcArgs);
    for (const hook of patch.a.values())
      workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
    return workingRetVal;
  }

  // node_modules/spitroast/dist/esm/unpatch.js
  function unpatch(funcParent, funcName, hookId, type) {
    const patchedObject = patchedObjects.get(funcParent);
    const patch = patchedObject?.[funcName];
    if (!patch?.[type].has(hookId))
      return false;
    patch[type].delete(hookId);
    if (patchTypes.every((t) => patch[t].size === 0)) {
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: patch.o,
        writable: true,
        configurable: true
      });
      if (!success)
        funcParent[funcName] = patch.o;
      delete patchedObject[funcName];
    }
    if (Object.keys(patchedObject).length == 0)
      patchedObjects.delete(funcParent);
    return true;
  }

  // node_modules/spitroast/dist/esm/getPatchFunc.js
  var getPatchFunc_default = (patchType) => (funcName, funcParent, callback, oneTime = false) => {
    if (typeof funcParent[funcName] !== "function")
      throw new Error(`${funcName} is not a function in ${funcParent.constructor.name}`);
    if (!patchedObjects.has(funcParent))
      patchedObjects.set(funcParent, /* @__PURE__ */ Object.create(null));
    const parentInjections = patchedObjects.get(funcParent);
    if (!parentInjections[funcName]) {
      const origFunc = funcParent[funcName];
      parentInjections[funcName] = {
        o: origFunc,
        b: /* @__PURE__ */ new Map(),
        i: /* @__PURE__ */ new Map(),
        a: /* @__PURE__ */ new Map()
      };
      const runHook = (ctxt, args, construct) => {
        const ret = hook_default(funcName, funcParent, args, ctxt, construct);
        if (oneTime)
          unpatchThisPatch();
        return ret;
      };
      const replaceProxy = new Proxy(origFunc, {
        apply: (_, ctxt, args) => runHook(ctxt, args, false),
        construct: (_, args) => runHook(origFunc, args, true),
        get: (target, prop, receiver) => prop == "toString" ? origFunc.toString.bind(origFunc) : Reflect.get(target, prop, receiver)
      });
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: replaceProxy,
        configurable: true,
        writable: true
      });
      if (!success)
        funcParent[funcName] = replaceProxy;
    }
    const hookId = Symbol();
    const unpatchThisPatch = () => unpatch(funcParent, funcName, hookId, patchType);
    parentInjections[funcName][patchType].set(hookId, callback);
    return unpatchThisPatch;
  };

  // node_modules/spitroast/dist/esm/index.js
  var before = getPatchFunc_default("b");
  var instead = getPatchFunc_default("i");
  var after = getPatchFunc_default("a");

  // src/plugin/plugins/internals/vendors.tsx
  var handleVendors = (this_) => {
    const checks = {
      React: "useState",
      ReactDOM: ".onRecoverableError",
      SocketIOClient: "io"
      // ReactHelmetProvider: "canUseDom",
      // ReactHelmet: "Helmet does not support rendering"
    };
    this_.vendors.vendors = Object.fromEntries(Object.entries(this_.vendors._vendors));
    this_.vendors.normalized = {
      React: Object.values(this_.vendors.vendors).find((vendor) => vendor[checks.React]),
      ReactDOM: Object.values(this_.vendors.vendors).find((vendor) => vendor.toString().includes(checks.ReactDOM)),
      SocketIOClient: Object.values(this_.vendors.vendors).find((vendor) => vendor[checks.SocketIOClient])
    };
    this_.vendors.map = {
      React: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.React),
      ReactDOM: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.ReactDOM),
      SocketIOClient: Object.keys(this_.vendors.vendors).find((vendor) => this_.vendors.vendors[vendor] === this_.vendors.normalized.SocketIOClient)
    };
    const storeChecks = {
      modal: "setModals",
      user: "setUser",
      socket: "initializeSocket",
      fonts: "setFonts",
      config: "setConfig",
      loading: "setLoading",
      leaderboard: "setLeaderboard",
      blooks: "setBlooks",
      rarities: "setRarities",
      packs: "setPacks",
      items: "setItems",
      banners: "setBanners",
      badges: "setBadges",
      emojis: "setEmojis",
      cachedUsers: "addCachedUser",
      chat: "usersTyping",
      contextManu: "closeContextMenu"
    };
    after("createContext", this_.vendors.normalized.React, (args, ret) => {
      const store = Object.entries(storeChecks).find((a) => args[0]?.[a[1]])?.[0];
      if (!store) return;
      this_.storeProviders[store] = ret;
    });
  };
  var CompHook = (Comp, this_) => () => {
    for (const store in this_.storeProviders) {
      this_.stores[store] = this_.vendors.normalized.React.useContext(this_.storeProviders[store]);
    }
    return /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(Comp, null);
  };

  // src/utils/consts.ts
  var Devs = {
    zastix: {
      name: "zastix",
      id: "17153937091571944",
      avatar: "https://zastix.club/resources/pfps/pfp_crop.png"
    },
    allie: {
      name: "allie",
      id: "idk",
      avatar: "idk"
    }
  };
  var devsArray = Object.values(Devs);
  console.log(devsArray);

  // src/plugin/plugins/index.ts
  var bppPlugin = class extends Logger {
    name;
    version;
    description;
    authors;
    patches;
    enabled = false;
    constructor(name, version = "0.0.1", description = "An example plugin", authors) {
      super(name);
      this.name = name;
      this.version = version;
      this.description = description;
      this.authors = authors;
      this.patches = [];
    }
    addPatch(patch) {
      this.patches.push({
        ...patch,
        plugin: this.name
      });
    }
    addPatches(patches) {
      const _patches = patches.map((patch) => ({ ...patch, plugin: this.name }));
      this.patches.push(..._patches);
    }
    onEnable() {
    }
    onDisable() {
    }
  };

  // src/plugin/plugins/internals/stylePatches.ts
  var stylePatches = [
    ["wrapper", "leaderboard"],
    ["parentHolder", "dashboard"]
  ].map((a) => {
    return {
      match: new RegExp(`const (.{0,4})={${a[0]}:"${a[1]}`),
      replace: `const $1=$self.styles["${a[1]}"]={${a[0]}:"${a[1]}`
    };
  });

  // src/pages/main/main.module.css
  var section = "main_section";
  var container = "main_container";

  // src/pages/main/index.tsx
  var main_default = () => {
    const { blacketScope } = BPP.pluginManager.getPlugin("Internals");
    const PageHeader = blacketScope("be");
    const Link = blacketScope("t");
    const dashboardStyles = BPP.pluginManager.getPlugin("Internals").styles.dashboard;
    const btns = [
      {
        icon: "fas fa-wand-magic-sparkles",
        text: "Plugins",
        link: "/bpp/plugins"
      },
      {
        icon: "fas fa-cog",
        text: "Settings",
        link: "/bpp/credits"
      },
      {
        icon: "fas fa-palette",
        text: "Themes",
        link: "/bpp/themes"
      }
    ];
    return /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.Fragment, null, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(PageHeader, null, "Blacket++"), /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { className: section }, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { style: {
      height: "20vh"
    }, className: `${dashboardStyles.smallButtonContainer} ${container}` }, btns.map((btn, i) => /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(Link, { to: btn.link, className: dashboardStyles.topRightButton, key: i }, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("i", { className: btn.icon }), /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", null, btn.text))))));
  };

  // src/pages/main/route.tsx
  var BPPPage = {
    name: "BPP",
    path: "/bpp",
    title: "BPP | Blacket Rewrite",
    topRight: ["tokens" /* TOKENS */],
    sidebar: true,
    background: true,
    dontUseBody: false,
    component: () => /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(main_default, null)
  };
  var route_default = BPPPage;

  // src/pages/plugins/plugins.module.css
  var section2 = "plugins_section";
  var container2 = "plugins_container";
  var toggleButton = "plugins_toggleButton";

  // src/pages/plugins/index.tsx
  var plugins_default = () => {
    const { blacketScope } = BPP.pluginManager.getPlugin("Internals");
    const PageHeader = blacketScope("be");
    const Container = blacketScope("Lo");
    const dashboardStyles = BPP.pluginManager.getPlugin("Internals").styles.dashboard;
    const { useEffect, useState } = BPP.pluginManager.getPlugin("Internals").vendors.normalized.React;
    const plugins = BPP.pluginManager.getPlugins();
    const [pluginStates, setPluginStates] = useState();
    return /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.Fragment, null, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(PageHeader, null, "Blacket++"), /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { className: section2 }, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { style: {
      height: "20vh"
    }, className: `${dashboardStyles.smallButtonContainer} ${container2}` }, plugins.filter((x) => x.name !== "Internals").map((x, i) => /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(Container, { header: {
      text: x.name,
      icon: "fa-solid fa-box"
    }, key: i }, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%"
    } }, /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("span", null, x.description), /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("div", { className: toggleButton, onClick: () => {
      const plugin = BPP.pluginManager.getPlugin(x.name);
    } })))))));
  };

  // src/pages/plugins/route.tsx
  var BPPPage2 = {
    name: "BPPPlugins",
    path: "/bpp/plugins",
    title: "BPP Plugins | Blacket Rewrite",
    topRight: ["tokens" /* TOKENS */],
    sidebar: true,
    background: true,
    dontUseBody: false,
    component: () => /* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement(plugins_default, null)
  };
  var route_default2 = BPPPage2;

  // src/pages/index.tsx
  var routes = [
    route_default,
    route_default2
  ];
  var pages_default = routes;

  // src/plugin/plugins/internals/index.tsx
  var InternalsPlugin = class extends bppPlugin {
    constructor() {
      super("Internals", "0.0.1", "A plugin handling internal features of BPP", [Devs.zastix]);
      this.addPatches([
        {
          find: 'textures.getFrame("__DEFAULT").glTexture',
          replacement: [{
            match: /\.Phaser=(.{0,2})\(\)}\(this,/,
            replace: ".Phaser=$1()}(window,"
          }]
        },
        {
          find: "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED",
          replacement: [
            {
              match: /from".\/index.(.{0,10}).js/,
              replace: `from"${location.origin}/index.$1.js`
            }
          ]
        },
        {
          // this was a string that im 99% sure wont match any file execpt index, if rewrite implments code splitting this will be updated
          find: "iridescent",
          replacement: [
            {
              match: /import"\.\/index\.(.{0,})\.js";/,
              replace: "$self.blacketScope=(a)=>eval(a);"
            },
            {
              match: /import\{(.{0,})\}from"\.\/vendor\.(.{0,10})\.js"/,
              replace: (match, ...groups) => {
                return `$self.vendors={};$self.vendors._vendors=await import("${BPP.patchManager.files.find((file) => file.path.match(/vendor/)).patchedPath}");$self.handleVendors($self);const {${Object.entries([...groups[0].matchAll(/(.{0,1}) as (.{0,1})/g)].reduce((a, [, key, val]) => (a[key] = val, a), {})).reduce((c, d) => c + `${d[0]}:${d[1]},`, "").slice(0, -1)}}=BPP.pluginManager.getPlugin("Internals").vendors.vendors;$self.pages=$self.pages.map(a=>{a.component=a.component();return a;});$self.styles={};`;
              }
            },
            {
              match: /AuctionHouse:(.{0,3}),/,
              replace: (_match, ...groups) => {
                return `AuctionHouse:${groups[0]},${this.pages.map((page, i) => `${page.name}:$self.pages[${i}]`).join(",")},`;
              }
            },
            {
              match: /{to:"\/store",icon:"fas fa-cart-shopping",className:(.{0,3}),backgroundColor:"#2b22c2",children:"Visit Store"}/,
              replace: '{to:"/bpp",icon:"fas fa-plus",className:$1,backgroundColor:"#ff00d8",children:"BPP"}'
            },
            {
              match: /t:(.{0,2})\.jsx\((.{0,2}),{children:(.{0,2})\.jsx\((.{0,2}),/,
              replace: "t:$1.jsx($2,{children:$3.jsx($self.componentHook($4,$self),"
            },
            ...stylePatches
          ]
        }
      ]);
    }
    handleVendors = handleVendors;
    componentHook = CompHook;
    // alot of these stores are not typed bcuz i pulled them directly from blacket github repo and they are not typed there (thanks xotic)
    stores = {};
    storeProviders = {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    blacketScope(txt) {
    }
    pages = pages_default;
    vendors;
    styles;
  };
  var internals_default = new InternalsPlugin();

  // src/plugin/plugins/test.tsx
  var TestPlugin = class extends bppPlugin {
    constructor() {
      super("Test", "0.0.1", "Test", [Devs.zastix]);
    }
    onEnable() {
      console.log(/* @__PURE__ */ window.BPP.pluginManager.pluginList.Internals.vendors.normalized.React.createElement("h1", null, "gyat"));
    }
  };
  var test_default = new TestPlugin();

  // getAllPlugins:~plugins
  var plugins_default2 = () => [test_default, internals_default];

  // src/plugin/pluginManager.ts
  var PluginManager = class extends Logger {
    plugins = [];
    pluginList = {};
    inited = false;
    constructor() {
      super("PluginManager", "#F5A9B8");
    }
    init() {
      this.plugins = plugins_default2();
      this.pluginList = this.plugins.reduce((a, b) => (a[b.name] = b, a), {});
      this.info("Initialized");
      this.inited = true;
    }
    enableAll() {
      this.plugins.forEach((plugin) => {
        plugin.enabled = true;
        plugin.onEnable();
      });
    }
    disableAll() {
      this.plugins.forEach((plugin) => {
        plugin.enabled = false;
        plugin.onDisable();
      });
    }
    enablePlugin(name) {
      const plugin = this.getPlugin(name);
      if (plugin) {
        plugin.enabled = true;
        plugin.onEnable();
      }
    }
    disablePlugin(name) {
      const plugin = this.getPlugin(name);
      if (plugin) {
        plugin.enabled = false;
        plugin.onDisable();
      }
    }
    togglePlugin(name) {
      const plugin = this.getPlugin(name);
      if (plugin) {
        plugin.enabled = !plugin.enabled;
        if (plugin.enabled) {
          plugin.onEnable();
        } else {
          plugin.onDisable();
        }
      }
    }
    getPlugin(name) {
      return this.plugins.find((plugin) => plugin.name === name);
    }
    getPlugins() {
      return this.plugins;
    }
    hasInitialized() {
      return this.inited;
    }
  };
  var pluginManager_default = PluginManager;

  // src/utils/eventManager.ts
  var Events = class {
    subscriptions = /* @__PURE__ */ new Map();
    subscribe(event, callback) {
      logger_default.info("Events", `Subscribed to event '${event}'.`);
      if (!this.subscriptions.has(event)) this.subscriptions.set(event, /* @__PURE__ */ new Set());
      this.subscriptions.get(event).add(callback);
    }
    dispatch(event, payload) {
      logger_default.info("Events", `Dispatched event '${event}'.`);
      if (this.subscriptions.has(event)) this.subscriptions.get(event).forEach((callback) => callback(payload));
    }
  };
  var events = new Events();
  var eventManager_default = events;

  // src/patcher/hard.ts
  var PatchManager = class extends Logger {
    blacklistedFiles = [];
    inited = false;
    allPatches = [];
    files = [];
    constructor() {
      super("PatchManager", "#5BCEFA");
    }
    init() {
      this.info("Initialized");
      this.inited = true;
    }
    addFile(file) {
      this.files.push(file);
    }
    addPatch(patch) {
      this.allPatches.push(patch);
    }
    addPatches(patches) {
      this.allPatches.push(...patches);
    }
    _applyPatches() {
      for (const file of this.files.reverse()) {
        file.patched = file.original;
        const patches = this.allPatches.filter((patch) => {
          if (patch.find instanceof RegExp) return patch.find.test(file.original);
          else return file.original.includes(patch.find);
        });
        for (const patch of patches) {
          const oldPatched = file.patched;
          if (Array.isArray(patch.replacement))
            for (const replacement of patch.replacement) {
              const oldPatched_ = file.patched;
              if (replacement.replace instanceof Function) file.patched = file.patched.replace(replacement.match, replacement.replace(file.patched.match(replacement.match)[0], ...file.patched.match(replacement.match).slice(1))).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
              else file.patched = file.patched.replace(replacement.match, replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
              if (oldPatched_ === file.patched) this.warn(`Patch "${replacement.match}" by plugin "${patch.plugin}" had no effect.`);
            }
          else {
            const oldPatched_ = file.patched;
            if (patch.replacement.replace instanceof Function) file.patched = patch.replacement.replace(file.patched.match(patch.replacement.match)[0], ...file.patched.match(patch.replacement.match).slice(1)).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
            else file.patched = file.patched.replace(patch.replacement.match, patch.replacement.replace).replaceAll("$self", `window.BPP.pluginManager.getPlugin("${patch.plugin}")`);
            if (oldPatched_ === file.patched) this.warn(`Patch "${patch.replacement.match}" by plugin "${patch.plugin}" had no effect.`);
          }
          if (oldPatched !== file.patched && !file.patchedBy.includes(patch.plugin)) file.patchedBy.push(patch.plugin);
        }
        file.patchedPath = URL.createObjectURL(new Blob([`// ${file.path.replace(`${location.origin}/`, "")} ${file.patchedBy.length > 0 ? `- Patched By ${file.patchedBy.join(", ")}` : ""}
`, file.patched], { type: "application/javascript" }));
      }
    }
    async softReload(applyPatches) {
      this.files = [];
      document.open();
      const dom = new DOMParser().parseFromString(await (await fetch(document.location.href)).text(), "text/html");
      Array.from(dom.head.getElementsByTagName("link")).filter((a) => a.rel === "modulepreload" && !this.blacklistedFiles.some((b) => b.test(a.href))).forEach((x) => x.remove());
      const scripts = [...dom.head.getElementsByTagName("script")].filter((a) => this.blacklistedFiles.every((b) => !b.test(a.src))).map((x) => x.cloneNode());
      for (const z of scripts) {
        const script = z;
        if (script.nodeType !== 1) continue;
        if (script.tagName !== "SCRIPT") continue;
        const file = {
          path: script.src,
          original: await (await fetch(script.src)).text(),
          patched: "",
          patchedBy: [],
          patchedPath: ""
        };
        this.addFile(file);
        if (script.src.match(/index/g)) this.addFile({
          path: `${location.origin}/vendor.${file.original.match(/from".\/vendor.(.{0,10}).js"/)[1]}.js`,
          original: await (await fetch(`${location.origin}/vendor.${file.original.match(/from".\/vendor.(.{0,10}).js"/)[1]}.js`)).text(),
          patched: "",
          patchedBy: [],
          patchedPath: ""
        });
      }
      this._applyPatches();
      [...dom.head.children].forEach((x) => {
        if (x.tagName === "SCRIPT") x.remove();
      });
      document.write(dom.documentElement.innerHTML);
      document.close();
      const style = document.createElement("style");
      style.innerHTML = `/* src/pages/main/main.module.css */
.main_mainText {
  color: white;
}
.main_header {
  font-family: Titan One, sans-serif;
}
.main_section {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, .25));
  border-radius: 7px;
  padding-top: 6vh;
  padding-bottom: 6vh;
  margin-left: 10vw;
  margin-right: 10vw;
  background-color: #00000020;
}
.main_container {
  padding-top: 0;
  display: flex;
  flex-direction: row;
  align-content: center;
}

/* src/pages/plugins/plugins.module.css */
.plugins_mainText {
  color: white;
}
.plugins_header {
  font-family: Titan One, sans-serif;
}
.plugins_section {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, .25));
  border-radius: 7px;
  padding-top: 6vh;
  padding-bottom: 6vh;
  margin-left: 10vw;
  margin-right: 10vw;
  background-color: #00000020;
}
.plugins_container {
  padding-top: 0;
  display: flex;
  flex-direction: row;
  align-content: center;
}
.plugins_toggleButton {
  background-color: transparent;
  border: 3px solid white;
  border-radius: 5px;
  width: 10px;
  height: 10px;
  transition: background-color 0.2s;
}
.plugins_toggleButton.plugins_active {
  background-color: white;
}`;
      document.head.append(style);
      for (const x of scripts) {
        const script = x;
        if (script.nodeType !== 1) continue;
        if (script.tagName !== "SCRIPT") continue;
        const newScript = document.createElement("script");
        newScript.type = "module";
        newScript.async = true;
        newScript.src = applyPatches ? this.files.find((file) => file.path === script.src).patchedPath : script.src;
        document.head.append(newScript);
      }
    }
  };

  // src/index.ts
  var BPPClass = class extends Logger {
    pluginManager = new pluginManager_default();
    patchManager = new PatchManager();
    pages = {};
    consts = {
      Devs,
      devsArray
    };
    utils = {
      events: eventManager_default
    };
    constructor() {
      super("BPP", "#5BCEFA");
      this.pluginManager.init();
      this.patchManager.init();
      this.patchManager.addPatches(this.pluginManager.getPlugins().map((plugin) => plugin.patches).flat());
      this.patchManager.softReload(true);
    }
  };
  var BPP = new BPPClass();
  window.BPP = BPP;
  (async () => {
    if (true) {
      if (window.devWs) return;
      console.log("Dev mode enabled, connecting to dev hot-reload server...");
      const ReconnectingWebSocket = (await import("https://cdn.jsdelivr.net/npm/reconnecting-websocket/+esm")).default;
      window.devWs = new ReconnectingWebSocket("ws://localhost:3000/ws", [], {
        maxRetries: 10
      });
      window.devWs.onopen = () => window.devWs.send(JSON.stringify({
        type: "register"
      }));
      window.devWs.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        switch (data.type) {
          case "reload":
            delete window.BPP;
            (0, eval)(await (await fetch("http://localhost:3000/bpp.min.js")).text());
            break;
          case "hmr":
        }
      };
    }
  })();
})();
//made with ❤️ by zastix and allie, https://github.com/zastlx/bppv2