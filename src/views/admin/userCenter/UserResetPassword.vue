<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { userResetPasswordService } from '@/api/user'
import { useUserInfoStore } from '@/stores/userInfo'

const ruleFormRef = ref(null) // 修正表单引用
const editPasswordForm = ref({
    oldpassword: '',
    newpassword: '',
    confirm: ''
})

// 确保两次输入的密码一致
const checkPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error("请输入确认密码"))
    } else if (value !== editPasswordForm.value.newpassword) {
        callback(new Error("请确保两次密码相同"))
    } else {
        callback()
    }
}

// 表单校验规则
const rules = {
    oldpassword: [
        { required: true, message: "旧密码不能为空", trigger: 'blur' },
        { min: 5, max: 16, message: "请输入5-16位字符", trigger: 'blur' }
    ],
    newpassword: [
        { required: true, message: "新密码不能为空", trigger: 'blur' },
        { min: 5, max: 16, message: "请输入5-16位字符", trigger: 'blur' }
    ],
    confirm: [
        { validator: checkPassword, trigger: 'blur' }
    ]
}

// 提交修改密码
const submitForm = async () => {
    if (!ruleFormRef.value) return
    const userInfoStore = useUserInfoStore()
    try {
        await ruleFormRef.value.validate()
        const result = await userResetPasswordService(userInfoStore.userinfo.username,editPasswordForm.value)
        ElMessage.success(result.msg ? result.msg : "修改成功")
    } catch (error) {
        console.log("表单验证失败", error)
    }
}

// 重置表单
const resetForm = () => {
    ruleFormRef.value?.resetFields()
}
</script>

<template>
    <el-form ref="ruleFormRef" :model="editPasswordForm" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldpassword">
            <el-input v-model="editPasswordForm.oldpassword" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
            <el-input v-model="editPasswordForm.newpassword" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
            <el-input v-model="editPasswordForm.confirm" show-password />
        </el-form-item>
    </el-form>

    <div class="dialog-footer">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
</template>
