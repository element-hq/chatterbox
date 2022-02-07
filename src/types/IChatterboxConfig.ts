export interface IChatterboxConfig {
	homeserver: string;
    // internal room-id of the room to which chatterbox should join
	auto_join_room: string;
    // string that is to be prepended to the generated random usernames
    username_prefix: string;
}
