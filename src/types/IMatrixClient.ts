export interface IMatrixClient {
    register(username: string, password: string, initialDeviceDisplayName: string): Promise<void>;
    login(username: string, password: string): Promise<void>;
    showRoom(roomId: string): Promise<void>;
    attemptStartWithExistingSession(): Promise<boolean>;
}
