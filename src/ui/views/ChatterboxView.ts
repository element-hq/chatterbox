import { TemplateView, TimelineView } from "hydrogen-view-sdk";
import { Builder } from "hydrogen-view-sdk/types/platform/web/ui/general/TemplateView";
import { MessageComposer } from "hydrogen-view-sdk";
import { ChatterboxViewModel } from "../../viewmodels/ChatterboxViewModel";

export class ChatterboxView extends TemplateView<ChatterboxViewModel> {
    render(t: Builder<ChatterboxViewModel>) {
        return t.div([
            t.mapView(vm => vm.timelineViewModel, vm => vm ? new TimelineView(vm) : null),
            t.mapView(vm => vm.messageComposerViewModel, vm => vm ? new MessageComposer(vm) : null)
        ]);
    }
}
