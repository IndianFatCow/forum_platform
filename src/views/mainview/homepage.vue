<script setup>
import { ref,onMounted } from 'vue';
import {ElMessage, ElButton, ElInput, ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem, ElTabs, ElTabPane, ElCard } from 'element-plus';
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Back,
    Menu,
    Search,
} from '@element-plus/icons-vue'


import { useUserInfoStore } from '@/stores/userInfo';
// //头像条目点击后的处理
import { useRouter } from 'vue-router'
import { computed } from 'vue';
const router = useRouter();
// const authStore = useAuthStore();
// const tokenStore = useTokenStore()
const profilePath = computed(() => `/profile/${useUserInfoStore().userinfo.username}`);
import miniCenter from './userCenter/miniCenter.vue';




const searchText = ref('');
const searchType = ref('problems'); // 默认搜索类型为用户
const handleSearch = () => {
  if (searchText.value.trim() === '') {
    ElMessage({
      message: '请输入搜索内容',
      type: 'warning',
    });
    return;
  }
  // 跳转到搜索结果页面
  switch (searchType.value) {
    case 'users':
      router.push(`/question-bank?searchContent=${searchText.value}`);
      break;
    case 'blogs':
      router.push(`/question-bank?searchContent=${searchText.value}`);
      break;
  }
};

</script>
<template>
  <el-container class="layout">
    <!-- 顶部栏 -->
    <el-header class="header">
      <div class="nav-left"  >
        <el-menu mode="horizontal" router :ellipsis="false">
          <el-menu-item index="/show">NJUPT</el-menu-item>
          <el-menu-item index="/home">首页</el-menu-item>
          <el-menu-item :index=profilePath>个人主页</el-menu-item>
          <el-menu-item index="/qa">问答</el-menu-item>
          <!-- <el-menu-item index="/visual-algo">Visual-algo</el-menu-item> -->
        </el-menu>
      </div>

      <div class="nav-center">
        <el-input 
          v-model="searchText"
          placeholder="查找题目文章动态" 
          class="search-bar"
          @keydown.enter="handleSearch">

          <template #prepend>
            <span style="display: flex; align-items: center;">
          <el-icon class="el-input__icon"><Search /></el-icon>
            </span> 
            <el-select v-model="searchType" placeholder="请选择">
              <el-option label="用户" value="users"></el-option>
              <el-option label="题目" value="problems"></el-option>
              <el-option label="动态" value="activities"></el-option>
            </el-select>
          </template>
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
          </el-input>
        </div>

      <div class="nav-right">
          <miniCenter/>
      </div>
    </el-header>
    
    <!-- 主体内容 -->
    <el-main class="main-content">
      <div class="router-view-container"><router-view></router-view></div>
      
    </el-main>
  </el-container>
</template>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;       /* 整体不出现双滚动 */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px; /* 上下也加 padding，撑开区域 */
  background: #ffffff; /* 更白的白色 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* 添加阴影让它看起来像独立头部 */
}

.nav-left {
  display: flex;
  align-items: center;
}


 /* 居中搜索栏 */
.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40%; /* 根据需要调整宽度 */
  display: flex;
  justify-content: center;
}

/* 搜索栏样式 */
.search-bar {
  width: 100%;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
}
/* 确保 el-container 正确撑满视口 */
.el-container {
  height: 100vh;
  /* overflow: hidden; 防止父容器溢出 */
}

.main-content {
  flex: 1 1auto;
  /* overflow: hidden !important; 强制去掉滚动条 */
  padding: 0;
  height: 100%;
  /* background-image: url('@/assets/frosty-night.jpg');
  background-size: cover; */
}
/* 4. router-view-container 只要能撑满并留出底部空间即可 */
.router-view-container {
  min-height: 100%;
  padding: 16px;          /* 可选：给内容区留点内边距 */
  box-sizing: border-box;
  overflow-y: auto;
}
/* 新增：全局样式覆盖 el-main */
:deep(.el-main) {
  /* height: calc(100vh - 60px); 减去 header 的高度（假设 header 高度为 60px） */
  /* overflow-y: hidden; */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

:deep(.el-main::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

:deep(.el-main::-webkit-scrollbar-thumb) {
  background-color: transparent;
  border-radius: 4px;
}

:deep(.el-main::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 确保 el-container 撑满视口 */
/* :deep(.el-container) {
  height: 100vh;
  overflow: hidden;
} */
</style>
