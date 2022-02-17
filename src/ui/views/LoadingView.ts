import { TemplateView } from "hydrogen-view-sdk";

export class LoadingView extends TemplateView {
    render(t) {
        return t.div({ className: "ChatterboxLoadingView" }, [
            t.div({ className: "chatterbox-spinner" }, [
                t.div({ className: "loader" }),
            ]),
            t.span({className: "LoadingText"}, "Loading")
        ]);
    }
}
