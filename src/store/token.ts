//Login页面的token相关的store
//由于本项目使用Basic Auth认证，未选择JWT，所以token.js文件并未实际应用
//定义store
import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useTokenStore = defineStore('token',()=>{
    //定义状态相关的内容
    //定义响应式变量
    const token = ref('')//默认空串

    const setToken = (newToken:string)=>{//设置token
        token.value = newToken
    }
    const removeToken = ()=>{//移除token
        token.value = ''
    }
    const getToken = ()=>{
        return token.value
    }
    return {
        token,
        setToken,
        removeToken,
        getToken
    }
},{
    persist:true//是否持久化存储
}
)