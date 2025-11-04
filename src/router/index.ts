//导入vue-router
import { createRouter, createWebHistory } from 'vue-router'
// '@/views/admin/contentAdmin/show.vue'

//导入组件
import LoginVue from '@/views/Login.vue'

//admin页面的子页面
import admin from '@/views/admin/adminpage.vue'
import ArticleManagevue from '@/views/admin/contentAdmin/show.vue'//文章管理
import userManage from '@/views/admin/contentAdmin/show.vue'//用户管理

//uesr页面和子页面
import showVue from '@/views/mainview/compoment/show.vue'//项目展示
import userpage from '@/views/mainview/homepage.vue'

import profile from '@/views/mainview/userProfile/profile.vue'//个人中心
import qa from '@/views/admin/contentAdmin/show.vue'
import visualAlgo from '@/views/admin/contentAdmin/show.vue'

//通用页面

// import NotFound from '@/views/NotFound.vue'//404页面
//用户中心页面
import userCenter from '@/views/mainview/userCenter/mainpage.vue'
import userAvatarvue from '@/views/admin/userCenter/UserAvatar.vue'
import userInfovue from '@/views/admin/userCenter/UserInfo.vue'
import userResetpasswordvue from '@/views/admin/userCenter/UserResetPassword.vue'//修改密码
//社区页面
import home from '@/views/mainview/Blog/home.vue'//社区首页
import blogDetail from '@/views/mainview/Blog/components/BlogDetial.vue'//社区详情


import setupAllRouterGuard from './listen'//监听路由
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
//定义路由关系
const routes = [
    { path: '/login', component: LoginVue },    
    { path: '/admin', component: admin,
        redirect:'/admin/user/info',//重定向
        children://配置子路由
        [  
            { path: '/admin/article/manage', component: ArticleManagevue },
            { path: '/admin/user/manage', component: userManage },
            { path: '/admin/user/avatar', component: userAvatarvue },
            { path: '/admin/user/info', component: userInfovue },
            {path: '/admin/user/repassword', component: userResetpasswordvue }
        ]

    },
    { path: '/', component: userpage,
        children://配置子路由
        [       
                {path: '/show', component: showVue},
                {path: '/home', component: home},
                { path: '/blogDetail/:id', component: blogDetail },
                // {path: '/question-bank', component: questionBank ,
                // // 将查询参数 q 作为 props.searchQuery 传入
                // // @ts-ignore
                // props: route => ({ searchQuery: route.query.q || '' })
                // },
                // {path: '/questionDetail/:id', component: questionDetail},
                // {path: '/profile', component: profile},
                {path: '/profile/:username', component: profile},
                {path: '/qa', component: qa},
                {path: '/visual-algo', component: visualAlgo}      
        ]},
    { path: '/usercenter', component: userCenter,
        children://配置子路由
        [
            {path: '/userCenter/avatar', component: userAvatarvue},
            {path: '/userCenter/info', component: userInfovue},
            {path: '/userCenter/repassword', component: userResetpasswordvue}
        ]
    },
    
    // { path: '/:catchAll(.*)', component: NotFound ,meta:{ hidden: true }},//404页面
]

//创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes: routes
});
setupAllRouterGuard(router)
export default router