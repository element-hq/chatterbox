const configLocation = "./config.json";
let isIframeLoaded = false;

const sizeCollection = {
    "desktop": {
        "account-setup": { height: "160px", width: "360px" },
        "timeline": {height: "600px", width: "400px"}
    },
    "mobile": {
        "account-setup": { height: "100vh", width: "100vw" },
        "timeline": {height: "100vh", width: "100vw"}
    }
}

window.addEventListener("message", event => {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    const { action } = event.data;
    switch (action) {
        case "resize-iframe":
            const { view } = event.data;
            const size = sizeCollection.desktop[view];
            if (!size) { return; }
            const { height, width } = size;
            if (height) { iframeElement.style.height = height; }
            if (width) { iframeElement.style.width = width; }
            break;
        case "minimize":
            minimizeIframe();
            break;
    }
});

function renderStartButton() {
    const container = document.createElement("div");
    container.className = "start";
    const button = document.createElement("button");
    button.className = "StartChat";
    button.onclick = () => isIframeLoaded? minimizeIframe() : loadChatterboxIframe();
    container.appendChild(button);
    document.body.appendChild(container);
}

function loadChatterboxIframe() {
    const iframe = document.createElement("iframe");
    iframe.src = `./chatterbox.html?config=${configLocation}`;
    iframe.className = "chatterbox-iframe";
    document.body.appendChild(iframe);
    isIframeLoaded = true;
}

function minimizeIframe() {
    const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;
    if (iframeElement.style.display !== "none") {
        iframeElement.style.display = "none";
    }
    else {
        iframeElement.style.display = "block";
    }

}

renderStartButton();
