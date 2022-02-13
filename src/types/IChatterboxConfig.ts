export interface IChatterboxConfig {
	homeserver: string;
    // internal room-id of the room to which chatterbox should join
	auto_join_room: string;
    // string that is to be prepended to the generated random usernames
    username_prefix: string;
    // Configurations for header on chatterbox (containing title, avatar, minimize button)
    header: IHeader;
}

interface IHeader {
    // An optional static title. If this is not given, the room name is used instead
    title?: string;
    // An optional link to static avatar. If this is not given, the room avatar is used instead
    avatar?: string;
}
