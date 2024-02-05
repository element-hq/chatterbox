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

import { ViewModel, Client, Navigation, createRouter, Platform, RoomStatus, LoadStatus } from "hydrogen-view-sdk";
import { IChatterboxConfig } from "../types/IChatterboxConfig";
import { ChatterboxViewModel } from "./ChatterboxViewModel";
import "hydrogen-view-sdk/style.css";
import { AccountSetupViewModel } from "./AccountSetupViewModel";
import { FooterViewModel } from "./FooterViewModel";
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
    private _isWatchingNotificationCount: boolean;
    private _footerViewModel: FooterViewModel;

    constructor(config: IChatterboxConfig, options: Options) {
        super(options);
        this._startMinimized = options.startMinimized;
        this._config = config;
        this._client = new Client(this.platform);
        this._footerViewModel = new FooterViewModel(this.childOptions({ config: this._config }));
        this._setupNavigation();
        this._messageFromParent.on("maximize", () => this.start());
        // Chatterbox can be minimized via the start button on the parent page!
        this._messageFromParent.on("minimize", () => this.navigation.push("minimize"));
    }

    private _setupNavigation() {
        this.navigation.observe("account-setup").subscribe(() => this._showAccountSetup());
        this.navigation.observe("timeline").subscribe((setupSessionPromise) => this._showTimeline(setupSessionPromise));
        this.navigation.observe("minimize").subscribe(() => this.minimizeChatterbox());
    }

    async start() {
        const sessionAlreadyExists = await this.attemptStartWithExistingSession();
        if (sessionAlreadyExists) {
            if (!this._isWatchingNotificationCount) {
                this._watchNotificationCount();
            }
            if (this._startMinimized) {
                // when CB is maximized, this function is run again
                // don't start in minimized state then
                this._startMinimized = false;
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
                    footerVM: this._footerViewModel,
                    loginPromise,
                })
            ));
            await this._chatterBoxViewModel.load();
            if (!this._isWatchingNotificationCount) {
                // for when chatterbox is loaded initially
                this._watchNotificationCount();
            }
        }
        this.emitChange("activeSection");
    }

    private _showAccountSetup() {
        this._activeSection = "account-setup";
        if(!this._accountSetupViewModel) {
            this._accountSetupViewModel = this.track(new AccountSetupViewModel(
                this.childOptions({
                    client: this._client,
                    config: this._config,
                    state: this._state,
                    footerVM: this._footerViewModel,
                })
            ));
        }
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

    private async _watchNotificationCount() {
        await this._client.loadStatus.waitFor(s => s === LoadStatus.Ready).promise;
        const roomId = await this.platform.settingsStorage.getString("created-room-id") ?? this._config.auto_join_room;
        const observable = await this._client.session.observeRoomStatus(roomId);
        await observable.waitFor((status) => status === RoomStatus.Joined).promise;
        const room = this._client.session.rooms.get(roomId);
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
        this._isWatchingNotificationCount = true;
    }
    
    minimizeChatterbox() {
        this._chatterBoxViewModel = this.disposeTracked(this._chatterBoxViewModel);
        this._accountSetupViewModel = this.disposeTracked(this._chatterBoxViewModel);
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
