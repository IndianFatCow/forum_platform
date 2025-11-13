<!-- src/views/Messages.vue -->
<template>
    <div class="messages-page">
      <el-container>
        <!-- 左侧会话列表 -->
        <el-aside width="320px" class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>消息</h2>
            <el-button 
              type="primary" 
              :icon="Plus" 
              circle 
              size="small"
              @click="showNewMessageDialog = true"
            />
          </div>
  
          <el-input
            v-model="searchQuery"
            placeholder="搜索联系人"
            :prefix-icon="Search"
            clearable
            class="search-input"
          />
  
          <el-scrollbar class="conversations-list">
            <div
              v-for="conv in filteredConversations"
              :key="conv.userId"
              class="conversation-item"
              :class="{ active: selectedUserId === conv.userId }"
              @click="selectConversation(conv.userId)"
            >
              <el-badge :value="conv.unreadCount" :hidden="conv.unreadCount === 0">
                <el-avatar :size="48" class="conv-avatar">
                  {{ conv.userName[0] }}
                </el-avatar>
              </el-badge>
              <div class="conv-info">
                <div class="conv-header">
                  <span class="conv-name">{{ conv.userName }}</span>
                  <span class="conv-time">{{ formatTime(conv.lastMessageTime) }}</span>
                </div>
                <p class="conv-preview">{{ conv.lastMessage }}</p>
              </div>
            </div>
  
            <el-empty 
              v-if="filteredConversations.length === 0" 
              description="暂无会话"
              :image-size="100"
            />
          </el-scrollbar>
        </el-aside>
  
        <!-- 右侧聊天区域 -->
        <el-main class="chat-area">
          <div v-if="selectedUserId === null" class="empty-state">
            <el-icon :size="80" color="#909399"><ChatDotRound /></el-icon>
            <p>选择一个会话开始聊天</p>
          </div>
  
          <div v-else class="chat-container">
            <!-- 聊天头部 -->
            <div class="chat-header">
              <div class="user-info">
                <el-avatar :size="40">
                  {{ getSelectedUserName()[0] }}
                </el-avatar>
                <span class="user-name">{{ getSelectedUserName() }}</span>
              </div>
              <div class="chat-actions">
                <el-button :icon="Delete" text @click="clearConversation">
                  清空会话
                </el-button>
              </div>
            </div>
  
            <!-- 消息列表 -->
            <el-scrollbar ref="messageScrollbar" class="messages-list">
              <div class="messages-content" ref="messagesContent">
                <div
                  v-for="msg in currentMessages"
                  :key="msg.id"
                  class="message-item"
                  :class="{ 'is-mine': msg.senderId === currentUserId }"
                >
                  <el-avatar :size="36" class="msg-avatar">
                    {{ getUserName(msg.senderId)[0] }}
                  </el-avatar>
                  <div class="msg-content">
                    <div class="msg-header">
                      <span class="msg-sender">{{ getUserName(msg.senderId) }}</span>
                      <span class="msg-time">{{ formatTime(msg.createTime) }}</span>
                    </div>
                    <div class="msg-bubble">
                      <el-tag v-if="msg.type" size="small" class="msg-type">
                        {{ msg.type }}
                      </el-tag>
                      <p class="msg-text">{{ msg.content }}</p>
                    </div>
                  </div>
                </div>
  
                <div v-if="currentMessages.length === 0" class="no-messages">
                  <p>还没有消息,发送第一条消息吧!</p>
                </div>
              </div>
            </el-scrollbar>
  
            <!-- 输入区域 -->
            <div class="input-area">
              <div class="input-toolbar">
                <el-select 
                  v-model="messageType" 
                  placeholder="消息类型" 
                  size="small"
                  style="width: 120px"
                >
                  <el-option label="普通消息" value="普通" />
                  <el-option label="回复" value="回复" />
                  <el-option label="点赞" value="点赞" />
                  <el-option label="评论" value="评论" />
                  <el-option label="关注" value="关注" />
                  <el-option label="系统通知" value="系统" />
                </el-select>
              </div>
              <div class="input-box">
                <el-input
                  v-model="messageContent"
                  type="textarea"
                  :rows="3"
                  placeholder="输入消息内容... (Ctrl+Enter 发送)"
                  resize="none"
                  @keydown.ctrl.enter="handleSendMessage"
                />
                <div class="input-actions">
                  <span class="char-count">{{ messageContent.length }}/500</span>
                  <el-button 
                    type="primary" 
                    :icon="Promotion"
                    :loading="sending"
                    :disabled="!messageContent.trim()"
                    @click="handleSendMessage"
                  >
                    发送
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
  
      <!-- 新建会话对话框 -->
      <el-dialog
        v-model="showNewMessageDialog"
        title="新建会话"
        width="400px"
      >
        <el-form :model="newMessageForm" label-width="80px">
          <el-form-item label="选择用户">
            <el-select 
              v-model="newMessageForm.receiverId" 
              placeholder="请选择接收者"
              filterable
            >
              <el-option
                v-for="user in availableUsers"
                :key="user.id"
                :label="user.name"
                :value="user.id"
                :disabled="user.id === currentUserId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="消息类型">
            <el-select v-model="newMessageForm.type" placeholder="选择类型">
              <el-option label="普通消息" value="普通" />
              <el-option label="回复" value="回复" />
              <el-option label="点赞" value="点赞" />
              <el-option label="评论" value="评论" />
              <el-option label="关注" value="关注" />
              <el-option label="系统通知" value="系统" />
            </el-select>
          </el-form-item>
          <el-form-item label="消息内容">
            <el-input
              v-model="newMessageForm.content"
              type="textarea"
              :rows="4"
              placeholder="输入消息内容"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showNewMessageDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            :loading="sending"
            :disabled="!newMessageForm.receiverId || !newMessageForm.content.trim()"
            @click="handleSendNewMessage"
          >
            发送
          </el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, nextTick, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox, ElScrollbar } from 'element-plus'
  import {
    Search,
    Plus,
    Delete,
    Promotion,
    ChatDotRound
  } from '@element-plus/icons-vue'
  import {
    getNotifications,
    sendNotification,
    type SendNotificationParams
  } from '@/api/socket'
  
  // 定义通知数据类型
  interface NotificationItem {
    id: number
    senderId: number
    createTime: string
    isRead: boolean
    message: string
    type: string
    content: string
  }
  
  // 定义会话类型
  interface Conversation {
    userId: number
    userName: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
  }
  
  // Router
  const route = useRoute()
  const router = useRouter()
  
  // 状态
  const currentUserId = ref(1) // 实际应从 store 获取
  const selectedUserId = ref<number | null>(null)
  const searchQuery = ref('')
  const messageContent = ref('')
  const messageType = ref('普通')
  const sending = ref(false)
  const showNewMessageDialog = ref(false)
  const messageScrollbar = ref<InstanceType<typeof ElScrollbar>>()
  const messagesContent = ref<HTMLElement>()
  
  // 所有通知消息
  const notifications = ref<NotificationItem[]>([])
  
  // 新建消息表单
  const newMessageForm = ref({
    receiverId: null as number | null,
    type: '普通',
    content: ''
  })
  
  // 用户列表（实际应从API获取）
  const availableUsers = ref([
    { id: 1, name: '我' },
    { id: 2, name: '张三' },
    { id: 3, name: '李四' },
    { id: 4, name: '王五' },
    { id: 5, name: '赵六' },
    { id: 6, name: '孙七' }
  ])
  
  // 用户名映射
  const userNameMap = computed(() => {
    const map = new Map<number, string>()
    availableUsers.value.forEach(user => {
      map.set(user.id, user.name)
    })
    return map
  })
  
  // 获取用户名
  const getUserName = (userId: number): string => {
    return userNameMap.value.get(userId) || `用户${userId}`
  }
  
  // 获取选中用户名
  const getSelectedUserName = (): string => {
    return selectedUserId.value ? getUserName(selectedUserId.value) : ''
  }
  
  // 会话列表
  const conversations = computed<Conversation[]>(() => {
    const convMap = new Map<number, Conversation>()
  
    notifications.value.forEach(notif => {
      // 确定对话方
      const otherUserId = notif.senderId === currentUserId.value 
        ? notif.senderId // 如果是自己发的,暂时也用 senderId（实际应该有 receiverId）
        : notif.senderId
  
      if (!convMap.has(otherUserId)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: getUserName(otherUserId),
          lastMessage: notif.content,
          lastMessageTime: notif.createTime,
          unreadCount: 0
        })
      }
  
      const conv = convMap.get(otherUserId)!
      
      // 更新最后一条消息
      if (new Date(notif.createTime) > new Date(conv.lastMessageTime)) {
        conv.lastMessage = notif.content
        conv.lastMessageTime = notif.createTime
      }
  
      // 统计未读数
      if (!notif.isRead && notif.senderId !== currentUserId.value) {
        conv.unreadCount++
      }
    })
  
    // 按时间排序
    return Array.from(convMap.values()).sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    )
  })
  
  // 过滤后的会话列表
  const filteredConversations = computed(() => {
    if (!searchQuery.value.trim()) {
      return conversations.value
    }
    const query = searchQuery.value.toLowerCase()
    return conversations.value.filter(conv => 
      conv.userName.toLowerCase().includes(query)
    )
  })
  
  // 当前选中用户的消息
  const currentMessages = computed(() => {
    if (!selectedUserId.value) return []
    
    return notifications.value
      .filter(notif => 
        notif.senderId === selectedUserId.value || 
        notif.senderId === currentUserId.value
      )
      .sort((a, b) => 
        new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
      )
  })
  
  // 加载通知
  const loadNotifications = async () => {
    try {
      const res = await getNotifications(currentUserId.value)
      if (res) {
        notifications.value = Array.isArray(res) ? res : (res.list || [])
      }
    } catch (error: any) {
      console.error('加载消息失败:', error)
      ElMessage.error('加载消息失败')
    }
  }
  
  // 选择会话
  const selectConversation = (userId: number) => {
    selectedUserId.value = userId
    router.push(`/messages/${userId}`)
    scrollToBottom()
  }
  
  // 发送消息
  const handleSendMessage = async () => {
    if (!messageContent.value.trim() || !selectedUserId.value) {
      return
    }
  
    if (messageContent.value.length > 500) {
      ElMessage.warning('消息内容不能超过500字')
      return
    }
  
    sending.value = true
    try {
      const params: SendNotificationParams = {
        senderId: currentUserId.value,
        receiverId: selectedUserId.value,
        type: messageType.value,
        content: messageContent.value.trim()
      }
  
      await sendNotification(params)
  
      // 添加到本地消息列表（模拟实时更新）
      notifications.value.push({
        id: Date.now(), // 临时ID
        senderId: currentUserId.value,
        createTime: new Date().toISOString(),
        isRead: true,
        message: 'success',
        type: messageType.value,
        content: messageContent.value.trim()
      })
  
      // 清空输入
      messageContent.value = ''
      messageType.value = '普通'
  
      ElMessage.success('发送成功')
      
      // 滚动到底部
      await nextTick()
      scrollToBottom()
  
      // 重新加载消息
      setTimeout(() => {
        loadNotifications()
      }, 500)
    } catch (error: any) {
      console.error('发送失败:', error)
      ElMessage.error(error.message || '发送失败')
    } finally {
      sending.value = false
    }
  }
  
  // 发送新消息（新建会话）
  const handleSendNewMessage = async () => {
    if (!newMessageForm.value.receiverId || !newMessageForm.value.content.trim()) {
      return
    }
  
    sending.value = true
    try {
      const params: SendNotificationParams = {
        senderId: currentUserId.value,
        receiverId: newMessageForm.value.receiverId,
        type: newMessageForm.value.type,
        content: newMessageForm.value.content.trim()
      }
  
      await sendNotification(params)
  
      ElMessage.success('发送成功')
      showNewMessageDialog.value = false
      
      // 重置表单
      newMessageForm.value = {
        receiverId: null,
        type: '普通',
        content: ''
      }
  
      // 重新加载并选中新会话
      await loadNotifications()
      selectConversation(params.receiverId)
    } catch (error: any) {
      console.error('发送失败:', error)
      ElMessage.error(error.message || '发送失败')
    } finally {
      sending.value = false
    }
  }
  
  // 清空会话
  const clearConversation = async () => {
    try {
      await ElMessageBox.confirm(
        '确定要清空与该用户的所有消息吗？此操作不可恢复。',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
  
      // 这里应该调用删除API
      // 暂时只是从本地移除
      notifications.value = notifications.value.filter(
        notif => notif.senderId !== selectedUserId.value
      )
  
      ElMessage.success('已清空会话')
      selectedUserId.value = null
      router.push('/messages')
    } catch (error) {
      // 用户取消
    }
  }
  
  // 滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      if (messageScrollbar.value) {
        const scrollEl = messageScrollbar.value.$refs.wrap as HTMLElement
        scrollEl.scrollTop = scrollEl.scrollHeight
      }
    })
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
  
  // 监听路由参数变化
  watch(() => route.params.userId, (userId) => {
    if (userId) {
      selectedUserId.value = Number(userId)
      scrollToBottom()
    }
  }, { immediate: true })
  
  // 监听消息变化，自动滚动
  watch(() => currentMessages.value.length, () => {
    scrollToBottom()
  })
  
  // 初始化
  onMounted(() => {
    loadNotifications()
  })
  </script>
  
  <style scoped lang="scss">
  .messages-page {
    height: calc(100vh - 60px);
    background-color: #f5f7fa;
  
    .el-container {
      height: 100%;
    }
  }
  
  // 左侧会话列表
  .conversations-sidebar {
    background: white;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;
  
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e4e7ed;
  
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }
  
    .search-input {
      padding: 12px 16px;
    }
  
    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }
  
    .conversation-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
  
      &:hover {
        background-color: #f5f7fa;
      }
  
      &.active {
        background-color: #ecf5ff;
      }
  
      .conv-avatar {
        background-color: var(--el-color-primary);
        color: white;
        font-weight: 600;
        flex-shrink: 0;
      }
  
      .conv-info {
        flex: 1;
        min-width: 0;
  
        .conv-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
  
          .conv-name {
            font-weight: 600;
            color: #303133;
          }
  
          .conv-time {
            font-size: 12px;
            color: #909399;
            flex-shrink: 0;
          }
        }
  
        .conv-preview {
          margin: 0;
          font-size: 13px;
          color: #606266;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  
  // 右侧聊天区域
  .chat-area {
    padding: 0;
    display: flex;
    flex-direction: column;
  
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;
  
      p {
        margin-top: 16px;
        font-size: 16px;
      }
    }
  
    .chat-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
    }
  
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e4e7ed;
  
      .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
  
        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }
    }
  
    .messages-list {
      flex: 1;
      padding: 20px 24px;
      background-color: #f5f7fa;
    }
  
    .messages-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  
    .message-item {
      display: flex;
      gap: 12px;
      animation: fadeIn 0.3s;
  
      &.is-mine {
        flex-direction: row-reverse;
  
        .msg-content {
          align-items: flex-end;
        }
  
        .msg-bubble {
          background-color: var(--el-color-primary);
          color: white;
        }
  
        .msg-header {
          flex-direction: row-reverse;
        }
      }
  
      .msg-avatar {
        background-color: var(--el-color-primary);
        color: white;
        font-weight: 600;
        flex-shrink: 0;
      }
  
      .msg-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 60%;
      }
  
      .msg-header {
        display: flex;
        gap: 8px;
        align-items: center;
  
        .msg-sender {
          font-size: 13px;
          color: #606266;
          font-weight: 500;
        }
  
        .msg-time {
          font-size: 12px;
          color: #909399;
        }
      }
  
      .msg-bubble {
        padding: 10px 14px;
        border-radius: 8px;
        background-color: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        word-wrap: break-word;
  
        .msg-type {
          margin-bottom: 6px;
        }
  
        .msg-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
      }
    }
  
    .no-messages {
      text-align: center;
      padding: 40px;
      color: #909399;
    }
  
    .input-area {
      border-top: 1px solid #e4e7ed;
      background: white;
  
      .input-toolbar {
        padding: 12px 24px;
        border-bottom: 1px solid #f0f0f0;
      }
  
      .input-box {
        padding: 16px 24px;
  
        .el-textarea {
          :deep(.el-textarea__inner) {
            border: none;
            box-shadow: none;
            padding: 0;
            font-size: 14px;
  
            &:focus {
              box-shadow: none;
            }
          }
        }
  
        .input-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
  
          .char-count {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>