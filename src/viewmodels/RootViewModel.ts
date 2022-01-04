import { ViewModel, Client, createNavigation, createRouter, Platform, ObservableValue } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { ChatterboxViewModel } from "./ChatterboxViewModel";
import "hydrogen-view-sdk/style.css";
import { AccountSetupViewModel } from "./AccountSetupViewModel";

type Options = { platform: Platform, urlCreator: ReturnType<createRouter>, navigation: ReturnType<createNavigation> };

export class RootViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: Client;
    private _chatterBoxViewModel?: ChatterboxViewModel;
    private _accountSetupViewModel?: AccountSetupViewModel;
    private _state: ObservableValue<string> = new ObservableValue("");
    private _activeSection: string = "start";

    constructor(config: IChatterboxConfig, options: Options) {
        super(options);
        this._config = config;
        this._client = new Client(this.platform);
    }

    async start() {
        this._state.subscribe(stage => this._applyNavigation(stage));
        const sessionAlreadyExists = await this.attemptStartWithExistingSession();
        if (sessionAlreadyExists) {
            this._showTimeline();
            return;
        }
        this._showAccountSetup();
    }

    private _applyNavigation(stage: string) {
        switch (stage) {
            case "timeline":
                this._showTimeline();
                break;
        }
    }

    private async _showTimeline() {
        this._activeSection = "timeline";
        this._chatterBoxViewModel = new ChatterboxViewModel(this.childOptions({ session: this._client.session, config: this._config, state: this._state }));
        await this._chatterBoxViewModel.loadRoom();
        this.emitChange("activeSection");
    }

    private _showAccountSetup() {
        this._activeSection = "account-setup";
        this._accountSetupViewModel = new AccountSetupViewModel(
            this.childOptions({
                client: this._client,
                config: this._config,
                state: this._state,
            })
        );
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
