import { ViewModel, Client, Navigation, createRouter, Platform } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { ChatterboxViewModel } from "./ChatterboxViewModel";
import "hydrogen-view-sdk/style.css";
import { AccountSetupViewModel } from "./AccountSetupViewModel";
import { MessageFromParent } from "../observables/MessageFromParent";

type Options = { platform: typeof Platform, navigation: typeof Navigation, urlCreator: ReturnType<typeof createRouter>, startMinimized: boolean };

export class RootViewModel extends ViewModel {
    private _config: IChatterboxConfig;
    private _client: typeof Client;
    private _chatterBoxViewModel?: ChatterboxViewModel;
    private _accountSetupViewModel?: AccountSetupViewModel;
    private _activeSection?: string;
    private _messageFromParent: MessageFromParent = new MessageFromParent();
    private _startMinimized: boolean;

    constructor(config: IChatterboxConfig, options: Options) {
        super(options);
        this._startMinimized = options.startMinimized;
        this._config = config;
        this._client = new Client(this.platform);
        this._setupNavigation();
        this._messageFromParent.on("maximize", () => this._showTimeline(Promise.resolve()));
        // Chatterbox can be minimized via the start button on the parent page!
        this._messageFromParent.on("minimize", () => this.minimizeChatterbox());
    }

    private _setupNavigation() {
        this.navigation.observe("account-setup").subscribe(() => this._showAccountSetup());
        this.navigation.observe("timeline").subscribe((loginPromise) => this._showTimeline(loginPromise));
    }

    async start() {
        const sessionAlreadyExists = await this.attemptStartWithExistingSession();
        if (sessionAlreadyExists) {
            this._watchNotificationCount();
            if (this._startMinimized) {
                return;
            }
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
                    minimize: () => this.minimizeChatterbox()
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

    private _watchNotificationCount() {
        const [room] = this._client.session.rooms.values();
        let previousCount = room.notificationCount;
        (window as any).sendNotificationCount(previousCount);
        const subscription = {
            onUpdate(_: unknown, room) {
                const newCount = room.notificationCount;
                if (newCount !== previousCount) {
                    if (!room.isUnread && newCount !== 0) {
                        /*
                        when chatterbox is maximized and there are previous unread messages,
                        this condition is hit but we still want to send the notification count so that 
                        the badge zeroes out.
                        */
                        room.clearUnread();
                        return;
                    }
                    (window as any).sendNotificationCount(newCount);
                    previousCount = newCount;
                }
            },
        };
        this.track(this._client.session.rooms.subscribe(subscription));
    }
    
    minimizeChatterbox() {
        this._chatterBoxViewModel = this.disposeTracked(this._chatterBoxViewModel);
        this._activeSection = "";
        this.emitChange("chatterboxViewModel");
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
