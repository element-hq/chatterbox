import type { IChatterboxConfig } from "./types/IChatterboxConfig";
import { Platform, createRouter, Navigation } from "hydrogen-view-sdk";
import { RootViewModel } from "./viewmodels/RootViewModel";
import { RootView } from "./ui/views/RootView";
import downloadSandboxPath from "hydrogen-view-sdk/download-sandbox.html?url";
import workerPath from "hydrogen-view-sdk/main.js?url";
import olmWasmPath from "@matrix-org/olm/olm.wasm?url";
import olmJsPath from "@matrix-org/olm/olm.js?url";
import olmLegacyJsPath from "@matrix-org/olm/olm_legacy.js?url";
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

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

function shouldStartMinimized(): boolean {
    return !!new URLSearchParams(window.location.search).get("minimized");
}

async function main() {
    hideOnError();
    const root = document.querySelector(rootDivId) as HTMLDivElement;
    if (!root) {
        throw new Error("No element with id as 'chatterbox' found!");
    }
    root.className = "hydrogen";
    const config = await fetchConfig();

    if (config.sentry) {
        Sentry.init({
            dsn: config.sentry.dsn,
            release: "my-project-name@2.3.12",
            integrations: [new BrowserTracing()],
            
        });
        Sentry.setTag("homeserver", config.homeserver);
        Sentry.setTag("encrypt_room", config.encrypt_room);
        if (config.invite_user) {
            Sentry.setTag("mode", "invite_user");
        } else if (config.auto_join_room) {
            Sentry.setTag("mode", "auto_join_room");
        } else {
            Sentry.setTag("mode", "unknown");
        }
    }

    const platform = new Platform({container: root, assetPaths, config: {}, options: { development: import.meta.env.DEV }});
    const navigation = new Navigation(allowsChild);
    platform.setNavigation(navigation);
    const urlRouter = createRouter({ navigation, history: platform.history });
    const startMinimized = shouldStartMinimized();
    const rootViewModel = new RootViewModel(config, {platform, navigation, urlCreator: urlRouter, startMinimized});
    rootViewModel.start();
    const rootView = new RootView(rootViewModel);
    root.appendChild(rootView.mount());
}

function allowsChild(parent, child) {
    const { type } = child;
    switch (parent?.type) {
        case undefined:
            return type === "start" || type === "account-setup" || type === "timeline" || type === "minimize";
        default:
            return false;
    }
}

function hideOnError() {
    // When an error occurs, log it and then hide everything!
    const handler = e => {
        Sentry.captureException(e, { tags: {
            "fatalError": true
        }});
        if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
            e.message === "ResizeObserver loop limit exceeded" ||
            // hydrogen renders an <img> with src = undefined while the image is being decrypted
            // todo: resolve this
            e.target.tagName === "IMG") {
            // see https://stackoverflow.com/a/64257593
            e.stopImmediatePropagation();
            return false;
        }
        console.error(e.error ?? e.reason);
        (window as any).sendError();
        return false;
    };
    window.addEventListener("error", handler, true);
    window.addEventListener("unhandledrejection", handler, true);
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

(window as any).sendNotificationCount = function (count: number) {
    window.parent?.postMessage({ action: "unread-message", count }, "*");
};

(window as any).sendError = function () {
    window.parent?.postMessage({ action: "error" }, "*");
};

main();
