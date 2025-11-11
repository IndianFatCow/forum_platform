<script setup>
import { User, Lock,Message } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)//true默认显示注册
const showForgetPwdDialog = ref(false)//忘记密码对话框


//忘记密码
const forgetData = ref({
  username: '',
  email: '',
  password: ''
})

const forgetFormRef = ref(null)

const forgetRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 16, message: '请输入6-16位密码', trigger: 'blur' }
  ]
}
import { userInfoService, userResetPasswordService,userInfoUpdateService } from '@/api/user'

const submitForgetPwd = async () => {
  const valid = await forgetFormRef.value.validate()
  if (!valid) return
  const result = await userResetPasswordService(forgetData.value.username,forgetData.value.password)
  ElMessage.success(result.msg || '密码重置成功')
  showForgetPwdDialog.value = false
}


// 表单引用
const formref = ref(null)
//用于注册的数据模型
const registerData = ref({
    username: '123456789',
    password: '12345678',
    rePassword: '12345678',
    email: 'test@email.com',
    role: 'user'
})
const checkPassword =(rule,value,callback) =>{
    if(value=='')callback("请输入确认密码")
    else if(value !=registerData.value.password)callback("请确保两次密码相同")
    else callback()
}
//注册表单校验模型
const rules = {
    username:[
        {
            required: true,message: "用户名不能为空",trigger:'blur'         
        },
        {
            max:16,min:5,message: "请输入8-16位字符",trigger:'blur'   
        }
    ],
    password:[{
            required: true,message: "密码不能为空",trigger:'blur'         
        },
        {
            max:16,min:5,message: "请输入8-16位字符",trigger:'blur'
        }],
    email:[
        {
            required: true,message: "邮箱不能为空",trigger:'blur'         
        },
        {
            type: 'email',message: "请输入正确的邮箱格式",trigger:'blur'
        }
    ],
    rePassword:[
        {validator:checkPassword ,trigger:'blur'}
    ]
}
//调用后台接口,完成注册
import { userRegisterService, userLoginService } from '@/api/user'
// import { el } from 'element-plus/es/locales.mjs'
//验证注册是否成功
const register = async () =>{
    // 触发校验
    const valid = await formref.value.validate()
    if (!valid) {
        return
    }
    console.log(registerData.value)
    let result = await userRegisterService(registerData.value);
    ElMessage.success(result.msg?result.msg:"注册成功")
    isRegister.value = false
}
import { useRouter } from 'vue-router'
const router = useRouter()

import { useAuthStore } from '@/store/store'
import { useTokenStore } from '@/store/token'//token存储
import { useUserInfoStore } from '@/stores/userInfo'//用户信息存储
const AuthStore = useAuthStore()
const token = useTokenStore()
const UserInfoStore = useUserInfoStore()

//Login函数
const login = async () =>{
    // 触发校验
    const valid = await formref.value.validate()
    if (!valid) {
        return
    }

    AuthStore.$state.user = registerData.value;
    
    // let restoken = await userLoginService(AuthStore.getAuthHeader(),registerData.value.username,registerData.value.password);
    // console.log(AuthStore.$state)
    // console.log(restoken.data)
    //由于登录请求用到是新构造的request，返回对象中data.data是token
    // token.setToken(restoken.data.data)//根据后台设置token

    // let res = await userInfoService(registerData.value.username)//获取用户信息;
    let res = await userLoginService(registerData.value.username,registerData.value.password);//获取用户信息;
    console.log(res)
    UserInfoStore.setUserInfo(res)//设置用户信息
    console.log('userinfo',UserInfoStore.userinfo)
    UserInfoStore.setState({isLogin: true, isAdmin: (res.role == 'ADMIN' )?true:false})//设置登录状态
    token.setToken(res.token)//根据后台设置token
    console.log("登录后token:",token.getToken())
    ElMessage.success("登录成功")


    //跳转到首页
    if(AuthStore.isAdmin === true){//管理员登录
        router.push('/admin')
    }
    router.push('/')//普通用户登录
}
//清空表单
const clearForm = () => {
    registerData.value = {
    username: '123456789',
    password: '12345678',
    rePassword: '12345678',
    email: 'test@email.com',
    role: 'user'
    }
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="formref" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username" name="account">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username" clearable></el-input>
                </el-form-item>
                <el-form-item prop="email" name="email">
                    <el-input :prefix-icon="Message" placeholder="请输入邮箱" v-model="registerData.email" clearable></el-input>
                </el-form-item>
                <el-form-item prop="password" name="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password" show-password></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword" show-password></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" @click="register()" auto-insert-space>
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearForm()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="formref" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password" show-password></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false" @click="showForgetPwdDialog = true">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login()">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click.prevent="isRegister = true;clearForm()">
                        点击注册 →
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 忘记密码对话框 -->
            <el-dialog v-model="showForgetPwdDialog" title="重置密码" width="400px">
                <el-form :model="forgetData" label-width="80px" :rules="forgetRules" ref="forgetFormRef">
                    <el-form-item label="用户名" prop="username">
                    <el-input v-model="forgetData.username" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="forgetData.email" />
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                    <el-input v-model="forgetData.password" type="password" show-password />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="showForgetPwdDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitForgetPwd">确认重置</el-button>
                </template>
            </el-dialog>

        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
            background: url('https://tse2-mm.cn.bing.net/th/id/OIP-C.D5QLVBrOMQqUChlnojzeoAHaD4?w=345&h=181&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>@/store/store.js