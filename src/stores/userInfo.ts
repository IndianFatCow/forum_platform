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
            id: 0, // 数据库bigint → TypeScript number
            username: "", // 非空字段，初始值设为空字符串
            password: "", // 非空字段，注意：实际项目中建议后端脱敏，前端不存储明文
            email: "", // 可选字段，初始值设为undefined
            phone: "", // 可选字段
            avatar: "data:image/webp;base64,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", // 对应数据库avatar_url（小驼峰命名规范）
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
        // chageAvatarUrl( ) {
        //     // 获取新的和旧的URL头
        //     const oldPrefix = 'http://minio:9000';
        //     // const oldPrefix = 'http://minio.orb.192.168.1.166:9000';
        //     // const newPrefix = 'http://127.0.0.1:9000';
        //     // const newPrefix = 'http://192.168.1.166:9000';
        //     const newPrefix = 'http://114.55.235.23:9000';

        //     // 检查当前URL是否以旧的前缀开头
        //     if (this.userinfo.avatar.startsWith(oldPrefix)) {
        //         // 替换为新的前缀
        //         this.userinfo.avatar = newPrefix + this.userinfo.avatar.substring(oldPrefix.length);
        //     }
        // },
        // updateAvatarFromBlob(objectUrl: string) {
        //     this.userinfo.avatar = objectUrl;
        //   },
        removeUserInfo() {
            this.userinfo = {
                id: 0,
                username: "",
                password: "",
                email: "",
                phone: "",
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