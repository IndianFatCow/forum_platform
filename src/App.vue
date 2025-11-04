<!-- <script setup>

</script>

<template>
  <router-link to="/login">登录</router-link>
  <router-link to="/">主页</router-link>
  <router-view></router-view>
</template>

<style scoped>

</style> -->
<script setup>
import navigate from '@/views/admin/navigate/navigate.vue';
import { useUserInfoStore} from '@/stores/userInfo';
const userStore = useUserInfoStore();
</script>

<template>
  <navigate v-if="userStore.isAdmin" />
  <router-view></router-view>
</template>

<style scoped>

</style>
