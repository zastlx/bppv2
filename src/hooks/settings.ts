function detectType(value: any): any {
    return value === null ? null : JSON.parse(value);
}

class SettingsDB {
    private storage: Storage = window.localStorage;

    public get(key: string): any {
        return detectType(this.storage.getItem(key));
    }

    public set(key: string, value: any): void {
        this.storage.setItem(key, JSON.stringify(value));
    }

    public remove(key: string): void {
        this.storage.removeItem(key);
    }

    public clear(): void {
        this.storage.clear();
    }

    public exists(key: string): boolean {
        return Object.keys(this.storage).includes(key);
    }


    public keys(): string[] {
        return Object.keys(this.storage);
    }

    public values(): any[] {
        return Object.values(this.storage);
    }

    public entries(): [string, any][] {
        return Object.entries(this.storage);
    }


    public getOrSet(key: string, value: any): any {
        const v = this.get(key);
        if (v === null || v === undefined) {
            this.set(key, value);
            return value;
        }
        return v;
    }

    public push(key: string, value: any): void {
        const current = this.get(key) || [];
        if (Array.isArray(current)) current.push(value);
        else this.set(key, [...current, value]);
    }

    public pushIfNotExists(key: string, value: any): void {
        const current = this.get(key) || [];
        if (Array.isArray(current) && !current.includes(value)) current.push(value);
        else this.set(key, [...current, value]);
    }

    public querySet(queryFn: (key: string, value: any) => any): void {
        const keys = this.keys();
        for (const key of keys) {
            const r = queryFn(key, this.get(key));
            if (r) this.set(key, r);
        }
    }

    public removeArrayItem(key: string, value: any): void {
        const current = this.get(key);
        if (Array.isArray(current)) {
            const index = current.indexOf(value);
            if (index > -1) {
                current.splice(index, 1);
                this.set(key, current);
            }
        }
    }
}

const useSettings = () => {
    const settings = new SettingsDB();

    return settings;
}

export { SettingsDB, useSettings };