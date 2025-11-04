<template>
  <author
  :user="postUser"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import author from '../../mainview/Blog/components/author.vue'
import { useUserInfoStore } from '@/stores/userInfo'
const postUser = ref(useUserInfoStore().userinfo)
console.log(postUser.value)
</script>

<style>

</style>