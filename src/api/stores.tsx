import { BPP, BPPClass } from "#index";
import { AuctionHouseStoreContext, CachedUserStoreContext, ChatStoreContext, ConfigStoreContext, ContextMenuContext, DataStoreContext, LeaderboardStoreContext, LoadingStoreContext, ModalStoreContext, ResourceStoreContext, SocketStoreContext, SquareStoreContext, UserStoreContext } from "#types/blacket/stores";
import Logger from "#utils/logger";
import { Context } from "react";

type StoreContexts = Partial<{
    auctionHouse: Context<AuctionHouseStoreContext>,
    cachedUser: Context<CachedUserStoreContext>,
    chat: Context<ChatStoreContext>,
    config: Context<ConfigStoreContext>,
    contextMenu: Context<ContextMenuContext>,
    data: Context<DataStoreContext>,
    leaderboard: Context<LeaderboardStoreContext>,
    loading: Context<LoadingStoreContext>,
    modal: Context<ModalStoreContext>,
    resource: Context<ResourceStoreContext>,
    socket: Context<SocketStoreContext>,
    square: Context<SquareStoreContext>,
    user: Context<UserStoreContext>
}>;

export class StoreManager extends Logger {
    private stores: StoreContexts = {};
    private storeProviders: StoreContexts = {};
    private checks = {
        auctionHouse: "setAuctions",
        cachedUser: "addCachedUser",
        chat: "setReplyingTo",
        config: "setConfig",
        contextMenu: "setContextMenu",
        data: "titleIdToText",
        leaderboard: "setLeaderboard",
        loading: (a: any) => !a.setAuctions && a?.["setLoading"],
        modal: "createModal",
        resource: "setResources",
        socket: "initializeSocket",
        square: "payments",
        user: "getUserAvatarPath"
    };

    constructor() {
        super("StoreManager", "#FCF434");
    }

    // const storethis.checks = {
    //     modal: "setModals",
    //     user: "setUser",
    //     socket: "initializeSocket",
    //     fonts: "setFonts",
    //     config: "setConfig",
    //     loading: "setLoading",
    //     leaderboard: "setLeaderboard",
    //     blooks: "setBlooks",
    //     rarities: "setRarities",
    //     packs: "setPacks",
    //     items: "setItems",
    //     banners: "setBanners",
    //     badges: "setBadges",
    //     emojis: "setEmojis",
    //     cachedUsers: "addCachedUser",
    //     chat: "usersTyping",
    //     contextManu: "closeContextMenu"
    // };

    public init(BPP: BPPClass): void {
        BPP.vendorManager.addSoftPatch({
            type: "after",
            target: "createContext",
            vendor: "React",
            method: this.createCtxHook.bind(this),
            oneTime: false,
        })
    };


    public getStores(): StoreContexts {
        return this.stores;
    }

    public getStoreProviders(): StoreContexts {
        return this.storeProviders;
    }

    public getStoreByName(name: keyof StoreContexts): Context<any> {
        return this.stores[name];
    }
    // after("createContext", this.vendors.normalized.React, (args, ret) => {
    //     const store = Object.entries(storethis.checks).find((a) => args[0]?.[a[1]])?.[0];
    //     if (!store) return;

    //     this.storeProviders[store] = ret;
    // });

    private createCtxHook(args: any, ret: any) {
        debugger;
        const store = Object.entries(this.checks).find((checksKV) => {
            if (typeof checksKV[1] === "function") return checksKV[1](args[0]);
            return args[0]?.[checksKV[1]];
        });
        if (!store) return;

        this.storeProviders[store[0]] = ret;
    }

    public componentHook(Comp: React.FC) {
        return () => {
            for (const store in this.storeProviders) {
                this.stores[store] = BPP.vendorManager.getVendorByName("React").useContext(this.storeProviders[store]);
            }

            return <Comp />;
        };
    }
};