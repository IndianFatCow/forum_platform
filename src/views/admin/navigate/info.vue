<script setup>
import { onMounted } from 'vue';
import {useUserInfoStore} from '@/stores/userInfo'

const userInfo = useUserInfoStore()

onMounted(() => {
  console.log('userInfo:', userInfo.userinfo);
});
</script>

<template>
  <div class="info-container p-4 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">用户信息</h1>
    <div class="bg-white p-4 rounded-lg shadow-md">
      <p><strong>用户名:</strong> {{ userInfo.userinfo.username }}</p>
      <p><strong>密码:</strong> {{ userInfo.userinfo.password }}</p>
      <p><strong>邮箱:</strong> {{ userInfo.userinfo.email }}</p>
      <p><strong>昵称:</strong> {{ userInfo.userinfo.nickname }}</p>
      <p><strong>是否登录:</strong> {{ userInfo.isLogin }}</p>
      <p><strong>身份:</strong> {{ userInfo.isAdmin ? '管理员' : '普通用户' }}</p>
      <p><strong>头像:</strong> {{  userInfo.userinfo.avatar }}</p>
      <img :src="userInfo.userinfo.avatar" alt="头像" class="avatar-image">
    </div>

  </div>
</template>

<style scoped>
.info-container {
  max-width: 600px;
  margin: auto;
}

.avatar-image {
  max-width: 100px; /* 设置最大宽度 */
  max-height: 100px; /* 设置最大高度 */
  border-radius: 50%; /* 可选：使图片变为圆形 */
}

</style>
