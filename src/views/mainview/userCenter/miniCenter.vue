<!-- 下拉头像框 -->

<template>
    <el-dropdown placement="bottom-end" @command="handleCommand">
        <span class="el-dropdown__box">
            <el-avatar :src="userInfoStore.userinfo.avatar?userInfoStore.userinfo.avatar:avatar" />
            <el-icon>
                <CaretBottom />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                <el-dropdown-item command="repassword" :icon="EditPen">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup>
import { createApp, ref } from 'vue';
import { ElButton, ElInput, ElAvatar, ElDropdown, ElDropdownItem, ElDropdownMenu, ElContainer, ElHeader, ElMain, ElMenu, ElMenuItem, ElTabs, ElTabPane, ElCard } from 'element-plus';
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
import { useAuthStore } from '@/store/store';
import { useTokenStore } from '@/store/token';
import { userLogoutService } from '@/api/user';
import { useUserInfoStore } from '@/stores/userInfo';
//头像条目点击后的处理
import { useRouter } from 'vue-router'
const router = useRouter();
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore();
const authStore = useAuthStore();
// console.log(userInfoStore.userinfo.avatar)
// const init_avatar = async  () => {
//     let blob =await userAvatarService(userInfoStore.userinfo.username)//获取用户头像
//     // console.log(blob)

//     let img = URL.createObjectURL(blob)//将blob转换为url
//     userInfoStore.updateAvatarFromBlob(img)//设置用户头像
// }
// init_avatar()
// console.log(userInfoStore.userinfo.avatar)
userInfoStore.chageAvatarUrl()//设置用户头像
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
            // 缺少确认框
            console.log('退出登录')
            authStore.clearCredentials();
            userInfoStore.removeUserInfo();
            
            userLogoutService();
            tokenStore.removeToken();
            router.push('/login');
            break;
    }
}

</script>