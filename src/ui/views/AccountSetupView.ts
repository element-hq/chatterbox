import { TemplateView, LoadingView } from "hydrogen-view-sdk";
import { AccountSetupViewModel } from "../../viewmodels/AccountSetupViewModel";

export class AccountSetupView extends TemplateView<AccountSetupViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: AccountSetupViewModel) {
        return t.div(
            { className: "AccountSetupView" },
            t.mapView( (vm) => vm.privacyPolicyLink, (link) => link ? new PolicyAgreementView(vm) : new LoadingView())
        );
    }
}

class PolicyAgreementView extends TemplateView<AccountSetupViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: AccountSetupViewModel) {
        return t.div({ className: "PolicyAgreementView" }, [
            t.div({ className: "PolicyAgreementView-text"},
                [
                "By continuing you agree to the ",
                t.a({ href: vm.privacyPolicyLink }, "Privacy Policy"),
            ]),
            t.div(
                { className: "PolicyAgreementView-btn-collection" },
                [
                t.button( { onClick: () => vm.dismiss(), className: "button-action secondary PolicyAgreementView-cancel", }, "Cancel"),
                t.button( { onClick: () => vm.completeRegistration(), className: "PolicyAgreementView-next button-action primary", }, "Next")
                ]),
        ]);
    }
}
