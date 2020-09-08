import axios from 'axios';
import qs from 'qs';
import router from '@/router';
import AuthImp from '@/service/auth/AuthImp';

/**
 * 请求响应
 */
export interface AjaxResp<T> {
    code: number;
    data: T;
    msg: string;
}

const auth = new AuthImp();
export const service = axios.create({
    timeout: 5000,
    baseURL: 'http://annual.gengyong.com.cn',
    responseType: 'json',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
});
service.defaults.withCredentials = true;
service.interceptors.response.use((resp) => {
    if (resp.data.code !== 200) {
        if (resp.data.code == 2003) {
            return Promise.reject(resp.data);
        } else if (resp.data.code == 201) {
            return Promise.reject(resp.data);
        } else if (resp.data.code === 403) {
            new AuthImp().clearAccessToken();
            const pathname = window.location.pathname;
            if (pathname.startsWith('/bs')) {
                // 前往后台登录页面
                router.push(`/bs/login?redirect=${router.currentRoute.path}`);
            }
            return Promise.resolve(resp);
        }
        return Promise.reject(resp);
    }
    return Promise.resolve(resp);
});

export function get<T>(path: string, data?: any): Promise<T> {
    return auth.getAccessToken()
               .then((ak) => {
                   if (!ak && (path !== '/api/user/authCode')) {
                       const pathname = window.location.pathname;
                       if (pathname.startsWith('/bs')) {
                           // 前往后台登录页面
                           router.push(`/bs/login?redirect=${router.currentRoute.path}`);
                       }
                       if (pathname.startsWith('/fs')) {
                           // 首先判断url里面有没有authcode，有就说明已经前往过授权页面直接重新拉取授权
                           new AuthImp().redirectToGetAuthCode();
                       }
                       return Promise.reject('未登录');
                   }
                   const finalData: any = Object.assign({_token: ak}, data || {});
                   return service.get<AjaxResp<T>>(`${path}?${qs.stringify(finalData)}`);
               })
               .then((res) => {
                   return Promise.resolve(res.data.data);
               })
               .catch((error) => {
                   if (error && error.data && error.data.msg) {
                       return Promise.reject(error.data.msg);
                   }
                   return Promise.reject(error);
               });
}

export function post<T>(path: string, data?: any): Promise<T> {
    return auth.getAccessToken()
               .then((ak) => {
                   if (!ak && (path !== '/api/user/authCode') && (path !== '/admin/user/login')) {
                       const pathname = window.location.pathname;
                       if (pathname.startsWith('/bs')) {
                           // 前往后台登录页面
                           router.push(`/bs/login?redirect=${router.currentRoute.path}`);
                       }
                       if (pathname.startsWith('/fs')) {
                           // 首先判断url里面有没有authcode，有就说明已经前往过授权页面直接重新拉取授权
                           new AuthImp().redirectToGetAuthCode();
                       }
                       return Promise.reject();
                   }
                   const finalData: any = Object.assign({_token: ak}, data || {});
                   return service.post<AjaxResp<T>>(path, qs.stringify(finalData));
               })
               .then((res) => {
                   return Promise.resolve(res.data.data);
               })
               .catch((error) => {
                   if (error.data && error.data.msg) {
                       return Promise.reject(error.data.msg);
                   }
                   return Promise.reject(error);
               });
}

export function upload<T>(path: string, data: FormData): Promise<T> {
    return auth.getAccessToken()
               .then((ak) => {
                   if (ak) {
                       data.append('_token', ak);
                   }
                   return service.post<AjaxResp<T>>(path, data, {
                       headers: {'content-type': 'multipart/form-data'},
                   });
               })
               .then((res) => {
                   return Promise.resolve(res.data.data);

               })
               .catch((error) => {
                   if (error.data && error.data.msg) {
                       return Promise.reject(error.data.msg);
                   }
                   return Promise.reject(error);
               });
}
