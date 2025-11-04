<template>
  <el-container>
    <el-aside width="20%">
      
      <el-button @click="" type="primary" :icon="Plus" class="right-aligned-btn"  >发布文章</el-button>

      <el-button @click="refreshPage" :icon="Refresh" class="right-aligned-btn"  >刷新</el-button>
    </el-aside>
    <el-container style="min-height: 100vh;">
      <el-header style="max-height: 10px;" >
      </el-header>
      <el-main>

        <el-card shadow="always" style="height: 110%" >
        <div class="scrollable-content" style="height: 110vh; overflow: auto;"
          v-loading="blogListLoading"
          v-infinite-scroll="loadMore"
          :infinite-scroll-container="scrollContainer"
          :infinite-scroll-disabled="noMore"
          :infinite-scroll-distance="100"
          >
          <!-- <BlogHeader /> -->
          <!-- 搜索框 -->
          <el-input v-model="searchContent" placeholder="搜索内容回车确认" class="input-with-select" size="large"
            @keydown.enter="searchBlog" style="margin: 10px 0 10px 0;">
            <template #prepend>
              <el-button :icon="Search" />
            </template>
          </el-input>
          <!-- 博客列表 -->
          <div   >
            <blogCard v-for="item in blogList" :post="item" :key="item.ID" />
            <!-- <blogCard v-for="item in postStore.posts" :post="item" :key="item.instanceID" /> -->
            <!-- <el-divider></el-divider> -->
          </div>
          <el-divider>没有更多内容了</el-divider>
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

    </el-container>
    <el-aside width="20%"></el-aside>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext,ElAffix } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { Refresh } from '@icon-park/vue-next'
import blogCard from './components/blogCard.vue'
// import BlogHeader from './components/BlogHeader.vue'
 import { getPostByIdService, queryPostsService } from '@/api/post'
// import { queryCommentsService } from '@/api/comment'
// import { useUserInfoStore } from '@/stores/userInfo'
import { useRoute } from 'vue-router';


// import show from '../compoment/show.vue'
import { usePostStore } from '@/stores/postStore'
import { onMounted } from 'vue';
const postStore = usePostStore()

const scrollContainer = ref(null)//滚动容器
const { params } = useRoute()
const searchContent = ref('')
const blogListLoading = ref(false)
const activeName = ref('first')
const blogList = ref<any>([])

// const userStore = useUserInfoStore()
const pageSize = ref(5) //每页显示的数量
const userPage = ref(1) //当前页码
const totalSize = ref(0) //总数据量
const noMore = ref(false) //是否还有更多数据
const refreshPage = () => {
  window.location.reload();
};

const loadMore = async () => {
  console.log('加载更多数据...')
  if (blogListLoading.value || noMore.value) return
  blogListLoading.value = true

  const offset = (userPage.value - 1) * pageSize.value
    const res = await queryPostsService(
      pageSize.value,
      offset
    )
    const items = res.data.items || []
    blogList.value.push(...items)
    totalSize.value = res.data.totalItems
    if (items.length < pageSize.value) {
      noMore.value = true
    }
  if (blogList.value.length >= totalSize.value) {
    noMore.value = true
  } else {
    userPage.value++
  }

  blogListLoading.value = false
}
onMounted(() => {
  // console.log('mounted')
  // getBlogList()
  loadMore()
})
const getBlogList = async () => {
  const res = await queryPostsService(10, 0,undefined , undefined , undefined);
  // console.log(res.data);
  // postStore.setPosts(res.data.items);
  // console.log(postStore.posts);
  blogList.value = res.data.items
  // console.log(blogList.value);
  blogListLoading.value = false
}
// getBlogList()
const searchBlog = async () => {//搜索博客
  //实现模糊搜索，搜索标题和内容
    blogListLoading.value = true
    const res = await queryPostsService(10, 0,undefined, searchContent.value, undefined);
    // postStore.setPosts(res.data.items);
    // console.log(postStore.posts);
    blogList.value = res.data.data
    blogListLoading.value = false


}

const handleClick = (tab: TabsPaneContext, event: Event) => { //选项卡点击事件
  console.log(tab, event)

}
</script>
<style>
/* 左侧按钮 */
.right-aligned-btn {
  display: block;
  margin: 10px 0;
  float: right;
  padding: auto;
}
.scrollable-content {
  max-height: 100vh; 
  overflow-y: auto;
  padding: 10px;
}

/* 额外可以加点细节，让滚动条更好看 */
/* .scrollable-content::-webkit-scrollbar {
  width: 6px;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
} */
</style>
  