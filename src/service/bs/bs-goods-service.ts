import {get, post} from '../axiosConfig';
import {CategoryList} from '@/service/bs/bs-category-service';

export interface GoodsList {
    category: {
        category_name: string;
        created_at: string;
        id: string;
        image: string;
        update_at: string;
    };
    category_id: string;
    created_at: string;
    goods_detail: string;
    goods_name: string;
    id: string;
    main_img: string;
    member_price: string;
    normal_price: string;
    sales_volume: string;
    series: {
        created_at: string;
        id: string;
        image: string;
        series_name: string;
        update_at: string;
    };
    series_id: string;
    is_video: 1 | 2;
    status: 1 | 2;
    update_at: string;
    video_img: string;
    video_price: number;
}

interface List<T> {
    goods_list: T[];
    total: number;
}

export function getGoodsList(page: number, page_count: number, goods_name?: string): Promise<List<GoodsList>> {
    return get('/admin/goods/list', {page, page_count, goods_name});
}

export interface CreateGoodsArgs {
    goods_name: string;
    main_img: string;
    video_img: string;
    category_id: string;
    member_price: string;
    normal_price: string;
    video_price: string;
    series_id: string;
    is_video: 1 | 2;
    status: 1 | 2;
    goods_detail: string;
    goods_sku: CreateGoodsSku[];
}

export interface CreateGoodsSku {
    sku_img: string;
    member_price: string;
    normal_price: string;
    video_price: string;
    sku_content: any;
}

export interface GoodsSku {
    id: string;
    sku_img: string;
    member_price: string;
    normal_price: string;
    video_price: string;
    sku_content: any;
}

export function createGoods(form: CreateGoodsArgs): Promise<void> {
    return post('/admin/goods/store', form);
}

export interface UpdateGoodsArgs {
    id: string;
    goods_name: string;
    main_img: string;
    video_img: string;
    category_id: string;
    member_price: string;
    normal_price: string;
    video_price: string;
    series_id: string;
    is_video: 1 | 2;
    status: 1 | 2;
    goods_detail: string;
    goods_sku: GoodsSku[];
}

export function updateGoods(form: UpdateGoodsArgs): Promise<void> {
    return post('/admin/goods/update', form);
}

export interface ChangeGoodsStatusArgs {
    goods_id?: string;
    goods_sku_id?: string;
    type: 1 | 2;
    status: 1 | 2 | 3;
}

export function changeGoodsStatus(form: ChangeGoodsStatusArgs): Promise<void> {
    return post('/admin/goods/status_update', form);
}

export interface GoodsDetail {
    id: string;
    category: CategoryList;
    category_id: string;
    created_at: string;
    goods_detail: string;
    goods_name: string;
    main_img: string;
    member_price: string;
    normal_price: string;
    sales_volume: string;
    series: {
        created_at: string;
        id: string;
        image: string;
        series_name: string;
        update_at: string;
    };
    series_id: string;
    is_video: 1 | 2;
    status: 1 | 2;
    update_at: string;
    video_img: string;
    video_price: string;
    goods_sku: GoodsSku[];
}

export function getGoods(id: string): Promise<GoodsDetail> {
    return get('/admin/goods/detail', {id});
}

export function getStats(start_time: number, end_time: number): Promise<Array<{ date: string, money: string }>> {
    return get('/admin/data', {start_time, end_time});
}