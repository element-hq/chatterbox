import { Platform, Client, LoadStatus, createNavigation, createRouter, RoomViewModel, TimelineView, ComposerViewModel, MessageComposer } from "hydrogen-view-sdk";
import assetPaths from "hydrogen-view-sdk/paths/vite";
import "hydrogen-view-sdk/style.css";
import { IMatrixClient } from "./types/IMatrixClient";

export class Hydrogen implements IMatrixClient {
    private readonly _homeserver: string;
    private _platform: Platform;
    private _client: Client;
    private _urlRouter: ReturnType<createRouter>;
    private _navigation: ReturnType<createNavigation>;
    private _container: HTMLDivElement;

    constructor(homeserver: string, container: HTMLDivElement) {
        this._homeserver = homeserver;
        this._container = container;
        this._platform = new Platform(container, assetPaths, {}, { development: import.meta.env.DEV });
        this._navigation = createNavigation();
        this._platform.setNavigation(this._navigation);
        this._urlRouter = createRouter({ navigation: this._navigation, history: this._platform.history });
        this._urlRouter.attach();
        this._client = new Client(this._platform);
    }

    async register(username: string, password: string, initialDeviceDisplayName: string): Promise<void> {
        let stage = await this._client.startRegistration(this._homeserver, username, password, initialDeviceDisplayName);
        while (stage !== true) {
            stage = await stage.complete();
        }
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

    async mountTimeline(roomId: string): Promise<void> {
        const room = this._session.rooms.get(roomId) ?? await this._joinRoom(roomId);
        const roomVm = new RoomViewModel({
            room,
            ownUserId: this._session.userId,
            platform: this._platform,
            urlCreator: this._urlRouter,
            navigation: this._navigation,
        });
        await roomVm.load();
        const roomView = new TimelineView(roomVm.timelineViewModel);
        this._container.appendChild(roomView.mount());
        const composerVm = new ComposerViewModel(roomVm);
        const composerView = new MessageComposer(composerVm);
        this._container.appendChild(composerView.mount());
    }

    /**
     * Try to start Hydrogen based on an existing hydrogen session.
     * If multiple sessions exist, this method chooses the most recent one.
     */
    async attemptStartWithExistingSession(): Promise<boolean> {
        const sessionIds = await this._platform.sessionInfoStorage.getAll();
        const { id } = sessionIds.pop();
        if (id) {
            await this._client.startWithExistingSession(id);
            return true;
        }
        return false;
    }

    private async _joinRoom(roomId: string): Promise<any> {
        await this._session.joinRoom(roomId);
        // even though we've joined the room, we need to wait till the next sync for the actual room
        await this._waitForRoomFromSync(roomId);
        return this._session.rooms.get(roomId);

    }

    private _waitForRoomFromSync(roomId: string): Promise<void> {
        let resolve: () => void;
        const promise: Promise<void> = new Promise(r => { resolve = r; })
        const subscription = {
            onAdd: (_: string, value: {id: string}) => {
                if (value.id === roomId) {
                    this._session.rooms.unsubscribe(subscription);
                    resolve();
                }
            },
        };
        this._session.rooms.subscribe(subscription);
        return promise;
    }

    private get _session() { return this._client.session; }
}
