import { iPatch } from "#types/patcher";
import { Loggable } from "#utils/logger";

interface iFile {
    path: string;
    original: string;
    patched: string;
    patches: iPatch[];
}

class PatchManager extends Loggable {
    private allPatches: iPatch[] = [];
    private files: iFile[] = [];

    constructor() {
        super("PatchManager");
    }

    init(): void {
    }

    softReload(): void {

    }