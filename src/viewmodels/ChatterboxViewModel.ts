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

    async load() {
        // wait until login is completed
        await this._loginPromise;
        let room;
        if (this._options.config["invite_user"]) {
            room = await this.createRoomWithUserSpecifiedInConfig();
        } else if(this._options.config["auto_join_room"]) {
            room = await this.joinRoomSpecifiedInConfig();
        }
        else {
            throw new Error("ConfigError: You must either specify 'invite_user' or 'auto_join_room'");
        }
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

    private async createRoomWithUserSpecifiedInConfig() {
        const userId = this._options.config["invite_user"];
        let room = this._session.findDirectMessageForUserId(userId);
        if (room) {
            // we already have a DM with this user
            return room;
        }
        const roomBeingCreated = this._session.createRoom({
            type: 1,
            name: this._name ?? undefined,
            topic: this._topic ?? undefined,
            isEncrypted: false,
            isFederationDisabled: false,
            alias: undefined,
            avatar: undefined,
            invites: [userId],
        });
        await this._waitForRoomCreation(roomBeingCreated);
        const roomId = roomBeingCreated.roomId;
        room = this._session.rooms.get(roomId);
        if (!room) {
            await this._waitForRoomFromSync(roomId);
            room = this._session.rooms.get(roomId);
        }
        return room;
    }

    private async joinRoomSpecifiedInConfig() {
        const roomId = this._options.config["auto_join_room"];
        let room = this._session.rooms.get(roomId);
        if (!room) {
            // user is not in specified room, so join it
            await this._session.joinRoom(roomId);
            // even though we've joined the room, we need to wait till the next sync to get the room
            await this._waitForRoomFromSync(roomId);
            room = this._session.rooms.get(roomId); 
        }
        return room;
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
            onUpdate: () => undefined,
            onRemove: () => undefined,
        };
        this._session.rooms.subscribe(subscription);
        return promise;
    }

    private _waitForRoomCreation(roomBeingCreated): Promise<void> {
        let resolve: () => void;
        const promise: Promise<void> = new Promise(r => { resolve = r; })
        roomBeingCreated.on("change", () => {
            if (roomBeingCreated.roomId) {
                resolve();
            }
        });
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

    get roomName() {
        return this._options.config["header"]?.["title"] ?? this._roomViewModel.name;
    }

    get customAvatarURL() {
        // has user specified specific avatar to use in config?
        return this._options.config["header"]?.["avatar"];
    }

    private get _session() {
        return this._client.session;
    }
}
