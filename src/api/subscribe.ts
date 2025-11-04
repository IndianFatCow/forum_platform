//导入请求
import request from '@/utils/request'

//订阅用户
export const subscribeUser = (username?: string) => {
    return request.post(`/subscribe/user/${username}`)
}
//取消订阅
export const unsubscribeUser = (username?: string) => {
    return request.delete(`/subscribe/user/${username}`)
}
//获取订阅列表
export const getSubscribeList = (username: string, resource_type: string,offset:number=0,limit:number=10) => {
    return request.get(`/user/${username}/subscribe`,{params:{offset,limit}})
}
//获取订阅数目
export const getSubscribeCount = (username: string) => {
    return request.get(`subscribe/${username}/count`)
}
//查看是否订阅
export const checkSubscribe = (username: string) => {
    return request.get(`/subscribe/user/${username}/check`)
}