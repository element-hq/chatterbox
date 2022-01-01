export interface IMatrixClient {
    /**
     * Register an account with the given credentials; this method must complete all the stages with no further user interaction.
     */
    register(username: string, password: string, initialDeviceDisplayName: string): Promise<void>;

    login(username: string, password: string): Promise<void>;

    /**
     * Try to start the client with a previous login
     * @returns true if successful, false otherwise
     */
    attemptStartWithExistingSession(): Promise<boolean>;

    /**
     * Renders a timeline and message composer for the given room.
     * @remarks This method should join the room if needed.
     * @param roomId internal room-id, not alias
     */
    mountTimeline(roomId: string): Promise<void>;
}
