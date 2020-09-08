import {get, post} from '@/service/axiosConfig';
import {Address} from '@/service/bs/bs-order-service';

export interface AdminList {
    account: string;
    created_at: string;
    id: string;
    identity: 1 | 2 | 3 | 4;
    password: string;
    updated_at: string;
}

export function getAdminList(): Promise<AdminList[]> {
    return get('/admin/user/admin_list');
}

export function resetAdminPwd(id: string): Promise<void> {
    return post('/admin/user/password_reset', {id});
}

export function deleteAccount(id: string): Promise<void> {
    return post('/admin/user/delete', {id});
}

export function updateAdminPassword(origin_password: string, new_password: string, confirm_password: string) {
    return post('/admin/user/password_update', {origin_password, new_password, confirm_password});
}

export interface UserDetail {
    id: string;
    identity: 1 | 2 | 3 | 4;
    phone: string;
    invite_code: string;
    address: Address;
    sub_user: any[];
    order: any[];
}

export function getUserDetail(user_id: string): Promise<UserDetail> {
    return get('/admin/user/detail', {user_id});
}

export function removeUser(user_id: string, operation: 1 | 2): Promise<void> {
    return post('/admin/user/remove', {user_id, operation});
}