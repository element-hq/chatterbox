import "./parent-style.css";

let isIframeLoaded = false;
const parentRootHost = (document.querySelector("#chatterbox-script") as HTMLScriptElement).src;
const parentRootHostURL = new URL(parentRootHost);
const rootHost = `${parentRootHostURL.protocol}${parentRootHostURL.host}`;

const sizeCollection = {
    "desktop": {
        "account-setup": { height: "110px", width: "360px" },
        "timeline": {height: "600px", width: "375px"}
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
    button.className = "StartChat";
    button.onclick = () => isIframeLoaded? minimizeIframe() : loadChatterboxIframe();
    container.appendChild(button);
    document.body.appendChild(container);
}

function loadCSS() {
    const linkElement = document.createElement("link") as HTMLLinkElement;
    linkElement.rel = "stylesheet";
    const urlFixed = new URL("cssFileName", parentRootHost);
    linkElement.href = urlFixed.href;
    document.head.appendChild(linkElement);
}

function loadChatterboxIframe() {
    const iframe = document.createElement("iframe");
    const configLocation = (window as any).CONFIG_LOCATION;
    if (!configLocation) {
        throw new Error("CONFIG_LOCATION is not set");
    }
    iframe.src = new URL("../chatterbox.html?config=" + configLocation, rootHost).href;
    iframe.className = "chatterbox-iframe";
    document.body.appendChild(iframe);
    isIframeLoaded = true;
    if (isMobile()) {
        (document.querySelector(".start") as HTMLButtonElement).style.display = "none";
    }
}

function minimizeIframe() {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    const startButton = document.querySelector(".start") as HTMLButtonElement;
    if (iframeElement.style.display !== "none") {
        iframeElement.style.display = "none";
        if (isMobile()) {
            startButton.style.display = "block";
        }
    }
    else {
        iframeElement.style.display = "block";
        if (isMobile()) {
            startButton.style.display = "none";
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
