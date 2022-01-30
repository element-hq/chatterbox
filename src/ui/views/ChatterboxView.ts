import { TemplateView, TimelineView, LoadingView, AvatarView } from "hydrogen-view-sdk";
import { MessageComposer } from "hydrogen-view-sdk";
import { ChatterboxViewModel } from "../../viewmodels/ChatterboxViewModel";

export class ChatterboxView extends TemplateView<ChatterboxViewModel> {
    constructor(value) {
        super(value);
    }

    render(t) {
        return t.div({ className: "ChatterboxView" }, [
            t.mapView(
                (vm) => (vm.roomViewModel ? vm : null),
                (vm) => (vm ? new RoomHeaderView(vm) : null)
            ),
            t.mapView(
                (vm) => vm.timelineViewModel,
                (vm) => (vm ? new TimelineView(vm) : new LoadingView())
            ),
            t.mapView(
                (vm) => vm.messageComposerViewModel,
                (vm) => (vm ? new MessageComposer(vm) : null)
            ),
            t.div({ className: "ChatterboxView_footer" }, [
                "Powered by",
                t.img({ src: "./src/ui/res/matrix-logo.svg" }),
            ]),
        ]);
    }
}

class RoomHeaderView extends TemplateView<ChatterboxViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: ChatterboxViewModel) {
        return t.div({ className: "RoomHeaderView" }, [
            t.view(new AvatarView(vm.roomViewModel, 30)),
            t.div({ className: "RoomHeaderView_name" }, vm => vm.roomViewModel.name),
            t.div({ className: "RoomHeaderView_menu" }, [
                t.button({ className: "RoomHeaderView_menu_minimize", onClick: () => (window as any).sendMinimizeToParent() })
            ]),
        ]);
    }
}
