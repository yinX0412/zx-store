import {get} from '@/service/axiosConfig';

export function getBusinessUserList(name: string, page: number): Promise<any> {
    return get('/api/user/getSalesmanMsg', {name, page});
}

export function submitDelBusinessUser(uid: string): Promise<void> {
    return get('/api/user/submitSalesmanDel', {uid});
}