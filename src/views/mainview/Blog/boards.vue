<template>
    <div class="boards-container">
      <!-- 页面头部 -->
      <div class="boards-header">
        <h1 class="title">讨论板块</h1>
        <el-button 
          v-if="isAdmin" 
          type="primary" 
          :icon="Plus" 
          @click="showCreateDialog = true"
        >
          创建板块
        </el-button>
      </div>
  
      <!-- 板块列表 -->
      <div class="boards-grid" v-loading="loading">
        <el-empty 
          v-if="!loading && boardList.length === 0" 
          description="暂无板块"
        />
        
        <div 
          v-for="board in boardList" 
          :key="board.id" 
          class="board-card"
          @click="navigateToBoard(board.id)"
        >
          <div class="board-card-header">
            <div class="board-icon">
              <el-icon :size="32"><ChatDotSquare /></el-icon>
            </div>
            <div class="board-actions" v-if="isAdmin" @click.stop>
              <el-dropdown trigger="click">
                <el-button :icon="MoreFilled" circle size="small" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleEdit(board)">
                      <el-icon><Edit /></el-icon>
                      编辑
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleDelete(board.id)">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
  
          <div class="board-content">
            <h3 class="board-name">{{ board.name }}</h3>
            <p class="board-description">
              {{ board.description || '暂无描述' }}
            </p>
          </div>
  
          <div class="board-footer">
            <div class="board-stats">
              <span class="stat-item">
                <el-icon><Document /></el-icon>
                {{ board.postCount || 0 }} 帖子
              </span>
              <span class="stat-item">
                <el-icon><User /></el-icon>
                {{ board.memberCount || 0 }} 成员
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 创建/编辑板块对话框 -->
      <el-dialog
        v-model="showCreateDialog"
        :title="isEditing ? '编辑板块' : '创建板块'"
        width="500px"
        @close="resetForm"
      >
        <el-form 
          ref="boardFormRef" 
          :model="boardForm" 
          :rules="formRules"
          label-width="80px"
        >
          <el-form-item label="板块名称" prop="name">
            <el-input 
              v-model="boardForm.name" 
              placeholder="请输入板块名称"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
  
          <el-form-item label="板块描述" prop="description">
            <el-input
              v-model="boardForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入板块描述（可选）"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <el-button @click="showCreateDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
          >
            {{ isEditing ? '保存' : '创建' }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
  import { 
    Plus, 
    ChatDotSquare, 
    MoreFilled, 
    Edit, 
    Delete,
    Document,
    User
  } from '@element-plus/icons-vue';
  import { 
    getBoardListService, 
    createBoardService, 
    deleteBoardService,
    getBoardByIdService
  } from '@/api/boards';
  
  // Router
  const router = useRouter();
  
  // 数据
  const loading = ref(false);
  const submitting = ref(false);
  const showCreateDialog = ref(false);
  const isEditing = ref(false);
  const boardList = ref<any[]>([]);
  const isAdmin = ref(true); // 根据实际权限设置
  
  // 表单相关
  const boardFormRef = ref<FormInstance>();
  const boardForm = reactive({
    id: '',
    name: '',
    description: ''
  });
  
  const formRules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入板块名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ]
  });
  
  // 加载板块列表
  const loadBoards = async () => {
    loading.value = true;
    try {
      const response = await getBoardListService();
      boardList.value = response.data || [];
    } catch (error: any) {
      ElMessage.error(error.message || '加载板块列表失败');
    } finally {
      loading.value = false;
    }
  };
  
  // 导航到板块详情
  const navigateToBoard = (boardId: string) => {
    router.push(`/home/${boardId}`);
  };
  
  // 编辑板块
  const handleEdit = async (board: any) => {
    isEditing.value = true;
    boardForm.id = board.id;
    boardForm.name = board.name;
    boardForm.description = board.description || '';
    showCreateDialog.value = true;
  };
  
  // 删除板块
  const handleDelete = (boardId: string) => {
    ElMessageBox.confirm(
      '删除板块后，该板块下的所有内容都将被删除，此操作不可恢复。确定要删除吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      try {
        await deleteBoardService(boardId);
        ElMessage.success('删除成功');
        loadBoards(); // 重新加载列表
      } catch (error: any) {
        ElMessage.error(error.message || '删除失败');
      }
    }).catch(() => {
      // 用户取消删除
    });
  };
  
  // 提交表单
  const handleSubmit = async () => {
    if (!boardFormRef.value) return;
    
    await boardFormRef.value.validate(async (valid) => {
      if (!valid) return;
      
      submitting.value = true;
      try {
        if (isEditing.value) {
          // 如果有更新接口，在这里调用
          ElMessage.warning('编辑功能需要后端提供更新接口');
        } else {
          await createBoardService({
            name: boardForm.name,
            description: boardForm.description
          });
          ElMessage.success('创建成功');
        }
        
        showCreateDialog.value = false;
        loadBoards(); // 重新加载列表
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
    boardForm.id = '';
    boardForm.name = '';
    boardForm.description = '';
    boardFormRef.value?.clearValidate();
  };
  
  // 生命周期
  onMounted(() => {
    loadBoards();
  });
  </script>
  
  <style scoped lang="scss">
  .boards-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .boards-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  
    .title {
      font-size: 28px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
  }
  
  .boards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    min-height: 300px;
  }
  
  .board-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: #409eff;
    }
  }
  
  .board-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  
    .board-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
  
    .board-actions {
      :deep(.el-button) {
        background: transparent;
        border: none;
        
        &:hover {
          background: #f3f4f6;
        }
      }
    }
  }
  
  .board-content {
    margin-bottom: 16px;
  
    .board-name {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }
  
    .board-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 40px;
    }
  }
  
  .board-footer {
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
  
    .board-stats {
      display: flex;
      gap: 16px;
  
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
  
  // 暗色模式适配（可选）
  @media (prefers-color-scheme: dark) {
    .boards-container {
      .title {
        color: #f9fafb;
      }
    }
  
    .board-card {
      background: #1f2937;
      
      .board-name {
        color: #f9fafb;
      }
  
      .board-description {
        color: #9ca3af;
      }
  
      .stat-item {
        color: #9ca3af;
      }
    }
  }
  
  // 响应式设计
  @media (max-width: 768px) {
    .boards-container {
      padding: 16px;
    }
  
    .boards-header {
      .title {
        font-size: 24px;
      }
    }
  
    .boards-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  </style>