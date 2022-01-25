import { TemplateView } from "hydrogen-view-sdk";
import { RootViewModel } from "../../viewmodels/RootViewModel";
import { AccountSetupView } from "./AccountSetupView";
import { ChatterboxView } from "./ChatterboxView";

export class RootView extends TemplateView<RootViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: RootViewModel) {
        return t.mapView(vm => vm.activeSection, section => {
            switch(section) {
                case "start":
                    window.sendFrameResizeEventToParent("50px", "50px");
                    return new StartView(vm);
                case "account-setup":
                    window.sendFrameResizeEventToParent("115px", "360px");
                    return new AccountSetupView(vm.accountSetupViewModel);
                case "timeline":
                    window.sendFrameResizeEventToParent("600px", "400px");
                    return new ChatterboxView(vm.chatterboxViewModel);
            }
            return null;
        })
    }
}


class StartView extends TemplateView<RootViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: RootViewModel) {
        return t.button({ className: "StartChat", onClick: () => vm.start() });
    }
}
