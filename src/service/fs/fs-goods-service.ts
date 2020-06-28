import {get} from '@/service/axiosConfig';

export interface GoodsList {
    goods_list: [];
    series_list: Series[];
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
    member_price: number;
    normal_price: number;
    video_price: number;
    sales_volume: number;
    category: Category[];
    series: Series[];
}

export function getGoodsList(page: number, page_count: number, series_id: string): Promise<GoodsList> {
    return get('/api/goods/list', {page, page_count, series_id});
}