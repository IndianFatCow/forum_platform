import { defineStore } from "pinia";
import type { userInfo } from "@/lib/types";

export const useUserListStore = defineStore("userlist", {
  state: () => ({
    userList: [] as userInfo[], // 存储多个用户信息
    total: 0, // 可选字段，用于分页等
  }),

  actions: {
    // 设置整个用户列表 - 添加防御性检查
    setUserList(users: userInfo[] | undefined | null) {
      // 🔒 防止 undefined 或 null 导致错误
      if (!users || !Array.isArray(users)) {
        console.warn('setUserList 接收到无效数据:', users);
        this.userList = [];
        this.total = 0;
        return;
      }
      
      this.userList = users;
      this.total = users.length;
    },

    // 向列表中追加用户（防止覆盖）
    addUser(user: userInfo) {
      if (!user) return;
      this.userList.push(user);
      this.total = this.userList.length;
    },

    // 根据 ID 更新单个用户信息
    updateUser(userId: number, newInfo: Partial<userInfo>) {
      const user = this.userList.find(u => u.id === userId);
      if (user) Object.assign(user, newInfo);
    },

    // 根据 ID 删除用户 - 修复字段名不一致问题
    removeUser(userId: number) {
      // 🔧 统一使用 id 字段（根据你的 JSON 数据）
      this.userList = this.userList.filter(u => u.id !== userId);
      this.total = this.userList.length;
    },

    // 清空列表
    clearUserList() {
      this.userList = [];
      this.total = 0;
    },
  },

  persist: true, // 🔒 启用持久化存储（刷新不丢）
});

export default useUserListStore;