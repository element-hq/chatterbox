import { Hydrogen } from "./Hydrogen";
import type { IChatterboxConfig } from "./types/IChatterboxConfig";

async function fetchConfig(): Promise<IChatterboxConfig> {
    const root = document.querySelector("#chatterbox") as HTMLDivElement;
    if (!root) {
        throw new Error("No element with id as 'chatterbox' found!");
    }

    const configLink = root?.dataset.configLink;
    if (!configLink) {
        throw new Error("Root element does not have config specified");
    }

    const config: IChatterboxConfig = await (await fetch(configLink)).json();
    return config;
}

async function main() {
    const root = document.querySelector("#chatterbox") as HTMLDivElement;
    const { homeserver, auto_join_room } = await fetchConfig();
    const hydrogen = new Hydrogen(homeserver, root);
    const username = generateRandomString(7);
    const password = generateRandomString(10);
    console.log(`Attempting to register with username = ${username} and password = ${password}`);
    await hydrogen.register(username, password, "Chatterbox");
    console.log("Registration done"); 
    console.log("Attempting to login with same credentials");
    await hydrogen.login(username, password);
    console.log("Login successful");
    console.log("Attempting to mount Timeline");
    await hydrogen.showRoom(auto_join_room);
    console.log("Mounted Timeline");
}

function generateRandomString(length: number): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    var charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

main();