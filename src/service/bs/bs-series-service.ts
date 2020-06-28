import {get, post} from '@/service/axiosConfig';

export interface SeriesList {
    id: string;
    series_name: string;
    image: string;
}

export function getSeriesList(): Promise<{ list: SeriesList[] }> {
    return get('/admin/series/list');
}

export function createSeries(series_name: string, image: string): Promise<void> {
    return post('/admin/series/store', {series_name, image});
}

export function updateSeries(id: string, series_name: string, image: string): Promise<void> {
    return post('/admin/series/update', {id, series_name, image});
}

export function deleteSeries(id: string): Promise<void> {
    return post('/admin/series/delete', {id});
}

export function getSeries(id: string): Promise<SeriesList> {
    return get('/admin/series/detail', {id});
}
