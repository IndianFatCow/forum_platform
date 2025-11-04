<template>
    <div class="follow-list">
      <el-card
        v-for="user in users"
        :key="user.username"
        class="user-card"
      >
        <div class="user-info">
          <el-avatar
            :src="user.avatar"
            class="avatar"
            @click="goToProfile(user.username)"
          />
          <div class="meta">
            <div class="name" @click="goToProfile(user.username)">{{ user.nickname }}</div>
            <!-- <div class="bio">{{ truncate(user.bio, 20) }}</div> -->
             <div class="bio">{{ user.bio }}</div>
            <!-- <div class="followers">{{ user.followers }} 粉丝</div> -->
          </div>
          <el-button
            class="follow-btn"
            size="small"
            :type="user.subscribed ? 'info' : 'primary'"
            @click="toggleSubscribe(user)"
            @mouseenter="user.hovering = true"
            @mouseleave="user.hovering = false"
          >
            {{ user.subscribed ? (user.hovering ? '取消关注' : '已关注') : '关注他' }}
          </el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted,watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus'; 
  import {getSubscribeList,subscribeUser,unsubscribeUser} from '@/api/subscribe';
  import { chageAvatarUrl,userInfoService} from '@/api/user';
  
  const router = useRouter();
  const users = ref<any[]>([]);
  const props = defineProps<{
  users: any[]
}>(); 

// 当 props.users 变化（或首次挂载）时，批量拉取完整信息
watch(
  () => props.users,//监听props.users
  async (newUsers) => {//newuser为变更后的新值
    if (!newUsers) {
      users.value = []
      return
    }

    // 用 Promise.all 把所有网络请求并行起来，等都返回后一次性写回 users.value，避免部分加载造成界面闪烁。
    const fullUsers = await Promise.all(
      newUsers.map(async u => {
        try {
          const res = await userInfoService(u.username)
          console.log(res.data) 
          const data = res.data   // ← 这里就是你要的完整对象，包含昵称、subscribed 等
          // 加上 avatar、hovering 两个字段
          return {// 返回一个对象，包含所有字段
            ...data,
            avatar: chageAvatarUrl(data.avatar),
            hovering: false
          }
        } catch (err) {
          console.error(`加载用户 ${u.username} 信息失败`, err)
          return {
            username: u.username,
            avatar: '',
            hovering: false,
            // 如果还想保留父组件的其他属性，可以做 ...u
            ...u
          }
        }
      })
    )

    users.value = fullUsers
  },
  { immediate: true }
)

// 截断文本工具
const truncate = (text: string, maxLength: number) =>
  text.length > maxLength ? text.slice(0, maxLength) + '...' : text

// 跳转到用户主页
const goToProfile = (username: string) => {
  router.push(`/profile/${username}`)
}

// 切换关注状态
const toggleSubscribe = async (user: any) => {
  try {
    if (user.subscribed) {
      await unsubscribeUser(user.username)
      user.subscribed = false
      ElMessage.success('已取消关注')
    } else {
      await subscribeUser(user.username)
      user.subscribed = true
      ElMessage.success('关注成功')
    }
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '操作失败')
  }
}
</script>
  
  <style scoped>
  .follow-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .user-card {
    display: flex;
    align-items: center;
    padding: 12px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .avatar {
    cursor: pointer;
    margin-right: 16px;
  }
  
  .meta {
    flex-grow: 1;
  }
  
  .name {
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
  }
  
  .bio {
    color: #666;
    font-size: 14px;
    margin-top: 4px;
  }
  
  .followers {
    color: #999;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .follow-btn {
    min-width: 80px;
    margin-left: auto;
    hover:right;
  }
  </style>
  