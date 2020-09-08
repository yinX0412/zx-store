import {Auth} from '@/service/auth/Auth';
import {service} from '@/service/axiosConfig';

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
        sessionStorage.removeItem('accessToken');
        return Promise.resolve();
    }

    public redirectToGetAuthCode() {
        const redirectUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
            + '?appid=' + this.appid + '&redirect_uri=' + encodeURIComponent(window.location.href)
            + '&response_type=code&scope=snsapi_userinfo&state=' + this.appid + '#wechat_redirect';
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 0);
        return Promise.reject('未授权');
    }

}

