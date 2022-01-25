/*
This script will resize the iframe based on messages
*/
const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;

const sizeCollection = {
    "desktop": {
        "start": { height: "50px", width: "50px" },
        "account-setup": { height: "115px", width: "360px" },
        "timeline": {height: "600px", width: "400px"}
    }
}

window.addEventListener("message", event => {
    const view = event.data;
    const size = sizeCollection.desktop[view];
    const { height, width } = size;
    if (height) { iframeElement.style.height = height; }
    if (width) { iframeElement.style.width = width; }
});
