import { isMobile } from "./common";

const sizeCollection = {
    "desktop": {
        "account-setup": { height: "334px", width: "375px" },
        "timeline": {height: "595px", width: "375px"}
    },
    "mobile": {
        "account-setup": { height: "100vh", width: "100vw" },
        "timeline": {height: "100vh", width: "100vw"}
    }
}

export function toggleIframe() {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    const startButtonDiv = document.querySelector(".start") as HTMLDivElement;
    if (iframeElement.style.display !== "none") {
        iframeElement.style.display = "none";
        document.querySelector(".start-chat-btn").classList.remove("start-background-minimized");
        iframeElement.contentWindow.postMessage({ action: "minimize" }, "*");;
        if (isMobile()) {
            startButtonDiv.style.display = "block";
        }
    }
    else {
        iframeElement.contentWindow.postMessage({ action: "maximize" }, "*");;
        iframeElement.style.display = "block";
        document.querySelector(".start-chat-btn").classList.add("start-background-minimized");
        if (isMobile()) {
            startButtonDiv.style.display = "none";
        }
    }
}

export function resizeIframe(data) {
    const { view } = data;
    const type = isMobile()? "mobile": "desktop";
    const size = sizeCollection[type][view];
    if (!size) { return; }
    const { height, width } = size;
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    if (height) { iframeElement.style.height = height; }
    if (width) { iframeElement.style.width = width; }
}

export function removeIframe() {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    iframeElement?.remove();
    const startButton = document.querySelector(".start") as HTMLDivElement;
    startButton.remove();
}
