import {
    Platform,
    Client,
    LoadStatus,
    createNavigation,
    createRouter,
    RoomViewModel,
    TimelineView
} from "hydrogen-view-sdk";
import assetPaths from "hydrogen-view-sdk/paths/vite";
import "hydrogen-view-sdk/style.css";

async function main() {
    const app = document.querySelector<HTMLDivElement>('#app')!
    const config = {};
    const platform = new Platform(app, assetPaths, config, { development: import.meta.env.DEV });
    const navigation = createNavigation();
    platform.setNavigation(navigation);
    const urlRouter = createRouter({
        navigation: navigation,
        history: platform.history
    });
    urlRouter.attach();
    const client = new Client(platform);

    const loginOptions = await client.queryLogin("matrix.org").result;
    client.startWithLogin(loginOptions.password("foobaraccount", "UzmiRif6UnHqp6s"));

    await client.loadStatus.waitFor((status: string) => {
        return status === LoadStatus.Ready ||
            status === LoadStatus.Error ||
            status === LoadStatus.LoginFailed;
    }).promise;

    if (client.loginFailure) {
        alert("login failed: " + client.loginFailure);
    } else if (client.loadError) {
        alert("load failed: " + client.loadError.message);
    } else {
        const {session} = client;
        // looks for room corresponding to #element-dev:matrix.org, assuming it is already joined
        const room = session.rooms.get("!nXJtsUatHBGyIYfyYw:matrix.org");
        const vm = new RoomViewModel({
            room,
            ownUserId: session.userId,
            platform,
            urlCreator: urlRouter,
            navigation,
        });
        await vm.load();
        const view = new TimelineView(vm.timelineViewModel);
        app.appendChild(view.mount());
    }
}

main();