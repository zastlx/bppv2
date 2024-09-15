import React from "react";
import ReactDOM from "react-dom";
import * as SocketIOClient from "socket.io-client";
import spitroast from "spitroast";

export interface Vendors {
    vendors: { [key: string]: any };
    _vendors: { [key: string]: any };
    normalized: {
        React: typeof React;
        ReactDOM: typeof ReactDOM;
        SocketIOClient: typeof SocketIOClient;
        useNavigate: NavigateFunction;
    };
    map: {
        React: string;
        ReactDOM: string;
        SocketIOClient: string;
        useNavigate: string;
    };
};

export interface softPatch {
    type: "after" | "before" | "instead";
    target: string;
    oneTime: boolean;
    vendor: keyof Vendors["normalized"];
};

export interface afterSoftPatch extends softPatch {
    type: "after";
    method: typeof spitroast.after;
};

export interface beforeSoftPatch extends softPatch {
    type: "before";
    method: typeof spitroast.before;
};

export interface insteadSoftPatch extends softPatch {
    type: "instead";
    method: typeof spitroast.instead;
};

/**
 * The interface for the navigate() function returned from useNavigate().
 */
export interface NavigateFunction {
    (to: To, options?: NavigateOptions): void;
    (delta: number): void;
}