import axios from 'axios';
import qs from 'qs';
import router from '@/router';
import AuthImp from '@/service/auth/AuthImp';
import store from '@/store/index';

/**
 * 请求响应
 */
export interface AjaxResp<T> {
    code: number;
    data: T;
    msg: string;
}

const auth = new AuthImp();
const service = axios.create({
    timeout: 5000,
    baseURL: 'http://annual.gengyong.com.cn',
    responseType: 'json',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
});
service.defaults.xsrfCookieName = 'X-CSRF-TOKEN';
service.defaults.withCredentials = true;
service.interceptors.request.use((config) => {
    auth.getAccessToken()
        .then((ak) => {
            if (ak) {
                // config.headers['X-CSRF-TOKEN'] = ak;
            }
        });
    return config;
});
service.interceptors.response.use((resp) => {
    if (resp.data.code === 403) {
        // 说明未授权，判断当前路径跳转登录页
        const pathname = window.location.pathname;
        if (pathname.startsWith('/bs')) {
            // 前往后台登录页面
            router.push(`/bs/login?redirect=${router.currentRoute.path}`);
        }
        if (pathname.startsWith('/fs')) {
            // 首先判断url里面有没有authcode，有就说明已经前往过授权页面直接重新拉取授权
            if (router.currentRoute.query.code) {

            } else {
                // 前往微信授权
                new AuthImp().redirectToGetAuthCode();
            }

        }
        return Promise.reject('未登录');
    } else {
        return resp;
    }
});

export function get<T>(path: string, data?: any): Promise<T> {
    return service.get<AjaxResp<T>>(`${path}?${qs.stringify(data)}`)
                  .then((res) => {
                      if (res.data.code === 200) {
                          return Promise.resolve(res.data.data);
                      } else {
                          return Promise.reject(res);
                      }
                  })
                  .catch((error) => {
                      if (error.data && error.data.msg) {
                          return Promise.reject(error.data.msg);
                      }
                      return Promise.reject(error);
                  });
}

export function post<T>(path: string, data?: any): Promise<T> {
    return service.post<AjaxResp<T>>(path, qs.stringify(data))
                  .then((res) => {
                      if (res.data.code === 200) {
                          return Promise.resolve(res.data.data);
                      } else {
                          return Promise.reject(res);
                      }
                  })
                  .catch((error) => {
                      if (error.data && error.data.msg) {
                          return Promise.reject(error.data.msg);
                      }
                      return Promise.reject(error);
                  });
}

export function upload<T>(path: string, data?: FormData): Promise<T> {
    return service.post<AjaxResp<T>>(path, data, {
        headers: {'content-type': 'multipart/form-data'},
    })
                  .then((res) => {
                      if (res.data.code === 200) {
                          return Promise.resolve(res.data.data);
                      } else {
                          return Promise.reject(res);
                      }
                  })
                  .catch((error) => {
                      if (error.data && error.data.msg) {
                          return Promise.reject(error.data.msg);
                      }
                      return Promise.reject(error);
                  });
}
