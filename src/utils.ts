import {get} from '@/service/axiosConfig';

export default function testLogin() {
    return get('/api/user/authCode', {auth_code: '061Dkhxx0Hlqze1cqMux0xD2xx0DkhxL'})
}