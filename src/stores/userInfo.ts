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
            avatar: "https://cn.bing.com/images/search?view=detailV2&ccid=502te6tE&id=CB0D31CC320132C889CA90BC0890777833F3E839&thid=OIP.502te6tEfgMtGd3e1-8OTwAAAA&mediaurl=https%3a%2f%2fwww.keaitupian.cn%2fcjpic%2ffrombd%2f0%2f253%2f2664078285%2f2257336500.jpg&exph=364&expw=400&q=%e5%a4%b4%e5%83%8f&FORM=IRPRST&ck=1AFCA7BBED24953294B6152800977F49&selectedIndex=139&itb=0", // 对应数据库avatar_url（小驼峰命名规范）
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