import { TemplateView } from "hydrogen-view-sdk";
import chatterboxLogo from "../res/chat-bubbles.svg";

export class FooterView extends TemplateView {
    render(t) {
        return t.div({ className: "FooterView" },
            [
                t.div([
                    t.img({ src: chatterboxLogo, className: "FooterView_logo" }),
                    t.span({ className: "FooterView_chatterbox-branding" }, "Chatterbox"),
                ]),
                t.div({ className: "FooterView_matrix-branding" }, ["Powered by Matrix"])
            ]);
    }
}
