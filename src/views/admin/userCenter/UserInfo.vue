<script setup>
import { reactive } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo'
import { userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'

const userInfoStore = useUserInfoStore()
// 拷贝 pinia 中的 userinfo 到 local reactive 对象，以便双向绑定表单
const userInfo = reactive({
  ...userInfoStore.userinfo,
  // 新增字段默认值
  createdAt: userInfoStore.userinfo.createdAt || '',
  phone: userInfoStore.userinfo.phone || '',
  bio: userInfoStore.userinfo.bio || '',   // 个人简介：可以写一段较长的文字
  company: userInfoStore.userinfo.company || '',
  location: userInfoStore.userinfo.location || '',
  profile_url: userInfoStore.userinfo.profile_url || ''
})

// 校验规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '昵称必须是2-10位的非空字符串', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^\d{6,15}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  bio: [
    { required: false, message: '请输入个人简介', trigger: 'blur' },
    { max: 200, message: '个人简介不能超过200字', trigger: 'blur' }
  ],
  profile_url: [
    { type: 'url', message: '个人主页 URL 格式不正确', trigger: 'blur' }
  ]
}

// 修改个人信息
const updateUserInfo = async () => {
  try {
    const result = await userInfoUpdateService(userInfo.username, userInfo)
    ElMessage.success(result.data?.message || '修改成功')
    // 将修改后的信息同步回 pinia
    userInfoStore.setUserInfo(userInfo)
  } catch (err) {
    console.error('更新失败', err)
    ElMessage.error('修改失败，请稍后重试')
  }
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header"><span>基本资料</span></div>
    </template>

    <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" disabled />
          </el-form-item>

          <el-form-item label="创建时间">
            <el-input v-model="userInfo.createdAt" disabled />
          </el-form-item>

          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname" />
          </el-form-item>

          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email" />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" />
          </el-form-item>

          <el-form-item label="个人简介" prop="bio">
            <el-input type="textarea" v-model="userInfo.bio" placeholder="一个长篇的个人简介" rows="4" />
          </el-form-item>

          <el-form-item label="公司">
            <el-input v-model="userInfo.company" />
          </el-form-item>

          <el-form-item label="所在城市">
            <el-input v-model="userInfo.location" />
          </el-form-item>

          <el-form-item label="个人主页" prop="profile_url">
            <el-input v-model="userInfo.profile_url" placeholder="https://example.com" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
