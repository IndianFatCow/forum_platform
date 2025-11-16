import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { userInfo } from "@/lib/types"; // 确保路径正确
import { chageAvatarUrl } from "@/api/user";



interface UserStateUpdate {
    isLogin: boolean;
    isAdmin: boolean;
}

export const useUserInfoStore = defineStore("userinfo", {
    state: ()  => ({
        userinfo: {
            userId: 0, // 数据库bigint → TypeScript number
            username: "", // 非空字段，初始值设为空字符串
            password: "", // 非空字段，注意：实际项目中建议后端脱敏，前端不存储明文
            email: "", // 可选字段，初始值设为undefined
            phone: undefined, // 可选字段

            role: "", // 可选字段，用于判断用户角色（如admin/normal）
            points: undefined, // 数据库int → TypeScript number
            level: undefined, // 数据库int → TypeScript number
            createTime: undefined, // 对应数据库create_time（小驼峰）
            updateTime: undefined, // 对应数据库update_time（小驼峰）
            ip_address: "nanJing" // 对应数据库ip_address字段（新增字段）
        },
        isLogin: false,
        isAdmin: false
    }),
    actions: {
        setUserInfo(newUserInfo: userInfo) {
            this.userinfo = newUserInfo;
        },
        setIP(ip: string){
            this.userinfo.ip_address = ip;
        },
        setState(stateUpdate: UserStateUpdate) {
            this.isLogin = stateUpdate.isLogin;
            this.isAdmin = (stateUpdate.isAdmin);
        },
        chageAvatarUrl(){
            ;
        },

        removeUserInfo() {
            this.userinfo = {
                userId: 0,
                username: "",
                password: "",
                email: "",
                phone: undefined,
                avatar: "",
                role: "",
                points: undefined,
                level: undefined,
                createTime: undefined,
                updateTime: undefined,
                ip_address: ""
            };
            this.isLogin = false;
            this.isAdmin = false;
        },

    },


    persist: true // 启用持久化存储
});

export default useUserInfoStore;