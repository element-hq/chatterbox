import { TemplateView, TimelineView, AvatarView, viewClassForTile } from "hydrogen-view-sdk";
import { MessageComposer } from "hydrogen-view-sdk";
import { ChatterboxViewModel } from "../../viewmodels/ChatterboxViewModel";
import { FooterView } from "./FooterView";
import { LoadingView } from "./LoadingView";

export class ChatterboxView extends TemplateView<ChatterboxViewModel> {
    constructor(value) {
        super(value);
    }

    render(t) {
        return t.div({ className: "ChatterboxView", },
            [
            t.mapView(
                (vm) => (vm.roomViewModel ? vm : null),
                (vm) => (vm ? new RoomHeaderView(vm) : null)
            ),
            t.mapView(
                (vm) => vm.timelineViewModel,
                (vm) => (vm ? new TimelineView(vm, viewClassForTile) : new LoadingView())
            ),
            t.mapView(
                (vm) => vm.messageComposerViewModel,
                (vm) => (vm ? new MessageComposer(vm) : null)
            ),
            t.view(new FooterView()),
        ]);
    }
}

class RoomHeaderView extends TemplateView<ChatterboxViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: ChatterboxViewModel) {
        const avatar = vm.customAvatarURL ? t.img({ className:"avatar", src: vm.customAvatarURL }) : t.view(new AvatarView(vm.roomViewModel, 30));
        return t.div({ className: "RoomHeaderView" }, [
            avatar,
            t.div({ className: "RoomHeaderView_name" }, vm => vm.roomName),
            t.div({ className: "RoomHeaderView_menu" }, [
                t.button({
                    className: "RoomHeaderView_menu_minimize", onClick: () => {
                        vm.minimize();
                    }
                })
            ]),
        ]);
    }
}
