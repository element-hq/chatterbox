import type { IChatterboxConfig } from "./types/IChatterboxConfig";
import { Platform, createNavigation, createRouter } from "hydrogen-view-sdk";
import { RootViewModel } from "./viewmodels/RootViewModel";
import { RootView } from "./ui/views/RootView";
import assetPaths from "hydrogen-view-sdk/paths/vite";

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
    const navigation = createNavigation();
    platform.setNavigation(navigation);
    const urlRouter = createRouter({ navigation, history: platform.history });
    urlRouter.attach();
    const rootViewModel = new RootViewModel(config, {platform, navigation, urlCreator: urlRouter});
    const rootView = new RootView(rootViewModel);
    root.appendChild(rootView.mount());
}

main();
