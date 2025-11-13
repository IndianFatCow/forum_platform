<template>
  <div class="home-container"  >
    <!-- 板块信息头部 -->
    <div class="board-header" v-if="currentBoard">
      <div class="board-info">
        <el-button 
          :icon="ArrowLeft" 
          circle 
          @click="router.back()"
          class="back-btn"
        />
        <div class="board-details">
          <h1 class="board-title">{{ currentBoard.name || '模板' }}</h1>
          <p class="board-desc">{{ currentBoard.description || '欢迎来到本板块' }}</p>
        </div>
      </div>

    </div>
    <el-button 
        type="primary" 
        :icon="EditPen"
        @click="showCreateDialog = true"
      >
        发布帖子
      </el-button>
    <!-- 筛选和排序 -->
    <div class="filter-bar">
      <el-radio-group v-model="sortType" @change="handleSortChange">
        <el-radio-button label="latest">最新</el-radio-button>
        <el-radio-button label="hot">最热</el-radio-button>
      </el-radio-group>
      
      <el-input
        v-model="searchKeyword"
        placeholder="搜索帖子..."
        :prefix-icon="Search"
        clearable
        @input="handleSearch"
        style="width: 300px"
      />
    </div>

    <!-- 帖子列表 -->
    <div class="posts-list" :loading="loading">
      <el-empty v-if="!loading && filteredPosts.length === 0" description="暂无帖子" />
      
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="post-card"
        @click="navigateToDetail(post.id)"
      >
        <div class="post-content">
          <div class="post-header">
            <div class="author-info">
              <el-avatar :size="40" :src="post.author.avatar">
                {{ post.author.username?.[0] || 'U' }}
              </el-avatar>
              <div class="author-details">
                <span class="author-name">{{ post.author.username || '匿名用户' }}</span>
                <span class="post-time">{{ formatTime(post.createTime) }}</span>
              </div>
            </div>
          <div @click.stop class="post-actions" v-if="canManagePost(post)">
            <el-dropdown  trigger="click" >
              <el-button :icon="MoreFilled" circle size="small" text />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(post)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(post.id)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          </div>

          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-excerpt">
            {{ getExcerpt(post.content) }}
          </div>

          <!-- 图片预览 -->
          <div class="post-images" v-if="post.imageUrl">
            <el-image :src="post.imageUrl"/>
          </div>

          <div class="post-footer">
            <div class="post-stats">
              <span class="stat-item">
                <el-icon><View /></el-icon>
                {{ Math.floor(Math.random() * 500) + 10 }}
              </span>
              <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ Math.floor(Math.random() * 100) }}
                  <!-- {{ post.comments.length || 0 }} -->
              </span>
              <span class="stat-item">
                <el-icon><Star /></el-icon>
                {{ post.likes || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布/编辑帖子对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="isEditing ? '编辑帖子' : '发布帖子'"
      width="700px"
      @close="resetForm"
    >
      <el-form 
        ref="postFormRef" 
        :model="postForm" 
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="帖子标题" prop="title">
          <el-input 
            v-model="postForm.title" 
            placeholder="请输入帖子标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="帖子内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入帖子内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传图片">
          <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :auto-upload="false"
            :limit="9"
            accept="image/*"
            @change="handleImageChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="submitting"
        >
          {{ isEditing ? '保存' : '发布' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { 
  ArrowLeft,
  EditPen,
  Search,
  MoreFilled,
  Edit,
  Delete,
  View,
  ChatDotRound,
  Star,
  Plus
} from '@element-plus/icons-vue';
import { 
  getAllPostsService,
  getPostsByBoardIdService,
  createPostService,
  updatePostService,
  deletePostService,
  type CreatePostParams,
  type UpdatePostParams
} from '@/api/post';
import { getBoardByIdService } from '@/api/boards';
import { useUserInfoStore } from '@/stores/userInfo'
// Router
const router = useRouter();
const route = useRoute();
const userInfoStore = useUserInfoStore()

// 数据
const loading = ref(false);
const submitting = ref(false);
const showCreateDialog = ref(false);
const isEditing = ref(false);
const currentBoard = ref<any>(null);
const postsList = ref<any[]>([]);
const sortType = ref('latest');
const searchKeyword = ref('');
const fileList = ref<any[]>([]);

// 当前用户ID（需要从store或其他地方获取）
const currentUserId = ref('user123'); // 示例，实际应从用户状态获取
currentUserId.value = userInfoStore.userinfo.userId || 'user123';
// 表单相关
const postFormRef = ref<FormInstance>();
const postForm = reactive({
  id: '',
  title: '',
  content: '',
  imageUrl: "" 
});

const formRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 10, message: '内容至少 10 个字符', trigger: 'blur' }
  ]
});

// 计算属性 - 筛选后的帖子
const filteredPosts = computed(() => {
  let posts = [...postsList.value];
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.content.toLowerCase().includes(keyword)
    );
  }
  
  // 排序
  if (sortType.value === 'latest') {
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortType.value === 'hot') {
    posts.sort((a, b) => ( b.likes * 2) - ( a.likes * 2));
  }
  
  return posts;
});

// 加载板块信息
const loadBoardInfo = async (boardId: number) => {
  try {
    const response = await getBoardByIdService(String(boardId));
    // console.log('board',response);
    currentBoard.value = response;
    console.log('currentBoard',currentBoard.value);
  } catch (error: any) {
    ElMessage.error(error.message || '加载板块信息失败');
  }
};

// 加载帖子列表
const loadPosts = async () => {
  loading.value = true;
  try {
    const boardId = route.params.id;
    let response;
    
    if (boardId) {
      // 加载特定板块的帖子
      await loadBoardInfo(Number(boardId));
      response = await getPostsByBoardIdService(Number(boardId));
    } else {
      // 加载所有帖子
      response = await getAllPostsService();
    }
    console.log('res',response);
    postsList.value = response || [];
  } catch (error: any) {
    ElMessage.error(error.message || '加载帖子失败');
  } finally {
    loading.value = false;
  }
};

// 导航到帖子详情
const navigateToDetail = (postId: string | number) => {
  router.push(`/blogDetail/${postId}`);
};

// 判断是否可以管理帖子
const canManagePost = (post: any) => {
  // return post.author === currentUserId.value || userInfoStore.isAdmin; // 或者加上管理员判断
  return true;
};

// 编辑帖子
const handleEdit = (post: any) => {
  router.push(`/edit_Post/${post.id}`);
};

// 删除帖子
const handleDelete = (postId: string | number) => {
  ElMessageBox.confirm(
    '确定要删除这篇帖子吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await deletePostService(postId);
      ElMessage.success('删除成功');
      loadPosts();
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败');
    }
  }).catch(() => {});
};

// 图片上传变化
const handleImageChange = (file: any, fileList: any[]) => {
  // 这里应该实现图片上传到服务器的逻辑
  // 暂时使用本地URL
  postForm.imageUrl = fileList.map(f => f.url || URL.createObjectURL(f.raw));
};

// 提交表单
const handleSubmit = async () => {
  if (!postFormRef.value) return;
  
  await postFormRef.value.validate(async (valid) => {
    if (!valid) return;
    
    submitting.value = true;
    try {
      if (isEditing.value) {
        const updateData: UpdatePostParams = {
          title: postForm.title,
          content: postForm.content,
          imageUrl: postForm.imageUrl
        };
        await updatePostService(postForm.id, updateData);
        ElMessage.success('更新成功');
      } else {
        const boardId = route.params.id ? Number(route.params.id) : 1; // 默认板块
        const createData: CreatePostParams = {
          userId: currentUserId.value,
          boardId: boardId,
          title: postForm.title,
          content: postForm.content,
          imageUrl: postForm.imageUrl
        };
        console.log('createData',createData);
        await createPostService(createData);
        ElMessage.success('发布成功');
      }
      
      showCreateDialog.value = false;
      loadPosts();
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  });
};

// 重置表单
const resetForm = () => {
  isEditing.value = false;
  postForm.id = '';
  postForm.title = '';
  postForm.content = '';
  postForm.imageUrl = "";
  fileList.value = [];
  postFormRef.value?.clearValidate();
};

// 排序变化
const handleSortChange = () => {
  // 计算属性会自动重新计算
};

// 搜索
const handleSearch = () => {
  // 计算属性会自动重新计算
};

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`;
  
  return date.toLocaleDateString('zh-CN');
};

// 获取摘要
const getExcerpt = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

// 生命周期
onMounted(() => {
  loadPosts();
});
</script>

<style scoped lang="scss">
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.board-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .board-info {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      flex-shrink: 0;
    }

    .board-details {
      .board-title {
        font-size: 24px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 8px 0;
      }

      .board-desc {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }
  }
}

.filter-bar {
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .author-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .author-details {
      display: flex;
      flex-direction: column;

      .author-name {
        font-weight: 500;
        color: #1f2937;
      }

      .post-time {
        font-size: 12px;
        color: #9ca3af;
      }
    }
  }
}

.post-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
}

.post-images {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  position: relative;

  .preview-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    object-fit: cover;
  }

  .more-images {
    position: absolute;
    right: 8px;
    bottom: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.post-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;

  .post-stats {
    display: flex;
    gap: 24px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #6b7280;

      .el-icon {
        font-size: 16px;
      }
    }
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .board-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-bar {
    flex-direction: column;
    gap: 12px;
    
    .el-input {
      width: 100% !important;
    }
  }
}
</style>