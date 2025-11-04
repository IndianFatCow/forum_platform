<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    Back,
    Menu
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

//初始化获取用户信息
import {userInfoService} from '@/api/user.js'
import {useUserInfoStore} from '@/stores/userInfo'

const userInfo = useUserInfoStore()
const getUserInfo = async ()=>{
    console.log(userInfo.userinfo.username);
    let result = await userInfoService(userInfo.userinfo.username);
    console.log(result);
    userInfo.userinfo.value = result.data;
    // console.log(authStore.userInfo.username);
}
getUserInfo();
// userInfo.chageAvatarUrl()//设置用户头像
//头像条目点击后的处理
import { useRouter } from 'vue-router'
const router = useRouter();
const goBack = () => {
    router.push('/')
}
import miniCenter from './miniCenter.vue';
const handleCommand = (command) => {
    switch (command) {
        case 'info':
            router.push('/userCenter/info');
            break;
        case 'avatar':
            router.push('/userCenter/avatar');
            break;
        case 'repassword':
            router.push('/userCenter/repassword');
            break;
        case 'logout':
            //缺少确认框
            authStore.clearCredentials();
            router.push('/login');
            break;
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <!-- <div class="el-aside__logo"></div> -->
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index="/" @click="goBack">
                    <el-icon>
                        <Back />
                    </el-icon>
                    <span>返回主页</span>
                </el-menu-item>
                <el-menu-item index="/userCenter/articlemanage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item >
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/userCenter/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/userCenter/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/userCenter/repassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div><span class="el-header__title">Algohub：</span><strong>{{userInfo.nickname}}</strong></div>
                <miniCenter/>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>Algohub——你的一站式算法学习平台</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #272828;

        &__logo {
            height: 180px;
            // background: url('@/assets/algo_logo.webp') no-repeat center /200px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }
    .el-header__title {
        font-family: 'Segoe Script', sans-serif;
        color: #4050ff;
        font-size: 20px;
        font-weight: bold;
    }
    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>