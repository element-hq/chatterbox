/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
                t.a(
                    {
                        className: "FooterView_chatterbox-branding",
                        href: vm.chatterboxLink,
                        target: "_top",
                        rel: "noopener"
                    },
                    "Chatterbox"
                ),
            ]),
            t.a(
                {
                    className: "FooterView_matrix-branding",
                    href: vm.matrixLink,
                    target: "_top",
                    rel: "noopener"
                },
                "Powered by Matrix"
            ),
        ]);
    }
}
