import {get, post} from '@/service/axiosConfig';

export interface CategoryList {
    id: string;
    category_name: string;
    image: string;
    attribute: CategoryAttr[];
}

export interface CategoryAttr {
    id: string;
    attribute_name: string;
    attribute_key: string;
    attribute_value: string;
}

export interface CreateCategoryArgs {
    category_name: string;
    image: string;
    attribute_id: string[];
}

export function getCategoryList(): Promise<CategoryList[]> {
    return get('/admin/category/list');
}

export interface UpdateCategoryArgs extends CreateCategoryArgs {
    category_id: string;
}

export function updateCategory(form: UpdateCategoryArgs): Promise<void> {
    return post('/admin/category/update', form);
}

export function deleteCategory(category_id: string): Promise<void> {
    return post('/admin/category/delete', {category_id});
}

export function createCategory(form: CreateCategoryArgs): Promise<void> {
    return post('/admin/category/store', form);
}

export interface AttributeList {
    id: string;
    attribute_name: string;
    attribute_key: string;
    attribute_value: string;

}

export function getAttrList(): Promise<AttributeList[]> {
    return get('/admin/attribute/list');
}

export function getCategory(id: string): Promise<CategoryList> {
    return get('/admin/category/detail', {id});
}