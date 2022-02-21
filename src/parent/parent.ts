import { resizeIframe, toggleIframe } from "./iframe";
import { loadStartButton } from "./load";
import "./parent-style.css";

(window as any).isIframeLoaded = false;

window.addEventListener("message", event => {
    const { action } = event.data;
    switch (action) {
        case "resize-iframe":
            resizeIframe(event.data);
            break;
        case "minimize":
            toggleIframe();
            break;
    }
});

loadStartButton();
