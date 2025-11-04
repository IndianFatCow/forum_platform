import './assets/main.scss'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router/index'
// 引入aceEditor编辑器
import ace from 'ace-builds'
import '@icon-park/vue-next/styles/index.css'; // 引入字节跳动图标库
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// v-md-editor Markdown组件
// @ts-ignore
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
// @ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import '@kangc/v-md-editor/lib/theme/style/github.css'
// highlightjs 核心代码
import hljs from 'highlight.js'

VMdEditor.use(githubTheme,{
    Hljs:hljs
})


import App from './App.vue'

const app = createApp(App)
const pinia=createPinia()
const persist=createPersistedState()
pinia.use(persist)
app.use(ElementPlus)
app.use(pinia)//管理全局状态
app.use(router)//管理路由
// app.use(ace)//ace编辑器
app.use(VMdEditor)
app.mount('#app')
