import {get} from '@/service/axiosConfig';
import {GoodsSku} from '@/service/bs/bs-goods-service';
import {Address} from '@/service/bs/bs-order-service';

export interface List<T> {
    total: number;
    list: T[]
}

export interface OrderList {
    store_name: string;
    order_list: Order[];
}

export interface Order {
    id: string;
    order_sn: string;
    order_type: 2 | 3 | 4;
    status: 2 | 3 | 4 | 5 | 6;
    user_id: string;
    amount: number;
    custom_content: string;
    user: {
        id: string;
        account: string;
        username: string;
        avatar: string;
        phone: number;
    };
    goods_sku: GoodsSku[];
    address: Address[];
}

export function getOrderList(type: 2 | 3 | 4): Promise<List<OrderList>> {
    return get('/api/orders/list', {type});
}