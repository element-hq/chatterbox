import { TemplateView } from "hydrogen-view-sdk";
import { Builder } from "hydrogen-view-sdk/types/platform/web/ui/general/TemplateView";
import { AccountSetupViewModel } from "../../viewmodels/AccountSetupViewModel";

export class AccountSetupView extends TemplateView<AccountSetupViewModel> {
    render(t: Builder<AccountSetupViewModel>, vm: AccountSetupViewModel) {
        return t.div(t.mapView(vm => vm.privacyPolicyLink, link => link ? new PolicyAgreementView(vm) : null));
    }
}

class PolicyAgreementView extends TemplateView<AccountSetupViewModel> {
    render(t: Builder<AccountSetupViewModel>, vm: AccountSetupViewModel) {
        return t.div({ className: "PolicyAgreementView" }, [
            t.div([
                "By continuing you agree to the terms and conditions laid out by the following documents:",
                t.a({href: vm.privacyPolicyLink}, "Privacy Policy")
            ]),
            t.div([
                t.input({ type: "checkbox", name: "agree" }),
                t.label({for: "agree"}, "I agree")
            ]),
            t.button({onClick: () => vm.completeRegistration()}, "Next")
        ]);
    }
}
