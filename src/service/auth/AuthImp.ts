import {Auth} from '@/service/auth/Auth';
import store from '@/store/index';

export default class AuthImp implements Auth {
    private readonly appid = 'wxba439e82cfce5ab5';

    public getAccessToken(): Promise<string | null> {
        return Promise.resolve(sessionStorage.getItem('accessToken'));
    }

    public setAccessToken(ak: string): Promise<void> {
        sessionStorage.setItem('accessToken', ak);
        return Promise.resolve();
    }

    public clearAccessToken(): Promise<void> {
        return Promise.resolve();
    }

    public redirectToGetAuthCode() {
        const redirectUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
            + '?appid=' + this.appid + '&redirect_uri=' + encodeURIComponent(window.location.href)
            + '&response_type=code&scope=snsapi_base&state=' + this.appid + '#wechat_redirect';
        window.location.href = redirectUrl;
        return Promise.resolve();
    }
}

