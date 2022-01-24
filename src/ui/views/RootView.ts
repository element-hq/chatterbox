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
                    return new StartView(vm);
                case "account-setup":
                    return new AccountSetupView(vm.accountSetupViewModel);
                case "timeline":
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
