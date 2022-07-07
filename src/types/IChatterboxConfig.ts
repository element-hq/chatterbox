/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export interface IChatterboxConfig {
	homeserver: string;
    // Internal room-id of the room to which chatterbox should join
	auto_join_room: string;
    // String that is to be prepended to the generated random usernames
    username_prefix: string;
    // If specified, chatterbox will create a dm with this user
    // This option takes precedence over 'auto_join_room'
    invite_user: string;
    // If set to true, chatterbox will not let the user send any messages until the operator has joined
    // Only applicable when invite_user is configured 
    disable_composer_until_operator_join: boolean;
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

interface IFooter {
    // Specifies the link which must be opened when chatterbox logo in the footer is clicked.
    chatterbox_link: string;
    // Specifies the link which must be opened when matrix branding in the footer is clicked.
    matrix_link: string;
}
