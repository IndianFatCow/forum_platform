<template>
  <div class="user-list-container">
    <!-- 搜索栏 -->
    <div class="search-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户..."
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 用户列表 -->
    <div v-else-if="userListStore.userList.length > 0" class="user-list">
      <el-card
        v-for="user in userListStore.userList"
        :key="user.id"
        class="user-card"
        shadow="hover"
      >
        <div class="user-info">
          <el-avatar :size="60" :src="user.avatar || '/default-avatar.png'" />
          <div class="user-details">
            <div class="user-name">{{ user.username || '未命名用户' }}</div>
            <div class="user-meta">
              <span v-if="user.email" class="meta-item">
                <el-icon><Message /></el-icon>
                {{ user.email }}
              </span>
              <span v-if="user.phone" class="meta-item">
                <el-icon><Phone /></el-icon>
                {{ user.phone }}
              </span>
            </div>
          </div>
          <div class="user-actions">
            <el-button type="primary" text @click="viewUserDetail(user.id)">
              查看详情
            </el-button>
            <el-button type="danger" text @click="handleDeleteUser(user.id)">
              删除
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 分页 -->
      <div class="pagination">
        <el-text type="info">共 {{ userListStore.total }} 个用户</el-text>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-else
      :description="searchKeyword ? `未找到「${searchKeyword}」相关用户` : '暂无用户数据'"
    >
      <el-button type="primary" @click="handleSearch">刷新</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Message, Phone } from '@element-plus/icons-vue'
import { useUserListStore } from '@/stores/userList'
import { userListService } from '@/api/user'
import type { userInfo } from '@/lib/types'

const route = useRoute()
const router = useRouter()
const userListStore = useUserListStore()

const searchKeyword = ref<string>('')
const loading = ref<boolean>(false)

// 获取用户列表
const fetchUserList = async (keyword?: string) => {
  loading.value = true
  try {
    const res = await userListService(keyword)
    
    console.log('API 返回数据:', res) // 🔍 调试日志
    
    // 接口直接返回数组，不需要判断 code
    if (Array.isArray(res)) {
      userListStore.setUserList(res as userInfo[])
    } else if (res?.success === true && Array.isArray(res.data)) {
      // 兼容包装格式 { success: true, data: [] }
      userListStore.setUserList(res.data as userInfo[])
    } else {
      console.warn('无法识别的响应格式:', res)
      ElMessage.warning('获取用户列表失败')
      userListStore.clearUserList()
    }
  } catch (error: any) {
    console.error('获取用户列表失败:', error)
    // 错误提示已在拦截器中处理，这里只需清空列表
    userListStore.clearUserList()
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  // 更新路由参数（保持 URL 同步）
  router.push({
    path: '/users',
    query: searchKeyword.value ? { search: searchKeyword.value } : {}
  })
  
  // 执行搜索
  fetchUserList(searchKeyword.value || "")
}

// 查看用户详情
const viewUserDetail = (userId: number) => {
  router.push(`/user/${userId}`)
}

// 删除用户
const handleDeleteUser = async (userId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 从 store 中删除（实际项目需要调用删除 API）
    // 🔧 使用 id 而不是 userId
    userListStore.removeUser(userId)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消操作
  }
}

// 初始化：从路由获取搜索参数
onMounted(() => {
  const searchParam = route.query.search as string
  if (searchParam) {
    searchKeyword.value = decodeURIComponent(searchParam)
  }
  
  // 加载用户列表
  fetchUserList(searchKeyword.value || undefined)
})
</script>

<style scoped lang="scss">
.user-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;

  .search-input {
    flex: 1;
  }
}

.loading-container {
  padding: 20px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-card {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .user-details {
    flex: 1;

    .user-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #303133;
    }

    .user-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 14px;
      color: #909399;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .user-actions {
    display: flex;
    gap: 8px;
  }
}

.pagination {
  margin-top: 24px;
  text-align: center;
}

// 响应式设计
@media (max-width: 768px) {
  .user-card .user-info {
    flex-direction: column;
    align-items: flex-start;

    .user-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>