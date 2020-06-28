import {post} from '@/service/axiosConfig';

export interface UserAdmin {
    token: string;
    adminInfo: {
        identity: 1 | 2; // 1普通管理员 2超级管理员
        id: string;
        account: string;
    }
}

export function adminLogin(account: string, password: string): Promise<UserAdmin> {
    return post('/admin/user/login', {account, password});
}