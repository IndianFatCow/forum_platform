<template>
    <div class="edit-post-container">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <el-button :icon="ArrowLeft" @click="handleCancel">返回</el-button>
      </div>
  
      <div class="edit-form-container">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span class="form-title">{{ isEdit ? '编辑帖子' : '发布新帖' }}</span>
            </div>
          </template>
  
          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="80px"
            :disabled="loading"
          >
            <!-- 板块选择 -->
            <el-form-item label="板块" prop="boardId">
              <el-select
                v-model="formData.boardId"
                placeholder="请选择板块"
                style="width: 100%"
                :loading="boardsLoading"
              >
                <el-option
                  v-for="board in boardList"
                  :key="board.id"
                  :label="board.name"
                  :value="board.id"
                >
                  <div class="board-option">
                    <span class="board-name">{{ board.name }}</span>
                    <span class="board-desc">{{ board.description }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
  
            <!-- 标题 -->
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="formData.title"
                placeholder="请输入帖子标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
  
            <!-- 内容 -->
            <el-form-item label="内容" prop="content">
              <el-input
                v-model="formData.content"
                type="textarea"
                :rows="10"
                placeholder="请输入帖子内容"
                maxlength="2000"
                show-word-limit
                resize="none"
              />
            </el-form-item>
  
            <!-- 图片上传 -->
            <el-form-item label="图片">
              <el-upload
                v-model:file-list="imageList"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleImageChange"
                :on-remove="handleImageRemove"
                :limit="9"
                accept="image/*"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">支持上传最多9张图片，单张图片不超过2MB</div>
            </el-form-item>
  
            <!-- 操作按钮 -->
            <el-form-item class="form-actions">
              <el-button @click="handleCancel">取消</el-button>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ isEdit ? '更新帖子' : '发布帖子' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadProps, type UploadUserFile } from 'element-plus';
  import { 
    ArrowLeft,
    Plus
  } from '@element-plus/icons-vue';
  import { 
    getPostByIdService, 
    createPostService, 
    updatePostService,
    type CreatePostParams,
    type UpdatePostParams
  } from '@/api/post';
  import { getBoardListService } from '@/api/boards';
  import { useUserInfoStore } from '@/stores/userInfo';
  
  const router = useRouter();
  const route = useRoute();
  const userInfoStore = useUserInfoStore();
  const formRef = ref<FormInstance>();
  
  // 响应式数据
  const loading = ref(false);
  const boardsLoading = ref(false);
  const boardList = ref<any[]>([]);
  const imageList = ref<UploadUserFile[]>([]);
  
  // 表单数据
  const formData = reactive({
    boardId: undefined as number | undefined,
    title: '',
    content: '',
  });
  
  // 计算属性
  const isEdit = computed(() => !!route.params.id);
  const postId = computed(() => route.params.id as string);
  
  // 表单验证规则
  const formRules: FormRules = {
    boardId: [
      { required: true, message: '请选择板块', trigger: 'change' }
    ],
    title: [
      { required: true, message: '请输入帖子标题', trigger: 'blur' },
      { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请输入帖子内容', trigger: 'blur' },
      { min: 5, max: 2000, message: '内容长度在 5 到 2000 个字符', trigger: 'blur' }
    ]
  };
  
  // 方法
  const fetchBoardList = async () => {
    try {
      boardsLoading.value = true;
      const res = await getBoardListService();
      boardList.value = res.data;
      console.log('板块列表:', boardList.value);
    } catch (error) {
      console.error('获取板块列表失败:', error);
      ElMessage.error('获取板块列表失败');
    } finally {
      boardsLoading.value = false;
    }
  };
  
  const fetchPostDetail = async () => {
    if (!isEdit.value) return;
    
    try {
      loading.value = true;
      const res = await getPostByIdService(postId.value);
      const post = res;
      
      // 填充表单数据
      formData.boardId = post.board.id;
      formData.title = post.title;
      formData.content = post.content;
      
      // 处理图片
      if (post.imageUrl && post.imageUrl !== 'null') {
        imageList.value = [{
          name: '帖子图片',
          url: post.imageUrl
        }];
      }
      
      console.log('帖子详情:', post);
    } catch (error) {
      console.error('获取帖子详情失败:', error);
      ElMessage.error('获取帖子详情失败');
      router.back();
    } finally {
      loading.value = false;
    }
  };
  
  const handleImageChange: UploadProps['onChange'] = (file, fileList) => {
    // 验证文件大小
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB!');
      fileList.splice(fileList.indexOf(file), 1);
      return;
    }
    
    imageList.value = fileList;
  };
  
  const handleImageRemove: UploadProps['onRemove'] = (file, fileList) => {
    imageList.value = fileList;
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleSubmit = async () => {
    if (!formRef.value) return;
    
    // 表单验证
    try {
      await formRef.value.validate();
    } catch (error) {
      ElMessage.warning('请完善表单信息');
      return;
    }
  
    // 检查用户登录状态
    if (!userInfoStore.userinfo) {
      ElMessage.warning('请先登录');
      router.push('/login');
      return;
    }
  
    try {
      loading.value = true;
      
      // 准备图片数据
      const images = imageList.value.map(file => {
        // 这里需要实际处理图片上传
        // 暂时返回预览URL或文件名
        return file.url || file.name;
      });
  
      if (isEdit.value) {
        // 编辑帖子
        const updateData: UpdatePostParams = {
          title: formData.title,
          content: formData.content,
          boardId: formData.boardId,
          images: images.length > 0 ? images : undefined
        };
        
        await updatePostService(postId.value, updateData);
        ElMessage.success('帖子更新成功');
      } else {
        // 创建帖子
        const createData: CreatePostParams = {
          userId: userInfoStore.userinfo.userId.toString(),
          boardId: formData.boardId!,
          title: formData.title,
          content: formData.content,
          images: images.length > 0 ? images : undefined
        };
        
        await createPostService(createData);
        ElMessage.success('帖子发布成功');
      }
      
      // 跳转到博客列表或详情页
      setTimeout(() => {
        router.push('/blogDetail/' + (isEdit.value ? postId.value : ''));
      }, 1000);
      
    } catch (error: any) {
      console.error(`${isEdit.value ? '更新' : '发布'}帖子失败:`, error);
      
      let errorMessage = `${isEdit.value ? '更新' : '发布'}帖子失败`;
      if (error.response?.data?.message) {
        errorMessage += `: ${error.response.data.message}`;
      }
      
      ElMessage.error(errorMessage);
    } finally {
      loading.value = false;
    }
  };
  
  // 离开页面确认
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (formData.title || formData.content) {
      e.preventDefault();
      e.returnValue = '您有未保存的内容，确定要离开吗？';
    }
  };
  
  // 生命周期
  onMounted(async () => {
    // 添加离开页面确认
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // 加载板块列表
    await fetchBoardList();
    
    // 如果是编辑模式，加载帖子详情
    if (isEdit.value) {
      await fetchPostDetail();
    }
  });
  
  // 清理
  import { onUnmounted } from 'vue';
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  </script>
  
  <style scoped lang="scss">
  .edit-post-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .back-nav {
    margin-bottom: 20px;
  }
  
  .form-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .form-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  .board-option {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .board-name {
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .board-desc {
    font-size: 12px;
    color: #999;
  }
  
  .upload-tip {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
  
  .form-actions {
    margin-top: 30px;
    text-align: center;
    
    :deep(.el-form-item__content) {
      justify-content: center;
    }
  }
  
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
  
  @media (max-width: 768px) {
    .edit-post-container {
      padding: 16px;
    }
    
    .form-card {
      margin: 0 -16px;
      border-radius: 0;
      box-shadow: none;
      border: none;
    }
  }
  </style>