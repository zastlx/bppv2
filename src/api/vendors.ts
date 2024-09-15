import { NavigateFunction, Vendors, afterSoftPatch, beforeSoftPatch, insteadSoftPatch, softPatch } from "#types/api/vendors";
import { Logger } from "#utils/logger";
import React from "react";
import ReactDOM from "react-dom";
import * as SocketIOClient from "socket.io-client";
import * as spitroast from "spitroast";

interface VendorCheck {
    type: "property" | "toString";
    value: string;
}

export class VendorManager extends Logger {
    private readonly checks: { [name: string]: VendorCheck } = {
        React: {
            type: "property",
            value: "useState"
        },
        ReactDOM: {
            type: "toString",
            value: ".onRecoverableError"
        },
        SocketIOClient: {
            type: "property",
            value: "io"
        },
        useNavigate: {
            type: "toString",
            value: "UseNavigateStable"
        }
        // ReactHelmetProvider: "canUseDom",
        // ReactHelmet: "Helmet does not support rendering"
    };
    private vendors: Vendors;
    private softPatches: (afterSoftPatch | beforeSoftPatch | insteadSoftPatch)[];

    constructor(softPatches: afterSoftPatch[] | beforeSoftPatch[] | insteadSoftPatch[]) {
        super("VendorManager", "#9C59D1");

        this.softPatches = softPatches;
    }

    public addSoftPatch(patch: afterSoftPatch | beforeSoftPatch | insteadSoftPatch): void {
        this.softPatches.push(patch);
    }

    public getVendorByName(name: "React"): typeof React;
    public getVendorByName(name: "ReactDOM"): typeof ReactDOM;
    public getVendorByName(name: "SocketIOClient"): typeof SocketIOClient;
    public getVendorByName(name: "useNavigate"): NavigateFunction;
    public getVendorByName(name: keyof Vendors["normalized"]) {
        return this.vendors.normalized[name];
    }


    public init(): void {
        this.vendors.vendors = Object.fromEntries(Object.entries(this.vendors._vendors));

        const vendorsV = Object.values(this.vendors.vendors);
        const vendorsK = Object.keys(this.vendors.vendors);

        const vendorsNormalized = {};
        for (const check in this.checks) {
            vendorsNormalized[check] = vendorsV.find((vendor) => {
                if (this.checks[check].type === "property") return vendor[this.checks[check].value];
                return vendor.toString().includes(this.checks[check].value);
            });
        }
        this.vendors.normalized = vendorsNormalized as Vendors["normalized"];

        const vendorsMap = {};
        for (const vendor in this.vendors.normalized) {
            vendorsMap[vendor] = vendorsK.find((vendorK) => this.vendors.vendors[vendorK] === this.vendors.normalized[vendor]);
        }
        this.vendors.map = vendorsMap as Vendors["map"];

        for (const patch of this.softPatches) {
            // @ts-expect-error - TS doesn't like the dynamic nature of this
            spitroast[patch.type](patch.target, this.vendors.normalized[patch.vendor], patch.method, patch.oneTime);
        }
    }
}