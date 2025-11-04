// 导入request.js请求工具
import request from '@/utils/request.js';


// 创建新帖子
export const createPostService = (postData: any) => {
    return request.post('/post', postData);
};

/**
 * 查询帖子列表
 * @param {number} limit - 返回条目数量限制，默认为10
 * @param {number} offset - 偏移量，默认为0
 * @param {string} title - 帖子标题搜索条件，可选
 * @param {string} content - 帖子内容搜索条件，可选
 */
export const queryPostsService = (limit = 10, offset = 0,author?:string, title?:string, content?:string) => {
    return request.get('/post', {
        params: {
            limit,
            offset,
            author: author,
            title: title,
            content: content
        }
    });
};

//  根据ID获取帖子详情

export const getPostByIdService = (id?:string) => {
    return request.get(`/post/${id}`);
};

// 更新帖子
export const updatePostService = (id:number, postData:any) => {
    return request.put(`/post/${id}`, postData);
};

// 删除帖子
export const deletePostService = (id:number) => {
    return request.delete(`/post/${id}`);
};
//上传图片
export const uploadImageService = (file:File,postId?:number) => {
    return request.post(`/post/${{postId}}/image`, file, {
        headers: {
            'Content-Type': 'image/png',
          }
          
    });
};