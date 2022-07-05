import { TemplateView } from "hydrogen-view-sdk";
import chatterboxLogo from "../res/chat-bubbles.svg";
import { FooterViewModel } from "../../viewmodels/FooterViewModel";

export class FooterView extends TemplateView<FooterViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm) {
        return t.div({ className: "FooterView" }, [
            t.div([
                t.img({ src: chatterboxLogo, className: "FooterView_logo" }),
                t.button(
                    {
                        className: "FooterView_chatterbox-branding",
                        onClick: () => vm.openChatterboxLink(),
                    },
                    "Chatterbox"
                ),
            ]),
            t.button(
                {
                    className: "FooterView_matrix-branding",
                    onClick: () => vm.openMatrixLink(),
                },
                ["Powered by Matrix"]
            ),
        ]);
    }
}
