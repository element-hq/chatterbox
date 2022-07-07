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

import { ViewModel, Client, LoadStatus } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { generatePassword, generateUsername } from "../random";
import "hydrogen-view-sdk/style.css";


export class AccountSetupViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: typeof Client;
    private _startStage?: any;
    private _password: string;
    private _registration: any;
    private _privacyPolicyLink: string;
    private _showButtonSpinner: boolean = false;

    constructor(options) {
        super(options);
        this._client = options.client;
        this._config = options.config;
        this._startRegistration();
    }

    private async _startRegistration(): Promise<void> {
        this._password = generatePassword(10);
        const maxAttempts = 10;
        for (let i = 0; i < maxAttempts; ++i) {
            try {
                const username = `${this._config.username_prefix}-${generateUsername(10)}`;
                const flowSelector = (flows) => {
                    const allowedStages = [
                        "m.login.registration_token",
                        "org.matrix.msc3231.login.registration_token",
                        "m.login.terms",
                        "m.login.dummy"
                    ];
                    for (const flow of flows) {
                        // Find the first flow that does not contain any unsupported stages but contains Token registration stage.
                        const containsUnsupportedStage = flow.stages.some(stage => !allowedStages.includes(stage));
                        const containsTokenStage = flow.stages.includes("m.login.registration_token") ||
                            flow.stages.includes("org.matrix.msc3231.login.registration_token");
                        if (!containsUnsupportedStage && containsTokenStage) {
                            return flow;
                        }
                    }
                }
                this._registration = await this._client.startRegistration(this._homeserver, username, this._password, "Chatterbox", flowSelector);
                this._startStage = await this._registration.start();
                let stage = this._startStage;
                while (stage && stage.type !== "m.login.terms") {
                    stage = stage.nextStage;
                }
                if (!stage) {
                    // If terms login stage is not found, go straight to completeRegistration()
                    this.completeRegistration();
                    return;
                }
                this._privacyPolicyLink = stage.privacyPolicy.en?.url;
                this.emitChange("privacyPolicyLink");
                break;
            }
            catch (e) {
                if (e.errcode !== "M_USER_IN_USE") {
                    throw e;
                }
            }
        }
    }

    async completeRegistration() {
        this._showButtonSpinner = true;
        this.emitChange("showButtonSpinner");
        let stage = this._startStage;
        while (stage) {
            if (
                stage.type === "m.login.registration_token" ||
                stage.type === "org.matrix.msc3231.login.registration_token"
            ) {
                stage.setToken(this._config.token);
            }
            stage = await this._registration.submitStage(stage);
        }
        const loginPromise = this.login(this._password);
        this.navigation.push("timeline", loginPromise);
    }

    async login(password: string): Promise<void> {
        const loginOptions = await this._client.queryLogin(this._homeserver).result;
        const username = this._registration.sessionInfo.user_id;
        this._client.startWithLogin(loginOptions.password(username, password));
        await this._client.loadStatus.waitFor((status: string) => {
            return status === LoadStatus.Ready ||
                status === LoadStatus.Error ||
                status === LoadStatus.LoginFailed;
        }).promise;

        if (this._client.loginFailure) {
            throw new Error("login failed: " + this._client.loginFailure);
        } else if (this._client.loadError) {
            throw new Error("load failed: " + this._client.loadError.message);
        }
    }

    minimize(): void {
        (window as any).sendMinimizeToParent();
        this.navigation.push("minimize");
    }

    private get _homeserver(): string {
        return this._config.homeserver;
    }

    get privacyPolicyLink() {
        return this._privacyPolicyLink;
    }

    get footerViewModel() {
        return this.options.footerVM;
    }

    get showButtonSpinner(): boolean {
        return this._showButtonSpinner;
    }
}
