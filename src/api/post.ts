// src/api/post.ts
import request from '@/utils/request.js';

/**
 * 1. 发布帖子
 * POST {{baseUrl}}/api/posts
 */
export interface CreatePostParams {
  userId: string;
  boardId: number;
  title: string;
  content: string;
  images?: string[];  // 可选图片数组
}

export const createPostService = (data: CreatePostParams) => {
  return request.post('/api/posts', data);
};

/**
 * 2. 获取所有帖子
 * GET {{baseUrl}}/api/posts
 */
export const getAllPostsService = () => {
  return request.get('/api/posts');
};

/**
 * 3. 获取特定板块下的所有帖子
 * GET {{baseUrl}}/api/posts/board/{boardId}
 * （根据 RESTful 推断 URL）
 */
export const getPostsByBoardIdService = (boardId: number) => {
  return request.get(`/api/posts/board/${boardId}`);
};

/**
 * 4. 获取单个帖子详情
 * GET {{baseUrl}}/api/posts/{id}
 */
export const getPostByIdService = (postId: string | number) => {
  return request.get(`/api/posts/${postId}`);
};

/**
 * 5. 删除帖子
 * DELETE {{baseUrl}}/api/posts/{id}
 */
export const deletePostService = (postId: string | number) => {
  return request.delete(`/api/posts/${postId}`);
};

/**
 * 6. 编辑帖子
 * PUT {{baseUrl}}/api/posts/{id}
 */
export interface UpdatePostParams {
  title?: string;
  content?: string;
  images?: string[];
  boardId?: number;
}

export const updatePostService = (postId: string | number, data: UpdatePostParams) => {
  return request.put(`/api/posts/${postId}`, data);
};
export const queryPostsService = (query: string) => {
//   return request.get(`/api/posts/search`, { params: { q: query } });
    return;
}
export const uploadImageService = (data: FormData) => {
    return request.post('/api/posts/uploadImage', data, { headers: { 'Content-Type': 'multipart/form-data' } });
}