import { TextTile, ImageTile, VideoTile, FileTile, LocationTile, RedactedTile, tileClassForEntry } from "hydrogen-view-sdk";

class ChatterboxTextTile extends TextTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

class ChatterboxImageTile extends ImageTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

class ChatterboxVideoTile extends VideoTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

class ChatterboxFileTile extends FileTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

class ChatterboxLocationTile extends LocationTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

class ChatterboxRedactedTile extends RedactedTile {
    get displayName() {
        return this.isOwn? "me" : super.displayName;
    }
}

export function createCustomTileClassForEntry(ownUserId: string) {
    return function customTileClassForEntry(entry) {
        switch (entry.eventType) {
            case "m.room.message":
                if (entry.isRedacted) {
                    return ChatterboxRedactedTile;
                }
                const content = entry.content;
                const msgtype = content && content.msgtype;
                switch (msgtype) {
                    case "m.text":
                    case "m.notice":
                    case "m.emote":
                        return ChatterboxTextTile;
                    case "m.image":
                        return ChatterboxImageTile;
                    case "m.video":
                        return ChatterboxVideoTile;
                    case "m.file":
                        return ChatterboxFileTile;
                    case "m.location":
                        return ChatterboxLocationTile;
                    default:
                        // unknown msgtype not rendered
                        return undefined;
                }
            case "m.room.member":
                if (entry.content?.membership === "join" && entry.sender !== ownUserId) {
                    return tileClassForEntry(entry);
                }
                else {
                    return undefined;
                }
            default:
                return tileClassForEntry(entry);

        }
    }
}
