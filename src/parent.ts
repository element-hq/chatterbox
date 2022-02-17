import "./parent-style.css";

let isIframeLoaded = false;
const parentHostRoot = (document.querySelector("#chatterbox-script") as HTMLScriptElement).src;
const parentHosRootURL = new URL(parentHostRoot);
const hostRoot = `${parentHosRootURL.protocol}${parentHosRootURL.host}`;

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

window.addEventListener("message", event => {
    const { action } = event.data;
    switch (action) {
        case "resize-iframe":
            resizeIframe(event.data);
            break;
        case "minimize":
            minimizeIframe();
            break;
    }
});

function isMobile() {
    return window.innerWidth <= 800 && window.innerHeight <= 930;
}

function renderStartButton() {
    loadCSS();
    const container = document.createElement("div");
    container.className = "start";
    const button = document.createElement("button");
    button.className = "start-chat-btn";
    button.onclick = () => isIframeLoaded? minimizeIframe() : loadChatterboxIframe();
    container.appendChild(button);
    document.body.appendChild(container);
}

function loadCSS() {
    const linkElement = document.createElement("link") as HTMLLinkElement;
    linkElement.rel = "stylesheet";
    linkElement.href = new URL("CSS_FILE_NAME", parentHostRoot).href;
    document.head.appendChild(linkElement);
}

function loadChatterboxIframe() {
    const iframe = document.createElement("iframe");
    const configLocation = (window as any).CHATTERBOX_CONFIG_LOCATION;
    if (!configLocation) {
        throw new Error("CHATTERBOX_CONFIG_LOCATION is not set");
    }
    iframe.src = new URL("../chatterbox.html?config=" + configLocation, hostRoot).href;
    iframe.className = "chatterbox-iframe";
    document.body.appendChild(iframe);
    isIframeLoaded = true;
    document.querySelector(".start-chat-btn").classList.add("start-background-minimized");
    if (isMobile()) {
        (document.querySelector(".start") as HTMLDivElement).style.display = "none";
    }
}

function minimizeIframe() {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    const startButtonDiv = document.querySelector(".start") as HTMLDivElement;
    if (iframeElement.style.display !== "none") {
        iframeElement.style.display = "none";
        document.querySelector(".start-chat-btn").classList.remove("start-background-minimized");
        if (isMobile()) {
            startButtonDiv.style.display = "block";
        }
    }
    else {
        iframeElement.style.display = "block";
        document.querySelector(".start-chat-btn").classList.add("start-background-minimized");
        if (isMobile()) {
            startButtonDiv.style.display = "none";
        }
    }
}

function resizeIframe(data) {
    const { view } = data;
    const type = isMobile()? "mobile": "desktop";
    const size = sizeCollection[type][view];
    if (!size) { return; }
    const { height, width } = size;
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    if (height) { iframeElement.style.height = height; }
    if (width) { iframeElement.style.width = width; }
}

renderStartButton();
