import {upload} from '@/service/axiosConfig';

export function uploadImg(file: File): Promise<{ path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return upload('/api/img_upload', formData);
}
