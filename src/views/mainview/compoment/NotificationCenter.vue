<!-- src/components/NotificationCenter.vue -->
<template>
  <div class="notification-center">
    <!-- 铃铛按钮 + 红点 -->
    <el-popover
      placement="bottom-end"
      :width="400"
      trigger="click"
      popper-class="notification-popper"
      @show="loadNotifications"
    >
      <template #reference>
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="badge">
          <el-button type="text" class="bell-btn">
            <el-icon :size="22"><Bell /></el-icon>
          </el-button>
        </el-badge>
      </template>

      <!-- 下拉面板内容 -->
      <div class="notification-panel">
        <div class="panel-header">
          <span class="title">消息通知</span>
          <el-button 
            type="text" 
            size="small" 
            @click="refreshNotifications"
            :loading="loading"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>

        <el-tabs v-model="activeTab" class="notification-tabs">
          <el-tab-pane label="未读" name="unread">
            <div v-if="loading" class="loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
            <div v-else-if="unreadMessages.length === 0" class="empty">
              <el-empty description="暂无未读消息" :image-size="80" />
            </div>
            <div v-else class="notification-list">
              <div
                v-for="item in unreadMessages"
                :key="item.id"
                class="notification-item unread"
                @click="handleMessageClick(item)"
              >
                <el-avatar :size="40" class="item-avatar">
                  {{ getSenderName(item.senderId)[0] || 'U' }}
                </el-avatar>
                <div class="item-content">
                  <div class="item-header">
                    <span class="item-sender">{{ getSenderName(item.senderId) }}</span>
                    <span class="item-time">{{ formatTime(item.createTime) }}</span>
                  </div>
                  <div class="item-type">
                    <el-tag size="small" :type="getTypeColor(item.type)">{{ item.type }}</el-tag>
                  </div>
                  <p class="item-message">{{ item.content }}</p>
                </div>
                <el-tag size="small" type="danger" effect="dark">未读</el-tag>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="全部" name="all">
            <div v-if="loading" class="loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
            <div v-else-if="messages.length === 0" class="empty">
              <el-empty description="暂无消息" :image-size="80" />
            </div>
            <div v-else class="notification-list">
              <div
                v-for="item in messages"
                :key="item.id"
                class="notification-item"
                :class="{ unread: !item.isRead }"
                @click="handleMessageClick(item)"
              >
                <el-avatar :size="40" class="item-avatar">
                  {{ getSenderName(item.senderId)[0] || 'U' }}
                </el-avatar>
                <div class="item-content">
                  <div class="item-header">
                    <span class="item-sender">{{ getSenderName(item.senderId) }}</span>
                    <span class="item-time">{{ formatTime(item.createTime) }}</span>
                  </div>
                  <div class="item-type">
                    <el-tag size="small" :type="getTypeColor(item.type)">{{ item.type }}</el-tag>
                  </div>
                  <p class="item-message">{{ item.content }}</p>
                </div>
                <el-dropdown 
                  trigger="click" 
                  @click.stop
                  @command="(cmd: string) => handleCommand(cmd, item)"
                >
                  <el-button type="text" :icon="MoreFilled" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item 
                        v-if="!item.isRead" 
                        command="markRead"
                      >
                        <el-icon><Select /></el-icon>
                        标记已读
                      </el-dropdown-item>
                      <el-dropdown-item command="delete">
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="panel-footer" v-if="messages.length > 0">
          <el-button 
            type="text" 
            size="small" 
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            全部标记已读
          </el-button>
          <el-button type="text" size="small" @click="goToMessages">
            查看全部消息
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Bell, 
  Refresh, 
  Loading, 
  MoreFilled, 
  Select, 
  Delete 
} from '@element-plus/icons-vue'
import { 
  getNotifications, 
  markAsRead, 
  deleteNotification
} from '@/api/socket'

// 定义通知类型接口
interface NotificationItem {
  id: number
  senderId: number
  createTime: string
  isRead: boolean
  message: string
  type: string
  content: string
}

// Router
const router = useRouter()

// 状态
const messages = ref<NotificationItem[]>([])
const loading = ref(false)
const activeTab = ref('unread')
const currentUserId = ref(1) // 实际应从 store 获取当前用户ID
const pollingTimer = ref<number | null>(null)

// 用户名缓存（实际应该从用户API获取）
const userCache = ref<Map<number, string>>(new Map([
  [1, '我'],
  [2, '张三'],
  [3, '李四'],
  [4, '王五']
]))

// 计算属性 - 未读消息
const unreadMessages = computed(() => {
  return messages.value.filter(m => !m.isRead)
})

// 计算属性 - 未读数量
const unreadCount = computed(() => {
  return unreadMessages.value.length
})

// 获取发送者名称
const getSenderName = (senderId: number): string => {
  return userCache.value.get(senderId) || `用户${senderId}`
}

// 根据通知类型获取颜色
const getTypeColor = (type: string): string => {
  const colorMap: Record<string, string> = {
    '回复': 'primary',
    '点赞': 'success',
    '关注': 'warning',
    '系统': 'info',
    '评论': 'primary'
  }
  return colorMap[type] || 'info'
}

// 加载通知列表
const loadNotifications = async () => {
  loading.value = true
  try {
    console.log('开始获取消息...',currentUserId.value)
    const res = await getNotifications(currentUserId.value)
    console.log('获取的消息:', res)
    // 适配返回的数据结构
    if (res) {
      // 如果返回的是数组，直接使用
      if (Array.isArray(res)) {
        messages.value = res
      } 
      // 如果返回的是对象，尝试获取 list 属性
      else if (res.list && Array.isArray(res.list)) {
        messages.value = res.list
      }
      // 否则置空
      else {
        messages.value = []
      }
    }
  } catch (error: any) {
    console.error('加载消息失败:', error)
    ElMessage.error(error.message || '加载消息失败')
  } finally {
    loading.value = false
  }
}

// 刷新通知
const refreshNotifications = async () => {
  await loadNotifications()
  ElMessage.success('刷新成功')
}

// 点击消息
const handleMessageClick = async (notification: NotificationItem) => {
  // 如果未读,标记为已读
  if (!notification.isRead) {
    await handleMarkAsRead(notification.id)
  }
  
  // 根据通知类型跳转
  // 可以根据实际需求调整跳转逻辑
  // 例如:回复通知跳转到对应文章的评论区
  // router.push(`/article/${articleId}#comment-${commentId}`)
  
  // 这里暂时跳转到与发送者的对话
  router.push(`/messages/${notification.senderId}`)
}

// 标记单条消息已读
const handleMarkAsRead = async (notificationId: number) => {
  try {
    await markAsRead(notificationId)
    
    // 更新本地状态
    const notification = messages.value.find(m => m.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
    
    ElMessage.success('已标记为已读')
  } catch (error: any) {
    console.error('标记已读失败:', error)
    ElMessage.error('标记已读失败')
  }
}

// 删除消息
const handleDeleteMessage = async (notificationId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条消息吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteNotification(notificationId)
    
    // 从列表中移除
    messages.value = messages.value.filter(m => m.id !== notificationId)
    ElMessage.success('删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除消息失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 下拉菜单命令处理
const handleCommand = (command: string, notification: NotificationItem) => {
  if (command === 'markRead') {
    handleMarkAsRead(notification.id)
  } else if (command === 'delete') {
    handleDeleteMessage(notification.id)
  }
}

// 全部标记已读
const markAllAsRead = async () => {
  const unreadIds = unreadMessages.value.map(m => m.id)
  
  if (unreadIds.length === 0) {
    ElMessage.info('没有未读消息')
    return
  }

  try {
    // 批量标记已读
    await Promise.all(unreadIds.map(id => markAsRead(id)))
    
    // 更新本地状态
    messages.value.forEach(m => {
      if (unreadIds.includes(m.id)) {
        m.isRead = true
      }
    })
    
    ElMessage.success('已全部标记为已读')
  } catch (error: any) {
    console.error('标记已读失败:', error)
    ElMessage.error('操作失败')
  }
}

// 跳转到消息页面
const goToMessages = () => {
  router.push('/messages')
}

// 时间格式化
const formatTime = (time?: string): string => {
  if (!time) return ''
  
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 开始轮询(每30秒检查一次新消息)
const startPolling = () => {
  // 首次加载
  loadNotifications()
  
  // 设置定时器
  pollingTimer.value = window.setInterval(() => {
    loadNotifications()
  }, 30000) // 30秒
}

// 停止轮询
const stopPolling = () => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

// 生命周期
onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

// 暴露方法供外部调用(可选)
defineExpose({
  refresh: loadNotifications,
  unreadCount
})
</script>
<style scoped lang="scss">
.notification-center {
  .badge {
    :deep(.el-badge__content) {
      border: none;
    }
  }

  .bell-btn {
    padding: 8px;
    color: var(--el-text-color-primary);
    
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.notification-panel {
  max-height: 500px;
  display: flex;
  flex-direction: column;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);

    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .notification-tabs {
    flex: 1;
    overflow: hidden;

    :deep(.el-tabs__content) {
      height: 100%;
      overflow-y: auto;
      max-height: 350px;
    }
  }

  .loading,
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: var(--el-text-color-secondary);
    
    .el-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }

  .notification-list {
    padding: 8px 0;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.unread {
      background-color: var(--el-color-primary-light-9);
    }

    .item-avatar {
      flex-shrink: 0;
      background-color: var(--el-color-primary);
      color: white;
      font-weight: 600;
    }

    .item-content {
      flex: 1;
      min-width: 0;

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .item-sender {
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .item-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          flex-shrink: 0;
          margin-left: 8px;
        }
      }

      .item-type {
        margin-bottom: 4px;
      }

      .item-message {
        margin: 0;
        font-size: 14px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    .el-tag {
      flex-shrink: 0;
      align-self: center;
    }

    .el-dropdown {
      flex-shrink: 0;
      align-self: center;
    }
  }

  .panel-footer {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}
</style>