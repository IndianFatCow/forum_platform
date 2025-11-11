// src/api/boards.ts
import request from '@/utils/request.js';

/**
 * 获取板块列表
 * GET {{baseUrl}}/api/boards
 * Header: Authorization: Bearer {{token}}
 */
export const getBoardListService = () => {
  return request.get('/api/boards');
};

/**
 * 创建板块
 * POST {{baseUrl}}/api/boards
 * Header:
 *   Authorization: Bearer {{token}}
 *   Content-Type: application/json
 * Body:
 *   {
 *     "name": string,
 *     "description": string
 *   }
 */
interface CreateBoardParams {
  name: string;
  description?: string;   // description 可选，接口示例里有但并非必须
}
export const createBoardService = (data: CreateBoardParams) => {
  return request.post('/api/boards', data);
};

/**
 * 删除板块
 * 文档中方法写成了 GET，实际应为 DELETE（按 RESTful 规范）
 * DELETE {{baseUrl}}/api/boards/:id
 * Header: Authorization: Bearer {{token}}
 */
export const deleteBoardService = (boardId: string) => {
  return request.delete(`/api/boards/${boardId}`);
};

/**
 * 获取特定 id 的板块详情
 * GET {{baseUrl}}/api/boards/:id
 * Header: Authorization: Bearer {{token}}
 */
export const getBoardByIdService = (boardId: string) => {
  return request.get(`/api/boards/${boardId}`);
};