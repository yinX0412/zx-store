import {get} from '@/service/axiosConfig';
import {GoodsDetail} from '@/service/bs/bs-goods-service';

export interface GoodsList {
    goods_list: any[];
    series_list: Series[];
    total: number;
}

export interface Series {
    id: string;
    series_name: string;
    image: string;
}

export interface Category {
    id: string,
    category_name: string,
    image: string
}

export interface Goods {
    id: string;
    goods_name: string;
    main_img: string;
    video_img: string;
    member_price: string;
    normal_price: string;
    video_price: string;
    sales_volume: number;
    category: Category[];
    series: Series[];
}

export function getGoodsList(page: number, page_count: number, series_id: string): Promise<GoodsList> {
    return get('/api/goods/list', {page, page_count, series_id});
}

export function getGoods(id: string): Promise<GoodsDetail> {
    return get('/api/goods/detail', {id});
}