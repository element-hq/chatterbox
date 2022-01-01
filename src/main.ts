import { Chatterbox } from "./Chatterbox";
import type { IChatterboxConfig } from "./types/IChatterboxConfig";

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
    const config = await fetchConfig(root);
    const chatterbox = new Chatterbox(config, root);
    chatterbox.start();
}

main();
