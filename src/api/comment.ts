// src/api/comment.ts
import request from '@/utils/request.js';

/**
 * 1. 评论帖子
 * POST {{baseUrl}}/api/comments
 */
export interface CreateCommentParams {
  userId: number;
  postId: number;
  content: string;
}

export const createCommentService = (data: CreateCommentParams) => {
  return request.post('/api/comments', data);
};

/**
 * 2. 点赞评论
 * POST {{baseUrl}}/api/comments/{commentId}/like
 */
export const likeCommentService = (commentId: number | string) => {
  return request.post(`/api/comments/${commentId}/like`, { type: 'like' });
};

/**
 * 3. 点踩评论
 * POST {{baseUrl}}/api/comments/{commentId}/dislike
 */
export const dislikeCommentService = (commentId: number | string) => {
  return request.post(`/api/comments/${commentId}/dislike`);
};