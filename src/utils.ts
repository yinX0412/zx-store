import {get} from '@/service/axiosConfig';

export default function testLogin() {
    return get('/api/user/authCode', {auth_code: '061027aZ18jtlV08hsaZ18YO9Z1027aM'})
}