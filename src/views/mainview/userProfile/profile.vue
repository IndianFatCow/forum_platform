<template>
    <el-container>
      <el-aside width="15%">
        <!-- <noticeBoard></noticeBoard> -->
      <!-- <template>
        <el-affix :offset="120">
          <el-button type="primary">Offset top 120px</el-button>
        </el-affix>
      </template> -->
  
      </el-aside>
      
        <el-main >
          <el-card >
                    <!-- 单一滚动容器，包含 Header, Tabs, 列表 -->
        <div
          ref="scrollContainer"class="scrollable-content"
          style="height: 100vh; overflow: auto;"
          v-loading="blogListLoading"
          v-infinite-scroll="loadMore"
          :infinite-scroll-container="scrollContainer"
          :infinite-scroll-disabled="noMore"
          :infinite-scroll-distance="100"
        >
          <Header :articleCount="articleCount" :user="user || {} as userInfo" :isUser="isUser" :followingCount="followingCount" :followers-count="followersCount"></Header>
          <!-- 顶部导航栏 -->
          <el-tabs v-model="activeTab" class="tab-container" @tab-change="handleTabChange">
            <el-tab-pane label="动态" name="dynamic"> </el-tab-pane>
            <el-tab-pane label="点赞动态" name="liked" > </el-tab-pane>
            <el-tab-pane label="关注列表" name="following"> </el-tab-pane>
            <el-tab-pane label="粉丝列表" name="followers"> </el-tab-pane>
          </el-tabs>

    <!-- 博客列表 -->
    <div v-loading="blogListLoading">
      <!-- 搜索框 -->
      <!-- <el-input
        v-model="searchContent"
        placeholder="搜索内容回车确认"
        class="input-with-select"
        size="large"
        @keydown.enter="searchBlog"
        style="margin: 10px 0 10px 0;"
      >
        <template #prepend>
          <el-button :icon="Search" />
        </template>
      </el-input> -->

      <!-- 动态内容区域 -->
      <!-- <div v-if="activeTab === 'dynamic'"
      v-loading="blogListLoading"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="noMore"
      style="height: 70vh; overflow: auto;"
      :infinite-scroll-container="scrollContainer"
      :infinite-scroll-distance="100"
      infinite-scroll-delay="100"
      > -->
      <div v-if="activeTab === 'dynamic'">
        <blogCard v-for="item in blogList" :post="item" :key="item.instanceID" />
        <el-divider v-if="noMore">没有更多内容了</el-divider>

      </div>

      <!-- 点赞动态内容区域 -->
      <div v-if="activeTab === 'liked'">
        <blogCard v-for="item in likedPosts" :post="item" :key="item.instanceID" />
        <el-divider v-if="noMore">没有更多内容了</el-divider>
      </div>

      <!-- 关注列表内容区域 -->
      <div v-if="activeTab === 'following'">
        <userList :users="followList"  />
        <el-divider></el-divider>
      </div>

      <!-- 粉丝列表内容区域 -->
      <div v-if="activeTab === 'followers'">

        <el-divider></el-divider>
      </div>
    </div>

          <!-- 返回顶部按钮 -->
          <el-backtop
            target=".scrollable-content"
            :bottom="100"
            :visibility-height="300"
            :right="50"
          >
            <div
              style="
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0,0,0,.12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
                border-radius: 50%;
              "
            >
              ↑
            </div>
    </el-backtop>
  </div>
    </el-card>
        </el-main>

       
      <el-aside width="15%" ></el-aside>
    </el-container>
  </template>
  
<script lang="ts" setup>
  import { ref,onMounted } from 'vue'
  import { ElAffix,ElMessage} from 'element-plus'

  // import BlogHeader from './components/BlogHeader.vue'
  import { getPostByIdService, queryPostsService } from '@/api/post'
  import { getUserLikesService } from '@/api/like'
  import { userInfoUpdateService, userInfoService,chageAvatarUrl } from '@/api/user';
  import { getSubscribeList} from '@/api/subscribe'
  // import { queryCommentsService } from '@/api/comment'
  // import { useUserInfoStore } from '@/stores/userInfo'
  import { useRoute } from 'vue-router';
  import { Search } from '@element-plus/icons-vue'
  import blogCard from '../Blog/components/blogCard.vue'
  import Header from './profileHeader.vue'
  import { useUserInfoStore } from '@/stores/userInfo'
  import type { userInfo } from '@/lib/types';
  // import { usePostStore } from '@/stores/postStore'
import userList from './userList.vue'
  interface UserLikeResponse {
  totalItems: number;
  items: Array<{
    ID: number;
    instanceID: string;
    createdAt: string;
    updatedAt: string;
    DeletedAt: null | string;
    username: string;
    item_type: string;
    item_id: number;
  }>;
}
  const route = useRoute()
  const userStore = useUserInfoStore()
  const isUser = ref(false)//是不是个人主页
  const username = route.params.username //主页主人
  const user = ref<userInfo>()
//初始化确认是否是个人主页
onMounted(async () => { 
  handleTabChange(activeTab.value)
  if (username === userStore.userinfo.username) {
    isUser.value = true
    user.value = userStore.userinfo
    const ip_address = ref({
    ip_address: ''
  })
  fetch('http://ip-api.com/json/')
  .then(response => response.json())
  .then(data => {
    // console.log('IP 属地信息:', data);
    ip_address.value.ip_address = ( data.country === 'China') ? data.regionName : data.country
    // console.log(ip_address.value)
    const res = userInfoUpdateService(useUserInfoStore().userinfo.username,ip_address.value)
    // console.log(res)
    useUserInfoStore().setIP(ip_address.value.ip_address)
    // console.log(useUserInfoStore().userinfo)
  })
  .catch(error => console.error('获取 IP 属地失败:', error));
  } else {
    try {
      // @ts-ignore
      const res = await userInfoService(username)
      user.value = res.data
      // @ts-ignore
      user.value.avatar = chageAvatarUrl(user.value.avatar)
      console.log('他人信息:', res.data)
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }
})
  const scrollContainer = ref(null)//滚动容器
  const { params } = useRoute()
  const searchContent = ref('')
  const blogListLoading = ref(false)

  const articleCount = ref(0) //用户文章数量
  const followingCount = ref(0) //关注人数
  const followersCount = ref(0) //粉丝人数

  const blogList = ref<any>([]) //  博客列表
  const likedPosts = ref<any>([]) //点赞的文章列表

  const activeTab = ref('dynamic') //当前激活的选项卡
  
  const pageSize = ref(5) //每页显示的数量
const userPage = ref(1) //当前页码
const totalSize = ref(0) //总数据量
const noMore = ref(false) //是否还有更多数据

const loadMore = async () => {
  console.log('加载更多数据...')
  if (blogListLoading.value || noMore.value) return
  blogListLoading.value = true

  const offset = (userPage.value - 1) * pageSize.value
  if (activeTab.value === 'dynamic') {
    
    const res = await queryPostsService(
      pageSize.value,
      offset,
      // @ts-ignore
      username 
    )
    const items = res.data.items || []
    blogList.value.push(...items)
    totalSize.value = res.data.totalItems
    articleCount.value = totalSize.value
    if (items.length < pageSize.value) {
      noMore.value = true
    }
  } else if (activeTab.value === 'liked') {
    // 获取点赞列表
    ElMessage({
      message: '获取点赞列表',
      type: 'success',
    })
    // @ts-ignore
    const res = (await getUserLikesService(username,pageSize.value,offset))as { data: UserLikeResponse }
    // console.log('获取点赞列表:', res.data)
    const likeItems = res.data.items || []
    totalSize.value = res.data.totalItems
    // console.log(likeItems)
    // 按 instanceID 顺序逐个请求文章详情
    for (const like of likeItems) {
      // console.log('like:', like.item_id)
      const postRes = await getPostByIdService(like.item_id.toString())
      if (postRes.data) {
        likedPosts.value.push(postRes.data)
      }
    }
    if (likeItems.length < pageSize.value) {
      noMore.value = true
    }
  }

  // 更新分页状态
  const currentCount =
    activeTab.value === 'dynamic' ? blogList.value.length : likedPosts.value.length

  if (currentCount >= totalSize.value) {
    noMore.value = true
  } else {
    userPage.value++
  }

  blogListLoading.value = false
}
const followList = ref([])
const getFollowing = async () => {
  // @ts-ignore
    const res = await getSubscribeList(username,'user')
    followList.value = res.data.items
    followingCount.value = res.data.totalItems
    console.log('关注列表:', res.data)
    console.log(followList.value)
}
getFollowing()

  const searchBlog = async () => {//搜索博客
    //实现模糊搜索，搜索标题和内容
      blogListLoading.value = true
      const res = await queryPostsService(10, 0,userStore.userinfo.username, searchContent.value, undefined);
      // postStore.setPosts(res.data.data);
      // console.log(postStore.posts);
      blogListLoading.value = false
      blogList.value = res.data.items
  
  
  }

  const handleTabChange = (tab: string) => {
    activeTab.value = tab
    console.log('当前选项卡:', tab)
    if(tab === 'dynamic'){
      // blogList.value = []
      loadMore()
      userPage.value = 1
      totalSize.value = 0
      noMore.value = false
    }
    else if (tab === 'liked') {
      ElMessage({
        message: '获取点赞',
        type: 'success',
      })
      userPage.value = 1
      totalSize.value = 0
      noMore.value = false
      // likedPosts.value = []
      loadMore()
    } else if (tab === 'following') {
      getFollowing()
    } else if (tab === 'followers') {
      // getFollowers()
    }
  }
  

</script>

<style>
  /* .scrollable-content {
    overflow-y: auto;
    padding: 10px;
  } */
  
  /* 额外可以加点细节，让滚动条更好看 */
  /* .scrollable-content::-webkit-scrollbar {
    width: 6px;
  } */
  /* .scrollable-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  } */
  .demo-tabs>.el-tabs__content {
    /* padding: 32px; */
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  </style>
    