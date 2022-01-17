import { ViewModel, Client, ObservableValue, LoadStatus } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { generateRandomString } from "../random";
import "hydrogen-view-sdk/style.css";


export class AccountSetupViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: Client;
    private _termsStage?: any;
    private _password: string;
    private _applySegment: any;

    constructor(options) {
        super(options);
        this._client = options.client;
        this._config = options.config;
        this._applySegment = options.applySegment;
        this._startRegistration();
    }

    private async _startRegistration(): Promise<void> {
        this._password = generateRandomString(10);
        let stage = await this._client.startRegistration(this._homeserver, null, this._password, "Chatterbox");
        if (stage.type === "m.login.terms") {
            this._termsStage = stage;
            this.emitChange("termsStage");
        }
    }

    async completeRegistration() {
        let stage = this._termsStage;
        while (typeof stage !== "string") {
            stage = await stage.complete();
        }
        // stage is username when registration is completed
        await this.login(stage, this._password);
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

        this._applySegment("timeline");
    }

    dismiss() {
        this._applySegment("start");
    }

    private get _homeserver(): string {
        return this._config.homeserver;
    }

    get privacyPolicyLink() {
        return this._termsStage?.privacyPolicy.en?.url;
    }
}
