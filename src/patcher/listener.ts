import { iPatch } from "#types";
import { patchInline } from "./hard";
import softRefresh from "#utils/softRefresh";

/**
 * Soft-refreshes the page and applies patches.   
 * Optional -- This is *very* unstable.
 */
export function refreshPatch(patches: iPatch[]) {
    const moOptions = {
        childList: true,
        subtree: true
    };
    
    const mo = new MutationObserver((changes) => {
        for (const change of changes) {
            if (change.type === "childList") {
                for (const node of change.addedNodes) {
                    if (node instanceof HTMLScriptElement) {
                        if (node.src.startsWith('/index.') && node.src.endsWith('.js')) {
                            const copy = node.cloneNode();
                            const copyText = copy.textContent;
                            node.remove();

                            const patched = patchInline(patches, copyText);
                            const s = document.createElement("script");
                            s.type = 'module';
                            s.async = true;
                            s.src = URL.createObjectURL(new Blob([patched], { type: 'application/javascript' }));

                            mo.disconnect();
                        }
                    }
                }
            }
        }
    });

    softRefresh();

    mo.observe(document.head, moOptions);
}