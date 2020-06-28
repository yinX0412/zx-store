import {get} from '@/service/axiosConfig';
import store from '@/store';

export interface UserToken {
    openid: string;
    membership_fee?: string; // 需支付金额
    nickname: string;
}

export function userAuthCodeLogin(auth_code: string) {
    return get('/api/user/authCode', {auth_code});
}

export function getCurrentUser(): Promise<any> {
    return get('/api/user/getUserMsg');
}

export function getCommonConfig(): Promise<any> {
    return get('/api/common/config');
}