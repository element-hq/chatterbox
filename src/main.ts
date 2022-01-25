import type { IChatterboxConfig } from "./types/IChatterboxConfig";
import { Platform, createRouter, Navigation } from "hydrogen-view-sdk";
import { RootViewModel } from "./viewmodels/RootViewModel";
import { RootView } from "./ui/views/RootView";
import downloadSandboxPath from "hydrogen-view-sdk/download-sandbox.html?url";
import workerPath from "hydrogen-view-sdk/main.js?url";
import olmWasmPath from "@matrix-org/olm/olm.wasm?url";
import olmJsPath from "@matrix-org/olm/olm.js?url";
import olmLegacyJsPath from "@matrix-org/olm/olm_legacy.js?url";
const assetPaths = {
    downloadSandbox: downloadSandboxPath,
    worker: workerPath,
    olm: {
        wasm: olmWasmPath,
        legacyBundle: olmLegacyJsPath,
        wasmBundle: olmJsPath,
    },
};

const rootDivId = "#chatterbox";

async function fetchConfig(root: HTMLDivElement): Promise<IChatterboxConfig> {
    const configLink = root?.dataset.configLink;
    if (!configLink) {
        throw new Error("Root element does not have config specified");
    }
    const config: IChatterboxConfig = await (await fetch(configLink)).json();
    return config;
}

async function main() {
    const root = document.querySelector(rootDivId) as HTMLDivElement;
    if (!root) {
        throw new Error("No element with id as 'chatterbox' found!");
    }
    root.className = "hydrogen";
    const config = await fetchConfig(root);
    const platform = new Platform(root, assetPaths, {}, { development: import.meta.env.DEV });
    const navigation = new Navigation(allowsChild);
    platform.setNavigation(navigation);
    const urlRouter = createRouter({ navigation, history: platform.history });
    const rootViewModel = new RootViewModel(config, {platform, navigation, urlCreator: urlRouter});
    const rootView = new RootView(rootViewModel);
    root.appendChild(rootView.mount());
}

function allowsChild(parent, child) {
    const { type } = child;
    switch (parent?.type) {
        case undefined:
            return type === "start" || type === "account-setup" || type === "timeline";
        default:
            return false;
    }
}

function sendFrameResizeEventToParent(height?: number, width?: number) {
    const message = { action: "resize-iframe", params: { height, width } };
    window.parent?.postMessage(message);
}

(window as any).sendFrameResizeEventToParent = sendFrameResizeEventToParent;
main();
