export interface IChatterboxConfig {
	homeserver: string;
    // Internal room-id of the room to which chatterbox should join
	auto_join_room: string;
    // String that is to be prepended to the generated random usernames
    username_prefix: string;
    // If specified, chatterbox will create a dm with this user
    // This option takes precedence over 'auto_join_room'
    invite_user: string;
    // If set to true, the room created for DM is encrypted
    encrypt_room: boolean;
    // Configurations for header on chatterbox (containing title, avatar, minimize button)
    header: IHeader;
    // Configurations for footer on chatterbox (containing what links to use)
    footer: IFooter;
    // Token needed for token-authenticated registration
    token: string;
    // URL of the image that should be used as the users avatar
    avatar: string;
}

interface IHeader {
    // An optional static title. If this is not given, no room name is shown in the header
    title?: string;
    // An optional link to static avatar. If this is not given, the room avatar is used instead
    avatar?: string;
}

interface IFooter {
    // Specifies the link which must be opened when chatterbox logo in the footer is clicked.
    chatterbox_link: string;
    // Specifies the link which must be opened when matrix branding in the footer is clicked.
    matrix_link: string;
}
