<script setup>
import { ref, onMounted } from 'vue';
import { Edit, Delete, Search } from '@element-plus/icons-vue';
import { descriptionProps, ElMessage, ElMessageBox } from 'element-plus';
import { getQuestionList, addQuestion, updateQuestion, deleteQuestion } from '@/api/question';

const questions = ref([]);
const dialogVisible = ref(false);//弹窗是否显示
const title = ref('');
const loading = ref(false);
const searchContent = ref('');

// 题目数据模型
const questionModel = ref({
    id: null,
    questionName: '',
    passRate: '',
    difficulty: '',
    description: '',
    inputStyle: '',
    outputStyle: '',
    inputSample: '',
    outputSample: '',
    dataRange: '',
    timeLimit: '',
    memoryLimit: '',
});

// 表单校验
const rules = {
    questionName: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
    passRate: [{ required: true, message: '请输入通过率', trigger: 'blur' }],
    difficulty: [{ required: true, message: '请输入难度', trigger: 'blur' }]
};

// 获取题目列表
const fetchQuestions = async () => {
    loading.value = true;
    try {
        const result = await getQuestionList();
        questions.value = result.data;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchQuestions);

// 搜索题目
const searchQuestions = async () => {
    if (!searchContent.value) {
        ElMessage.error('请输入搜索内容');
        return;
    }
    loading.value = true;
    try {
        const result = await getQuestionList(searchContent.value);
        questions.value = result.data;
    } finally {
        loading.value = false;
    }
};

// 显示编辑/新增弹窗
const showDialog = (question = null) => {
    dialogVisible.value = true;
    title.value = question ? '编辑题目' : '添加题目';
    questionModel.value = question ? { ...question } : { id: null, questionName: '', passRate: '', difficulty: '' };
};

// 添加或编辑题目
const saveQuestion = async () => {
    try {
        if (questionModel.value.id) {
            await updateQuestion(questionModel.value);
            ElMessage.success('修改成功');
        } else {
            await addQuestion(questionModel.value);
            ElMessage.success('添加成功');
        }
        dialogVisible.value = false;
        fetchQuestions();
    } catch (error) {
        ElMessage.error('操作失败');
    }
};

// 删除题目
const removeQuestion = (question) => {
    ElMessageBox.confirm('你确认要删除该题目吗?', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        await deleteQuestion(question.id);
        ElMessage.success('删除成功');
        fetchQuestions();
    }).catch(() => {
        ElMessage.info('用户取消了删除');
    });
};
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>题目管理</span>
                <div class="extra">
                    <el-input v-model="searchContent" placeholder="搜索题目" @keydown.enter="searchQuestions">
                        <template #prepend>
                            <el-button :icon="Search" @click="searchQuestions" />
                        </template>
                    </el-input>
                    <el-button type="primary" @click="showDialog()">添加题目</el-button>
                </div>
            </div>
        </template>

        <el-table :data="questions" style="width: 100%" v-loading="loading">
            <el-table-column label="序号" width="100" type="index" />
            <el-table-column label="题目名称" prop="questionName" />
            <el-table-column label="通过率" prop="passRate" />
            <el-table-column label="难度" prop="difficulty" />
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)" />
                    <el-button :icon="Delete" circle plain type="danger" @click="removeQuestion(row)" />
                </template>
            </el-table-column>
        </el-table>

        <!-- 题目编辑/新增弹窗 -->
        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="questionModel" :rules="rules" label-width="100px">
                <el-form-item label="题目名称" prop="questionName">
                    <el-input v-model="questionModel.questionName" />
                </el-form-item>
                <el-form-item label="通过率" prop="passRate">
                    <el-input v-model="questionModel.passRate" />
                </el-form-item>
                <el-form-item label="难度" prop="difficulty">
                    <el-input v-model="questionModel.difficulty" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveQuestion">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
