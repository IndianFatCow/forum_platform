// src/api/notifications.ts
import request from '@/utils/request.js'


// 定义发送通知参数类型
export interface SendNotificationParams {
  senderId: number
  receiverId: number
  type: string
  content: string
}

/**
 * 获取当前用户的通知
 * GET {{baseUrl}}/api/notifications/{{userId}}
 * Header: Authorization: Bearer {{token}}
 */
export function getNotifications(userId: number) {
  return request({
    url: `/api/notifications/${userId}`,
    method: 'get'
  })
}

/**
 * 发送通知
 * POST {{baseUrl}}/api/notifications/send
 * Header: Authorization: Bearer {{token}}
 * Body: {
 *   "senderId": number,
 *   "receiverId": number,
 *   "type": string,
 *   "content": string
 * }
 */
export function sendNotification(data: SendNotificationParams) {
  return request({
    url: '/api/notifications/send',
    method: 'post',
    data
  })
}

/**
 * 标记消息为已读
 * PUT {{baseUrl}}/api/notifications/{{id}}/read
 * Header: Authorization: Bearer {{token}}
 */
export function markAsRead(notificationId: number | string) {
  return request({
    url: `/api/notifications/${notificationId}/read`,
    method: 'put'
  })
}

/**
 * 删除通知
 * DELETE {{baseUrl}}/api/notifications/{{id}}
 * Header: Authorization: Bearer {{token}}
 */
export function deleteNotification(notificationId: number | string) {
  return request({
    url: `/api/notifications/${notificationId}`,
    method: 'delete'
  })
}

