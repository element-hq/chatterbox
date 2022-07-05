import { TemplateView } from "hydrogen-view-sdk";
import { AccountSetupViewModel } from "../../viewmodels/AccountSetupViewModel";
import { LoadingView } from "./LoadingView";

import { FooterView } from "./FooterView";
export class AccountSetupView extends TemplateView<AccountSetupViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: AccountSetupViewModel) {
        return t.div(
            { className: "AccountSetupView" },
            [
            t.mapView((vm) => vm.privacyPolicyLink, (link) => link ? new PolicyAgreementView(vm) : new LoadingView()),
            t.view(new FooterView(vm.footerViewModel)),
            ]
        );
    }
}

class PolicyAgreementView extends TemplateView<AccountSetupViewModel> {
    constructor(value) {
        super(value);
    }

    render(t, vm: AccountSetupViewModel) {
        return t.div({ className: "PolicyAgreementView" }, [
            t.div({ className: "PolicyAgreementView_title" }, "Your privacy comes first"),
            t.div({ className: "PolicyAgreementView_text" },
                [
                    "Please accept our ",
                    t.a({ href: vm.privacyPolicyLink }, "Privacy Policy"),
                    " before proceeding to the chat.",
                ]),
            t.div({ className: "PolicyAgreementView_btn-collection" },
                [
                    t.button({ onClick: () => vm.completeRegistration(), className: "PolicyAgreementView_next", },
                        t.map(vm => vm.showButtonSpinner, (showButtonSpinner, t) => showButtonSpinner? t.div({ className: "loader" }): t.span("Accept and continue to chat"))
                    ),
                    t.button({ onClick: () => vm.minimize(), className: "button-action PolicyAgreementView_cancel", }, "Cancel"),
                ]),
        ]);
    }
}
