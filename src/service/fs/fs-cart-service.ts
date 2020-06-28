import {get, post} from '@/service/axiosConfig';

export function addGoodsToCart(goods_sku_id: string): Promise<void> {
    return post('/api/cart/store', {goods_sku_id});
}

export function updateCart(cart_id: string, goods_number: number): Promise<void> {
    return post('/api/cart/update', {cart_id, goods_number});
}

export function deleteCart(cart_id: string): Promise<void> {
    return post('/api/cart/delete', {cart_id});
}

export interface CartGoodsList {
    id: string;
    user_id: string;
    goods_sku_id: string;
    goods_number: number;
    goods_sku: {
        goods_id: string;
        goods_name: string;
        sku_img: string;
        member_price: number;
        normal_price: number;
        video_price: number;
        sku_content: string;
        status: 1 | 2 | 3;
    };
}

interface List<T> {
    list: T[];
    total: number;
}

export function cartGoodsList(): Promise<List<CartGoodsList>> {
    return get('/api/cart/list');
}