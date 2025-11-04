import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'; // 可选：持久化存储

// 定义用户状态的接口
interface user {
    username: string;
    password: string;
}


export const useAuthStore = defineStore('auth', {
    state: () => ({//state是全局状态
        user:{
            username: '',
            password: "",
            // Avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
    }),
    actions: {
        setCredentials(data: user) {
            this.user = data;
            // console.log("store.js:",this.username,this.password)
        },
        clearCredentials() {
                // 使用默认值初始化 user 对象，确保类型匹配
            this.user = {
                username: '',
                password: "",
                // Avatar: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",

            };
            // console.log("clear.js:",this.username,this.password)
        },
        getAuthHeader(): string {
            if (this.user.username && this.user.password) {
                return 'Basic ' + btoa(`${this.user.username}:${this.user.password}`)
            }
            return '';
        }
    },
    persist: true // 启用持久化存储
})