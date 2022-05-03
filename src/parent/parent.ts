import { resizeIframe, toggleIframe } from "./iframe";
import { loadStartButton } from "./load";
import "./parent-style.css";

(window as any).isIframeLoaded = false;

function setUnreadCount(count) {
    const notification = document.querySelector(".notification-badge") as HTMLSpanElement;
    if (count === 0) {
        notification.classList.add("hidden");
    }
    else {
        notification.innerText = count;
        notification.classList.remove("hidden");
    }
}

window.addEventListener("message", event => {
    const { action } = event.data;
    switch (action) {
        case "resize-iframe":
            if (event.data.view === "timeline") {
                // Chatterbox has made it to the timeline!
                // Store this is info in localStorage so that we know to load chatterbox in background
                // in subsequent visits.
                window.localStorage.setItem("chatterbox-should-load-in-background", "true");
            }
            resizeIframe(event.data);
            break;
        case "minimize":
            toggleIframe();
            break;
        case "unread-message":
            setUnreadCount(event.data.count);
            break;
    }
});

loadStartButton();
