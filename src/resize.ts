/*
This script will resize the iframe based on messages
*/
const iframeElement = document.querySelector(".chatterbox-iframe") as HTMLIFrameElement;

window.addEventListener("message", event => {
    const { action, params } = event.data;
    if (action === "resize-iframe") {
        const { height, width } = params;
        if (height) { iframeElement.style.height = height; }
        if (width) { iframeElement.style.width = width; }
    }
});
