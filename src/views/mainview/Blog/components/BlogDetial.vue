<template>
    <div class="blog-detail-container">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <el-button :icon="ArrowLeft" @click="router.back()">返回</el-button>
      </div>
  
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
  
      <!-- 博客内容 -->
      <div v-else-if="postDetail" class="blog-content">
        <el-card>
        <!-- 博客标题区域 -->
        <div class="blog-header">
          <h1 class="blog-title">{{ postDetail.title }}</h1>
          <div class="blog-meta">
            <div class="author-info">
              <el-avatar 
                :size="40" 
                :src="postDetail.author.avatar || '/default-avatar.png'"
                class="author-avatar"
              />
              <div class="author-details">
                <span class="author-name">{{ postDetail.author.username }}</span>
                <span class="post-time">{{ formatTime(postDetail.createTime) }}</span>
              </div>
            </div>
            <div class="blog-actions" v-if="isAuthor">
              <el-button 
                type="primary" 
                :icon="Edit" 
                @click="handleEditPost"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                :icon="Delete" 
                @click="handleDeletePost"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
  
        <!-- 博客内容区域 -->
        <div class="blog-body">
          <div class="content-text">{{ postDetail.content }}</div>
          
          <!-- 图片展示 -->
          <div v-if="postDetail.imageUrl && postDetail.imageUrl !== 'null'" class="blog-images">
            <el-image 
              :src="postDetail.imageUrl" 
              :preview-src-list="[postDetail.imageUrl]"
              fit="cover"
              class="blog-image"
            />
          </div>
        </div>
        </el-card>
        <!-- 博客信息栏 -->
        <div class="blog-footer">
          <div class="blog-info">
            <span class="board-tag">
              <el-tag type="info">{{ postDetail.board.name }}</el-tag>
            </span>
            <div class="action-stats">
              <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>评论 {{ postDetail.comments.length }}</span>
              </span>
            </div>
          </div>
        </div>
  
        <!-- 评论区 -->
        <div class="comments-section">
          <div class="comments-header">
            <h3>评论 ({{ postDetail.comments.length }})</h3>
          </div>
  
          <!-- 发表评论 -->
          <div class="comment-form" v-if="userInfoStore.isLogin">
            <el-input
              v-model="newComment"
              type="textarea"
              :rows="3"
              placeholder="写下你的评论..."
              maxlength="500"
              show-word-limit
            />
            <div class="comment-actions">
              <el-button type="primary" @click="submitComment" :loading="commentLoading">
                发表评论
              </el-button>
            </div>
          </div>
          <div v-else class="login-tip">
            <el-button type="primary" @click="router.push('/login')">登录后发表评论</el-button>
          </div>
  
          <!-- 评论列表 -->
          <div class="comments-list">
            <div 
              v-for="comment in postDetail.comments" 
              :key="comment.id" 
              class="comment-item"
            >
            <el-card>
              <div class="comment-header">
                <el-avatar 
                  :size="32" 
                  :src="comment.author.avatar || '/default-avatar.png'"
                />
                <div class="comment-author">
                  <span class="author-name">{{ comment.author.username }}</span>
                  <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                </div>
                <div class="comment-likes">
                  <el-button 
                    text 
                    :icon="Star" 
                    @click="handleLikeComment(comment.id)"
                    :class="{ 'liked': commentLikes[comment.id] === 'like' }"
                  >
                    {{ comment.likes }}
                  </el-button>
                  <el-button 
                    text 
                    @click="handleDislikeComment(comment.id)"
                    :class="{ 'disliked': commentLikes[comment.id] === 'dislike' }"
                  >
                    {{ comment.dislikes }}
                  </el-button>
                </div>
              </div>
              <div class="comment-content">
                {{ comment.content }}
              </div>
  
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length" class="replies-list">
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id" 
                  class="reply-item"
                >
                  <div class="reply-header">
                    <el-avatar 
                      :size="28" 
                      :src="reply.author.avatar || '/default-avatar.png'"
                    />
                    <div class="reply-author">
                      <span class="author-name">{{ reply.author.username }}</span>
                      <span class="reply-time">{{ formatTime(reply.createTime) }}</span>
                    </div>
                    <div class="reply-likes">
                      <el-button 
                        text 
                        :icon="Star" 
                        @click="handleLikeComment(reply.id)"
                        :class="{ 'liked': commentLikes[reply.id] === 'like' }"
                      >
                        {{ reply.likes }}
                      </el-button>
                      <el-button 
                        text 
                        @click="handleDislikeComment(reply.id)"
                        :class="{ 'disliked': commentLikes[reply.id] === 'dislike' }"
                      >
                        {{ reply.dislikes }}
                      </el-button>
                    </div>
                  </div>
                  <div class="reply-content">
                    {{ reply.content }}
                  </div>
                </div>
              </div>
              </el-card>
            </div>
          </div>
  
          <!-- 空评论状态 -->
          <div v-if="postDetail.comments.length === 0" class="empty-comments">
            <el-empty description="暂无评论，快来抢沙发吧~" />
          </div>
        </div>
      </div>
  
      <!-- 404状态 -->
      <div v-else class="not-found">
        <el-empty description="博客不存在或已被删除" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { 
    ArrowLeft,
    Edit,
    Delete,
    ChatDotRound,
    Star
  } from '@element-plus/icons-vue';
  import { getPostByIdService, deletePostService } from '@/api/post';
  import { createCommentService, likeCommentService, dislikeCommentService } from '@/api/comment';
  import { useUserInfoStore } from '@/stores/userInfo';
  import type { PostDetail } from '@/lib/types';
  
  const router = useRouter();
  const route = useRoute();
  const userInfoStore = useUserInfoStore();
  
  // 响应式数据
  const loading = ref(true);
  const postDetail = ref<PostDetail | null>(null);
  const newComment = ref('');
  const commentLoading = ref(false);
  const commentLikes = reactive<Record<number, 'like' | 'dislike' | null>>({});
  
  // 计算属性
  const isAuthor = computed(() => {
    if (!postDetail.value || !userInfoStore.userinfo) return false;
    return postDetail.value.author.id === userInfoStore.userinfo.userId || userInfoStore.userinfo.role === 'ADMIN';
  });
  
  // 方法
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('zh-CN');
  };
  
  const fetchPostDetail = async () => {
    try {
      loading.value = true;
      const postId = route.params.id as string;
      const res = await getPostByIdService(postId);
      postDetail.value = res;
      console.log('res',res);
      console.log('博客详情:', postDetail.value);
    } catch (error) {
      console.error('获取博客详情失败:', error);
      ElMessage.error('获取博客详情失败');
    } finally {
      loading.value = false;
    }
  };
  
  const handleEditPost = () => {
    if (!postDetail.value) return;
    router.push(`/edit_post/${postDetail.value.id}`);
  };
  
  const handleDeletePost = async () => {
    if (!postDetail.value) return;
    
    try {
      await ElMessageBox.confirm('确定要删除这篇博客吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      });
      
      await deletePostService(postDetail.value.id);
      ElMessage.success('删除成功');
      router.push('/home');
    } catch (error) {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  };
  
  const submitComment = async () => {
    if (!newComment.value.trim()) {
      ElMessage.warning('请输入评论内容');
      return;
    }
  
    if (userInfoStore.isLogin === false) {
      ElMessage.warning('请先登录');
      return;
    }
  
    if (!postDetail.value) {
      ElMessage.error('博客信息加载失败');
      return;
    }
    
    try {
      commentLoading.value = true;
      
      await createCommentService({
        userId: userInfoStore.userinfo.userId,
        postId: postDetail.value.id,
        content: newComment.value.trim()
      });
      
      ElMessage.success('评论成功');
      newComment.value = '';
      // 重新加载博客详情以获取最新评论
      await fetchPostDetail();

    } catch (error) {
      console.error('评论失败:', error);
      ElMessage.error('评论失败');
    } finally {
      commentLoading.value = false;
    }
  };
  
  const handleLikeComment = async (commentId: number) => {
    if (!userInfoStore.userinfo) {
      ElMessage.warning('请先登录');
      return;
    }
  
    try {
      // 如果已经点赞，取消点赞
      if (commentLikes[commentId] === 'like') {
        commentLikes[commentId] = null;
        // 这里应该调用取消点赞的API，但您的API中没有提供
        ElMessage.info('取消点赞');
        return;
      }
  
      await likeCommentService(commentId);
      commentLikes[commentId] = 'like';
      ElMessage.success('点赞成功');
      
      // 重新加载数据更新点赞数
      await fetchPostDetail();
    } catch (error) {
      console.error('点赞失败:', error);
      ElMessage.error('点赞失败');
    }
  };
  
  const handleDislikeComment = async (commentId: number) => {
    if (!userInfoStore.userinfo) {
      ElMessage.warning('请先登录');
      return;
    }
  
    try {
      // 如果已经点踩，取消点踩
      if (commentLikes[commentId] === 'dislike') {
        commentLikes[commentId] = null;
        ElMessage.info('取消点踩');
        return;
      }
  
      await dislikeCommentService(commentId);
      commentLikes[commentId] = 'dislike';
      ElMessage.success('点踩成功');
      
      // 重新加载数据更新点踩数
      await fetchPostDetail();
    } catch (error) {
      console.error('点踩失败:', error);
      ElMessage.error('点踩失败');
    }
  };
  
  // 初始化点赞状态
  const initCommentLikes = () => {
    if (!postDetail.value) return;
    
    // 这里可以根据用户信息初始化点赞状态
    // 暂时简单初始化
    console.log('初始化点赞状态', postDetail);
    postDetail.value.comments.forEach(comment => {
      commentLikes[comment.id] = null;
      if (comment.replies) {
        comment.replies.forEach(reply => {
          commentLikes[reply.id] = null;
        });
      }
    });
  };
  
//   // 监听postDetail变化，初始化点赞状态
//   watch(postDetail, () => {
//     initCommentLikes();
//   });
  
  // 生命周期
  onMounted(() => {
    fetchPostDetail();
  });
  </script>
  
  <style scoped lang="scss">
  .blog-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .back-nav {
    margin-bottom: 20px;
  }
  
  .loading-container {
    padding: 40px 0;
  }
  
  .blog-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .blog-title {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 20px;
    color: #1a1a1a;
  }
  
  .blog-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .author-details {
    display: flex;
    flex-direction: column;
  }
  
  .author-name {
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .post-time {
    font-size: 12px;
    color: #999;
  }
  
  .blog-body {
    margin-bottom: 30px;
  }
  
  .content-text {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
    margin-bottom: 20px;
    white-space: pre-wrap;
  }
  
  .blog-images {
    margin: 20px 0;
  }
  
  .blog-image {
    max-width: 100%;
    border-radius: 8px;
  }
  
  .blog-footer {
    margin-bottom: 40px;
    padding: 20px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .blog-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .action-stats {
    display: flex;
    gap: 20px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 14px;
  }
  
  .comments-section {
    margin-top: 40px;
  }
  
  .comments-header {
    margin-bottom: 20px;
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
  
  .comment-form {
    margin-bottom: 30px;
  }
  
  .comment-actions {
    margin-top: 12px;
    text-align: right;
  }
  
  .login-tip {
    text-align: center;
    margin: 30px 0;
  }
  
  .comment-item {
    padding: 20px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  
  .comment-author {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 12px;
  }
  
  .comment-time {
    font-size: 12px;
    color: #999;
  }
  
  .comment-content {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 12px;
  }
  
  .comment-likes {
    display: flex;
    gap: 8px;
    
    .liked {
      color: #ff6b6b;
    }
    
    .disliked {
      color: #409eff;
    }
  }
  
  .replies-list {
    margin-left: 44px;
    margin-top: 16px;
    padding-left: 16px;
    border-left: 2px solid #f0f0f0;
  }
  
  .reply-item {
    padding: 12px 0;
    border-bottom: 1px solid #f9f9f9;
  }
  
  .reply-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .reply-author {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 8px;
  }
  
  .reply-time {
    font-size: 11px;
    color: #999;
  }
  
  .reply-content {
    font-size: 13px;
    line-height: 1.5;
    color: #666;
  }
  
  .reply-likes {
    display: flex;
    gap: 8px;
    
    .liked {
      color: #ff6b6b;
    }
    
    .disliked {
      color: #409eff;
    }
  }
  
  .empty-comments {
    margin: 40px 0;
  }
  
  .not-found {
    text-align: center;
    margin: 60px 0;
  }
  
  @media (max-width: 768px) {
    .blog-detail-container {
      padding: 16px;
    }
    
    .blog-title {
      font-size: 24px;
    }
    
    .blog-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .blog-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .comment-header,
    .reply-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .comment-likes,
    .reply-likes {
      align-self: flex-end;
    }
    
    .replies-list {
      margin-left: 20px;
    }
  }
  </style>