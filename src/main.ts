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

async function fetchConfig(): Promise<IChatterboxConfig> {
    const queryParams = new URLSearchParams(window.location.search);
    const configLink = queryParams.get("config");
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
    const config = await fetchConfig();
    const platform = new Platform({container: root, assetPaths, config: {}, options: { development: import.meta.env.DEV }});
    const navigation = new Navigation(allowsChild);
    platform.setNavigation(navigation);
    const urlRouter = createRouter({ navigation, history: platform.history });
    const rootViewModel = new RootViewModel(config, {platform, navigation, urlCreator: urlRouter});
    rootViewModel.start();
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

(window as any).sendViewChangeToParent = function (view: "timeline" | "account-setup") {
    window.parent?.postMessage({
        action: "resize-iframe",
        view
    }, "*");
};

(window as any).sendMinimizeToParent = function () {
    window.parent?.postMessage({ action: "minimize" }, "*");
};

main();
