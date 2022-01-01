import { IChatterboxConfig } from "./types/IChatterboxConfig";
import { Hydrogen } from "./Hydrogen";
import { generateRandomString } from "./random";


export class Chatterbox {
    private _config: IChatterboxConfig;
    private _hydrogen: Hydrogen;

    constructor(config: IChatterboxConfig, root: HTMLDivElement) {
        this._config = config;
        this._hydrogen = new Hydrogen(this._homeserver, root);
    }

    async start(): Promise<void> {
        console.log("Checking if session already exists");
        const sessionAlreadyExists = await this._hydrogen.attemptStartWithExistingSession();
        if (sessionAlreadyExists) {
            console.log("Starting hydrogen with existing session");
        } else {
            console.log("Session does not exist!");
            await this._registerAndLogin();
        }

        console.log("Attempting to mount Timeline");
        await this._hydrogen.mountTimeline(this._roomToJoin);
        console.log("Mounted Timeline");
    }

    private async _registerAndLogin(): Promise<void> {
        const username = generateRandomString(7);
        const password = generateRandomString(10);
        console.log( `Attempting to register with username = ${username} and password = ${password}`);
        await this._hydrogen.register( username, password, "Chatterbox");
        console.log("Registration done");
        console.log("Attempting to login with same credentials");
        await this._hydrogen.login(username, password);
        console.log("Login successful");
    }

    private get _homeserver(): string {
        return this._config.homeserver;
    }

    private get _roomToJoin(): string {
        return this._config.auto_join_room;
    }
}
