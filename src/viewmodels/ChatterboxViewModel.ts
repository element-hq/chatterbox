import { RoomViewModel, ViewModel, ComposerViewModel} from "hydrogen-view-sdk";

export class ChatterboxViewModel extends ViewModel {
    private _messageComposerViewModel?: typeof ComposerViewModel;
    private _roomViewModel?: typeof RoomViewModel;
    private _loginPromise: Promise<void>;

    constructor(options) {
        super(options);
        this._client = options.client;
        this._loginPromise = options.loginPromise;
    }

    async loadRoom() {
        // wait until login is completed
        await this._loginPromise;
        const roomId = this._options.config["auto_join_room"];
        const room = this._session.rooms.get(roomId) ?? await this._joinRoom(roomId);
        this._roomViewModel = new RoomViewModel({
            room,
            ownUserId: this._session.userId,
            platform: this.platform,
            urlCreator: this.urlCreator,
            navigation: this.navigation,
        });
        await this._roomViewModel.load();
        this._messageComposerViewModel = new ComposerViewModel(this._roomViewModel);
        this.emitChange("timelineViewModel");
    }

    private async _joinRoom(roomId: string): Promise<any> {
        await this._session.joinRoom(roomId);
        // even though we've joined the room, we need to wait till the next sync to get the room
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

    get timelineViewModel() {
        return this._roomViewModel?.timelineViewModel;
    }

    get messageComposerViewModel() {
        return this._messageComposerViewModel;
    }
    
    get roomViewModel() {
        return this._roomViewModel;
    }

    private get _session() {
        return this._client.session;
    }
}
