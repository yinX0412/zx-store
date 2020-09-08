import {get, post, service} from '@/service/axiosConfig';
import store from '@/store';
import {List} from '@/service/fs/fs-order-service';
import {Address} from '@/service/bs/bs-order-service';
import AuthImp from '@/service/auth/AuthImp';
import qs from 'qs';

export interface UserToken {
    openid: string;
    membership_fee?: string; // 需支付金额
    nickname: string;
}

export function userAuthCodeLogin(auth_code: string): Promise<any> {
    return get('/api/user/authCode', {auth_code});
}

export function getCurrentUser(): Promise<any> {
    return get('/api/user/getUserMsg');
}

export function getCommonConfig(): Promise<any> {
    return get('/api/common/config');
}

export interface UpdateUserArgs {
    username: string;
    city: string;
    phone: string;
    sex: number;
    store_name?: string;
    address_content?: string;
    hourse_number?: string;
    store_img?: string;
}

export function updateUser(form: UpdateUserArgs): Promise<void> {
    return post('/api/user/updateUserMsg', form);
}

export function addAdmin(account: string): Promise<void> {
    return post('/admin/user/store', {account});
}

export interface UserList {
    id: string;
    openid: string;
    account: string;
    identity: 1 | 2 | 3 | 4;
    username: string;
    avatar: string;
    phone: string;
    city: string;
    invite_code: any;
    is_del: any; // 0 1 2 正常｜除名审核中｜已除名
    user_order_count: string;
    address: Address;
}

export function getUserList(page: number, page_count: number, username?: string, identity?: 1 | 2 | 3 | 4): Promise<List<UserList>> {
    return get('/admin/user/list', {page, page_count, username, identity});
}

export interface RegisterArgs {
    type: any; // C端用户 会员 业务员
    phone: string;
    invite_code: string;
    username: string;
    city: string;
    store_name?: string;
    address_content?: string;
    membershipfee?: number;
    store_img?: string;
    hourse_number?: string;

}

export function registerUser(form: RegisterArgs): Promise<void> {
    return new AuthImp().getAccessToken()
                        .then((ak) => {
                            if (ak) {
                                const finalData: any = Object.assign({_token: ak}, form || {});
                                console.log(finalData);
                                return service.post('/api/user/register', qs.stringify(finalData));
                            }
                            Promise.resolve(null);
                        })
                        .then((resp) => {
                            console.log(resp);
                            if (resp) {
                                if (resp.data.code.toString().startsWith('20')) {
                                    return Promise.resolve(resp.data.data);
                                }
                                return Promise.reject(resp.data.data.msg);
                            } else {
                                return Promise.resolve();
                            }
                        });
}

export function getPaymentInfo(type: 1 | 2) {
    return get('/api/payment/info', {type});
}

export function getBannerList(): Promise<string[]> {
    return get('/api/banner/list');
}

export function registerBigAgent(phone: string): Promise<void> {
    return get('/api/user/bigAgentRegister', {phone});
}