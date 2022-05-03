import { EventEmitter } from "hydrogen-view-sdk";

export class MessageFromParent extends EventEmitter {
    constructor() {
        super();
        window.addEventListener("message", (event) => {
            const { action } = event.data;
            this.emit(action, event.data);
        });
    }
}
