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
    // Token needed for token-authenticated registration
    token: string;
    // URL of the image that should be used as the users avatar
    avatar: string;
    // Configure this to enable Sentry (sentry.io) tracing.
    sentry?: {
        // The DSN URL where Sentry reports will be sent.
        dsn: string;
        // The environment to report to Sentry. E.g. "staging", "production"
        environment: string;
    }
}

interface IHeader {
    // An optional static title. If this is not given, no room name is shown in the header
    title?: string;
    // An optional link to static avatar. If this is not given, the room avatar is used instead
    avatar?: string;
}
