import {get, post} from '@/service/axiosConfig';
import {List} from '@/service/fs/fs-order-service';

export function getMemberList(page: number, dist: string, name: string): Promise<any> {
    return get('/api/user/getMemberMsg', {page, dist, name});
}

export function submitDelMember(uid: string): Promise<{ user_id: string, operation: string }> {
    return get('/api/user/submitMemDel', {uid});
}