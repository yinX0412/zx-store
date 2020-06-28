export interface Auth {
    getAccessToken(): Promise<string | null>;

    setAccessToken(ak: string): Promise<void>;

    clearAccessToken(): Promise<void>;

    redirectToGetAuthCode(): Promise<void>

}

export interface User {
    id: string;
    account: string;
    username: string;
    avatar: string;
    phone: string;
}