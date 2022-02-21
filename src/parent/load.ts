import { isMobile } from "./common";
import { toggleIframe } from "./iframe";

const parentHostRoot = ( document.querySelector("#chatterbox-script") as HTMLScriptElement).src;
const hostRoot = new URL(parentHostRoot).origin;

export function loadStartButton() {
    loadCSS();
    const container = document.createElement("div");
    container.className = "start";
    const button = document.createElement("button");
    button.className = "start-chat-btn";
    button.onclick = () => (window as any).isIframeLoaded? toggleIframe() : loadIframe();
    container.appendChild(button);
    document.body.appendChild(container);
}

function loadCSS() {
    const linkElement = document.createElement("link") as HTMLLinkElement;
    linkElement.rel = "stylesheet";
    linkElement.href = new URL("CSS_FILE_NAME", parentHostRoot).href;
    document.head.appendChild(linkElement);
}

function loadIframe() {
    const iframe = document.createElement("iframe");
    const configLocation = (window as any).CHATTERBOX_CONFIG_LOCATION;
    if (!configLocation) {
        throw new Error("CHATTERBOX_CONFIG_LOCATION is not set");
    }
    iframe.src = new URL(
        "../chatterbox.html?config=" + configLocation,
        hostRoot
    ).href;
    iframe.className = "chatterbox-iframe";
    document.body.appendChild(iframe);
    (window as any).isIframeLoaded = true;
    document
        .querySelector(".start-chat-btn")
        .classList.add("start-background-minimized");
    if (isMobile()) {
        (document.querySelector(".start") as HTMLDivElement).style.display =
            "none";
    }
}
