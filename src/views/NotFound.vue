<template>
    <div class="not-found">
      <h1>404</h1>
      <p>页面未找到</p>
      <router-link to="/">返回首页</router-link>
    </div>
  </template>
  
  <script lang="ts" setup>
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .not-found h1 {
    font-size: 100px;
    margin-bottom: 20px;
  }
  
  .not-found p {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .not-found a {
    font-size: 18px;
    color: #409eff;
  }
  </style>