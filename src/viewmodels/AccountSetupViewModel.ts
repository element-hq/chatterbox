import { ViewModel, Client, LoadStatus } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { generatePassword, generateUsername } from "../random";
import "hydrogen-view-sdk/style.css";


export class AccountSetupViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: typeof Client;
    private _termsStage?: any;
    private _password: string;
    private _username: string;
    private _registration: any;

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
                this._username = `${this._config.username_prefix}-${generateUsername(10)}`;
                this._registration = await this._client.startRegistration(this._homeserver, this._username, this._password, "Chatterbox");
                const stage = await this._registration.start();
                if (stage.type === "m.login.terms") {
                    this._termsStage = stage;
                    this.emitChange("termsStage");
                }
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
        let stage = this._termsStage;
        while (stage) {
            stage = await this._registration.submitStage(stage);
        }
        const loginPromise = this.login(this._username, this._password);
        this.navigation.push("timeline", loginPromise);
    }

    async login(username: string, password: string): Promise<void> {
        const loginOptions = await this._client.queryLogin(this._homeserver).result;
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

    private get _homeserver(): string {
        return this._config.homeserver;
    }

    get privacyPolicyLink() {
        return this._termsStage?.privacyPolicy.en?.url;
    }
}
