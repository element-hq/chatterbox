import { ViewModel, Client, Navigation, createRouter, Platform  } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { ChatterboxViewModel } from "./ChatterboxViewModel";
import "hydrogen-view-sdk/style.css";
import { AccountSetupViewModel } from "./AccountSetupViewModel";

type Options = { platform: typeof Platform, navigation: typeof Navigation, urlCreator: ReturnType<typeof createRouter> };

export class RootViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: typeof Client;
    private _chatterBoxViewModel?: ChatterboxViewModel;
    private _accountSetupViewModel?: AccountSetupViewModel;
    private _activeSection?: string;

    constructor(config: IChatterboxConfig, options: Options) {
        super(options);
        this._config = config;
        this._client = new Client(this.platform);
        this._setupNavigation();
    }

    private _setupNavigation() {
        this.navigation.observe("account-setup").subscribe(() => this._showAccountSetup());
        this.navigation.observe("timeline").subscribe((loginPromise) => this._showTimeline(loginPromise));
    }

    async start() {
        const sessionAlreadyExists = await this.attemptStartWithExistingSession();
        if (sessionAlreadyExists) {
            this.navigation.push("timeline");
            return;
        }
        this.navigation.push("account-setup");
    }

    private async _showTimeline(loginPromise: Promise<void>) {
        this._activeSection = "timeline";
        if (!this._chatterBoxViewModel) {
            this._chatterBoxViewModel = this.track(new ChatterboxViewModel(
                this.childOptions({
                    client: this._client,
                    config: this._config,
                    state: this._state,
                    loginPromise,
                })
            ));
            this._chatterBoxViewModel.load();
        }
        this.emitChange("activeSection");
    }

    private _showAccountSetup() {
        this._activeSection = "account-setup";
        this._accountSetupViewModel = this.track(new AccountSetupViewModel(
            this.childOptions({
                client: this._client,
                config: this._config,
                state: this._state,
            })
        ));
        this.emitChange("activeSection");
    }

    /**
     * Try to start Hydrogen based on an existing hydrogen session.
     * If multiple sessions exist, this method chooses the most recent one.
     */
    async attemptStartWithExistingSession(): Promise<boolean> {
        const sessionIds = await this.platform.sessionInfoStorage.getAll();
        const session = sessionIds.pop();
        if (session) {
            const { id } = session;
            await this._client.startWithExistingSession(id);
            return true;
        }
        return false;
    }

    get chatterboxViewModel() {
        return this._chatterBoxViewModel;
    }

    get accountSetupViewModel() {
        return this._accountSetupViewModel;
    }

    get activeSection() {
        return this._activeSection;
    }
}
