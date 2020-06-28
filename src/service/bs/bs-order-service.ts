import {get} from '@/service/axiosConfig';
import {User} from '@/service/auth/Auth';

interface List<T> {
    list: T[];
    total: number;
}

export interface OrderGoodsSku {
    id: string;
    goods_name: string;
    sku_img: string;
    member_price: number;
    normal_price: number;
    video_price: number;
    sku_content: any;
}

export interface Address {
    contact: string;
    phone: string;
    address_content: string; // 地址
    hourse_number: string; // 门牌号
    store_img: string;
    store_name: string;
}

export interface OrderList {
    id: string;
    order_sn: string;
    order_type: 2 | 3 | 4; // 直播/日常/定制
    status: 2 | 3 | 4 | 5 | 6; // 待支付/上级待返款/会员待确认/大代理确认/已完成
    user_id: string;
    amount: number; // 总价
    custom_content: string; // 订单定制内容
    user: User;
    goods_sku: OrderGoodsSku;
    address: Address;
}

export function getOrderList(page: number, page_count: number, address_id: string): Promise<List<OrderList>> {
    return get('/admin/orders/list', {page, page_count, address_id});
}