import {get, post} from '@/service/axiosConfig';

export interface WxPayConfig {
    appId: string;
    nonceStr: string; // 随机字符串
    package: string; // 订单详情扩展字符串
    signType: string; // 签名方式
    paySign: string; // 签名
    timestamp: string;


}

export function getPayOrderConfig(type: 1 | 2, order_sn: string): Promise<WxPayConfig> {
    return get('/api/payment/info', {type, order_sn});
}

export function confirmOrder(type: 1 | 2, order_sn: string): Promise<void> {
    return post('/api/orders/confirm', {type, order_sn});
}