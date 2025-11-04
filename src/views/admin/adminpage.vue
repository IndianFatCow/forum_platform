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
    Menu
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

//初始化获取用户信息
import {userInfoService} from '../../api/user.js'
import { useAuthStore } from '@/store/store.js';
import { useUserInfoStore } from '@/stores/userInfo';
const authStore = useAuthStore();
const UserInfoStore = useUserInfoStore();
const getUserInfo = async ()=>{
    let result = await userInfoService();
    // console.log("前台",result);
    UserInfoStore.setUserInfo(result.data)//设置用户信息
    // console.log(authStore.userInfo.username);
}
getUserInfo();

//头像条目点击后的处理
import { useRouter } from 'vue-router'
const router = useRouter();

import miniCenter from '../mainview/userCenter/miniCenter.vue';
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index="/admin/question/manage">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>题目管理</span>
                </el-menu-item>
                <el-menu-item index="/admin/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item >
                <el-menu-item index="/admin/article/category">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/admin/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index="/admin/user/repassword">
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
                <div><span class="el-header__title">Algohub：</span><strong>{{authStore.user.nickname}}</strong></div>
                <miniCenter />
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
            height: 120px;
            background: url('@/assets/login_title.png') no-repeat center / 120px auto;
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
</style>@/store/store.js