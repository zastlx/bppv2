import { CSSProperties } from "react";
import { Resource } from "@blacket/types";
import { PlacementType } from "src/views/Leaderboard/leaderboard";
import { PublicUser } from "@blacket/types";
import { PrivateUser } from "@blacket/types";
import { AuctionsAuctionEntity, AuctionsSearchAuctionDto } from "@blacket/types";
import { Socket } from "socket.io-client";
import type * as Square from "@square/web-payments-sdk-types";
import { ReactNode } from "react";
import { Banner, Blook, Emoji, Font, Item, ItemShop, Pack, Rarity, Title } from "@blacket/types";
import { Message } from "@blacket/types";


export interface ChatStoreContext {
    messages: Message[];
    usersTyping: { userId: string, startedTypingAt: number }[];
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    fetchMessages: (room: number) => void;
    sendMessage: (content: string) => void;
    startTyping: () => void;
    mentions: number;
    resetMentions: () => void;
}

export interface TypingUser {
    userId: string;
    startedTypingAt: number;
}

export interface DataStoreContext {
    badges: any[];
    setBadges: (badges: any[]) => void;
    banners: Banner[];
    setBanners: (banners: Banner[]) => void;
    blooks: Blook[];
    setBlooks: (blooks: Blook[]) => void;
    emojis: Emoji[];
    setEmojis: (emojis: Emoji[]) => void;
    fonts: Font[];
    setFonts: (fonts: Font[]) => void;
    items: Item[];
    setItems: (items: Item[]) => void;
    itemShop: ItemShop[];
    setItemShop: (itemShop: ItemShop[]) => void;
    packs: Pack[];
    setPacks: (packs: Pack[]) => void;
    rarities: Rarity[];
    setRarities: (rarities: Rarity[]) => void;
    titles: Title[];
    setTitles: (titles: Title[]) => void;

    titleIdToText: (id: number) => string;
    fontIdToName: (id: number) => string;
}
export interface Config {
    version: string
}

export interface ConfigStoreContext {
    config: Config | null,
    setConfig: (config: Config) => void
}
export interface LoadingStoreContext {
    loading: boolean | string;
    setLoading: (loading: boolean | string) => void;
}


export interface Modals {
    id: string;
    modal: ReactNode;
}

export interface ModalStoreContext {
    modals: Modals[];
    setModals: (modals: { id: string, modal: ReactNode }[]) => void;
    createModal: (modal: ReactNode) => string;
    closeModal: () => void;
}


export interface SquareStoreContext {
    payments: Square.Payments | null;
}


export interface SocketStoreContext {
    socket: Socket | null,
    connected: boolean,
    initializeSocket: () => void
}


export interface AuctionHouseStoreContext {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    auctions: AuctionsAuctionEntity[];
    setAuctions: (auctions: AuctionsAuctionEntity[]) => void;
    search: AuctionsSearchAuctionDto;
    setSearch: (search: AuctionsSearchAuctionDto) => void;
    getAuctions: () => void;
}


export interface UserStoreContext {
    user: PrivateUser | null;
    setUser: (user: PrivateUser | null) => void;
    getUserAvatarPath: (user: PrivateUser) => string;
}


export interface CachedUserStoreContext {
    cachedUsers: PublicUser[];
    setCachedUsers: (cachedUsers: PublicUser[]) => void;
    addCachedUser: (userId: string) => Promise<PublicUser>;
    addCachedUserWithData: (user: PublicUser) => void;
}



export interface LeaderboardStoreContext {
    sortBy: PlacementType;
    setSortBy: (sortBy: PlacementType) => void;
    leaderboard: {
        tokens: PublicUser[];
        experience: PublicUser[];
    } | null;
    setLeaderboard: (leaderboard: {
        tokens: PublicUser[];
        experience: PublicUser[];
    }) => void;
}


export interface ResourceStoreContext {
    resources: Resource[];
    setResources: (resources: Resource[]) => void;
    resourceIdToPath: (id: number) => string;
}


export interface ContextMenu {
    items: Array<{
        divider?: boolean;
        icon?: string;
        image?: string;
        color?: string;
        onClick?: () => void;
        label?: string;
    }>;
    x?: number;
    y?: number;
}

export interface ContextMenuContext {
    contextMenu: ContextMenu | null;
    setContextMenu: (contextMenu: ContextMenu) => void;
    openContextMenu: (items: ContextMenu["items"]) => void;
    closeContextMenu: () => void;
}

export interface ContainerProps {
    visible: boolean;
    top: CSSProperties["top"];
    left: CSSProperties["left"];
    children: ReactNode;
}

export interface ItemProps {
    icon?: string;
    image?: string;
    color?: string;
    children: ReactNode;
    onClick: () => void;
}
