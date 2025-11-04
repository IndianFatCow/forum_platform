<template>
  <el-card class="profile-header" shadow="never" body-style="{ padding: 0 }">
    <!-- 灰色背景区 + IP 属地 -->
    <div class="header-bg">
      <el-badge
        class="ip-badge"
        :value="`IP 属地：${props.user?.ip_address || '未知地'}`"
        type="info"
      />
    </div>

    <div class="profile-main">
      <!-- 头像 + 基本信息 -->
      <div class="left">
        <el-avatar :src="props.user?.avatar "  @click="()=>{router.push('/userCenter/avatar')}" style="cursor: pointer" shape="square" class="avatar"/>
        <div class="info">
          <h2 class="name">{{ props.user?.nickname }}</h2>
          <p class="bio">{{ props.user?.bio }}</p>
          <el-button type="primary" size="small" @click="onEditProfile" v-if="props.isUser">
            编辑个人资料
          </el-button>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="right">
        <el-statistic
          class="stat"
          title="关注"
          :value="props.followingCount"
          :precision="0"
        />
        <el-statistic
          class="stat"
          title="粉丝"
          :value="props.followersCount"
          :precision="0"
        />
        <el-statistic
          class="stat"
          title="文章"
          :value="props.articleCount"
          :precision="0"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits,ref,onMounted } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { userInfoUpdateService, userInfoService,chageAvatarUrl } from '@/api/user';
import { useRouter,useRoute } from 'vue-router'
import type { userInfo } from '@/lib/types';
const router = useRouter()
const route = useRoute()

// 获取路由参数（动态参数）
const username = route.params.username
const userStore = useUserInfoStore().userinfo
const props = withDefaults(defineProps<{
  user: userInfo
  isUser: boolean
  articleCount?: number
  followersCount: number
  followingCount: number
}>(), {
  followersCount: 0,
  followingCount: 0
})

  

const onEditProfile = () => {
  router.push('/userCenter/info')
}
</script>

<style scoped>
.profile-header {
  border-radius: 8px;
  overflow: hidden;
}

/* 灰色背景区 */
.header-bg {
  height: 80px;
  /* background-color: #dbdada; */
  /* background-image: url('@/assets/algo_logo.webq'); */
  /* background-image: url('@/assets/sunrise.jpg'); */
  background-image: url('@/assets/frosty-night.jpg');
  background-size: cover;
  position: relative;
}

/* IP 属地 标签 */
.ip-badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

/* 主体内容区 */
.profile-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

/* 左侧：头像 + 文字 */
.left {
  display: flex;
  align-items: center; 
}
.avatar {
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  width: 80px;
  height: 80px;
}
.info {
  margin-left: 16px;
}
.name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.bio {
  margin: 4px 0 8px;
  color: #666;
  font-size: 14px;
}

/* 右侧：统计数字 */
.right {
  display: flex;
  gap: 24px;
}
.stat .el-statistic__value {
  font-size: 18px;
  font-weight: 500;
}
</style>
