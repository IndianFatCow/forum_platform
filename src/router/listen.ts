// import { useAuthStore } from '@/store/store';
import { useUserInfoStore } from '@/stores/userInfo';
import type { Router, RouteLocationNormalized } from 'vue-router';
import { ElNotification } from 'element-plus';


// 白名单 (无需登录可访问的页面)
const whiteList = [
    "/home",
    "/question-bank",
    "/profile",
    "/qa",
    "/visual-algo",
    "/login"
];

// 管理员专属页面
const adminList = [
    "/admin",
    "/admin/question/category",
    "/admin/article/manage",
    "/admin/user/manage",
    "/admin/user/avatar",
    "/admin/user/info",
    "/admin/user/repassword"
];

// 登录路由拦截
export default function setupAllRouterGuard(router: Router) {
    router.beforeEach(async (to: RouteLocationNormalized, from, next) => {
        const userInfoStore = useUserInfoStore();
        const routePath = to.path;  // 使用 `to.path` 而不是 `to.name`
        // console.log("routePath", routePath)
        if(routePath === '/') {
            next({ path: '/show' });
            return;
        }
        // 🟢 如果是白名单页面，直接放行
        if (whiteList.includes(routePath)) {
            next();
            return;
        }

        // 🔒 如果未登录，跳转 `/login`
        if (!userInfoStore.isLogin) {
            ElNotification({
                title: "未登录",
                message: "请先登录后再访问",
                type: 'error',
            });
            next({ path: '/login' });
            return;
        }

        // 🛑 如果是管理员页面，但不是管理员，阻止访问
        if (adminList.includes(routePath) && !userInfoStore.isAdmin) {
            ElNotification({
                title: "禁止访问",
                message: "无管理员权限，无法访问该页面",
                type: 'error',
            });
            next({ path: '/problem' });
            return;
        }

        // ✅ 其余页面直接放行
        next();
    });
}
