<template>
    <el-container style="min-height: 110vh;">
        <el-aside width="20%">
        </el-aside>
        <el-container style="min-height: 105vh;" >
            <el-header style="max-height: 10px;">

            </el-header>
            <div ref="scrollContainer" v-infinite-scroll="" infinite-scroll-distance="100" class="blog-content" style="height: 90vh; overflow: auto;">
            <el-main  style="height: 100%;">
            
                <!-- 帖子主体 --> 
                <el-card shadow="always">
                    <!-- 面包屑导航栏 -->
                    <el-breadcrumb separator="/">
                        <router-link to="/">Algohub/{{ blog?.title }}</router-link>       
                    </el-breadcrumb>
                    <el-divider />

                    <!-- 加载动态,骨架 -->
                    <el-skeleton style="width: 100%" v-if="!loadBlogDone">
                        <template #template>
                            <el-skeleton-item variant="image" style="width: 100%; height: 20%" />
                            <div style="padding: 14px">
                                <el-skeleton-item variant="p" style="width: 100%" />

                                <el-skeleton :rows="5" animated />
                                <el-skeleton-item variant="text" style="margin-right: 16px" />
                                <el-skeleton-item variant="text" style="width: 30%" />
                            </div>

                        </template>
                    </el-skeleton>
                   
                    <!-- 加载完成主体 -->
                    <div v-if="loadBlogDone"  >
                    
                    
                        <!-- 帖子信息头部 -->
                        <div>
                            <!-- 标题 -->
                            <h2 >{{ blog?.title }}</h2>
                            <!-- 关注按钮和标题、头像 -->
                            <!-- 头像和用户名 -->
                            <div >
                                <Author
                                v-if="author"
                                :user="author"
                                default-avatar="/images/default-avatar.png"/>
                            </div>
                            <!-- 发布时间 -->
                            <p class="post-time">{{ calculateTime() }}</p>
                        </div>
                        <el-divider />
                        <!-- 帖子内容 -->
                        <div>
                            <v-md-editor v-model="markdown" mode="preview"></v-md-editor>
                        </div>
                        <!-- 帖子底部信息 -->
                        <hr />
                        <div class="action-bar">
                            <div class="action-group left-group">
                            <!-- 喜欢 -->
                            <div
                                class="action-item"
                                @click="toggleLike"
                                @mouseleave="likeColor = likeMouseLeave"
                                @mouseenter="likeColor = likeMouseEnter"
                            >
                                <Like theme="two-tone" size="20" :fill="likeColor" />
                                <span class="action-text">{{ likeCount }}</span>
                            </div>
                            <!-- 回复评论 -->
                            <div class="action-item" @click="openCommentsEdit">
                                <comment theme="outline" size="24" :fill="shareColor"  />
                                <span class="action-text">{{ commentCount }}</span>
                            </div>
                            <!-- 分享 -->
                            <div
                                class="action-item"
                                @mouseleave="shareColor = ['#9b9b9b', '#ffffff']"
                                @mouseenter="shareColor = ['#4a90e2', '#ffffff']"
                                @click="copyShareUrl(blog?.instanceID)"
                            >
                                <Share theme="two-tone" size="20" :fill="shareColor" />
                            </div>


                            </div>

                            <div class="action-group right-group">
                            <!-- 修改 -->
                            <div
                                v-show="useUserInfoStore().userinfo.username === blog?.author"
                                class="action-item"
                                @mouseleave="editColor = ['#9b9b9b', '#ffffff']"
                                @mouseenter="editColor = ['#303133', '#ffffff']"
                                @click="editChangeOpen = true"
                            >
                                <edit theme="outline" size="24" :fill="editColor" />
                            </div>

                            <!-- 删除 -->
                            <div
                                v-show="useUserInfoStore().userinfo.username === blog?.author || useUserInfoStore().isAdmin"
                                class="action-item"
                                @click="removeBlog"
                                @mouseleave="deleteColor = ['#9b9b9b', '#ffffff']"
                                @mouseenter="deleteColor = ['#d0021b', '#ffffff']"
                            >
                                <delete theme="outline" size="24" :fill="deleteColor" />
                            </div>
                            </div>
                        </div>
                    
                    </div>
                </el-card>
           
            </el-main>
            <el-footer >                    
                <!-- 评论卡片 -->
                <commentsCard v-for="comments in commentsList" :key="comments.ID" :comments="comments" :bid="postId" />
                    <!-- 如果要显示“没有评论”提示 -->
                <div v-if="commentCount === 0" class="empty">
                暂无评论，快来抢沙发~
                </div>
                <el-divider >没有更多评论啦~</el-divider>
            </el-footer>
        </div>
        </el-container>
        <el-aside width="20%">
        </el-aside>
    </el-container>

    <!-- 评论回复弹出框 -->
    <el-drawer v-model="openEditer" title="I am the title" :with-header="false" direction="btt" size="80%">
        <h2 class="mb-4 text-2xl font-bold" style="float: left;width: 100%;">回复评论</h2>
        <!-- markdown编辑器 -->
        <v-md-editor v-model="comments.content" height="80%" :disabled-menus="[]"
            @upload-image="handleUploadImage"></v-md-editor>
        <!-- 发布按钮 -->
        <button type="button" style="float: right;" publishBlog @click="sendComments"
            class="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
            发 &nbsp;&nbsp; 布 <icon-writing-fluently theme="outline" size="24" :fill="['#ffffff', '#7ed321']"
                style="float: right;margin-left: 5px;" />
        </button>
    </el-drawer>
    <!-- 修改弹出框 -->
    <el-drawer v-model="editChangeOpen" title="I am the title" :with-header="false" direction="btt" size="80%">
        <MarkdownEditor type="change" :blog="blog" />
    </el-drawer>
</template>

<script lang="ts" setup>
import { Like,Comment,Share,Delete,Edit} from '@icon-park/vue-next'
import { ElMessage } from 'element-plus'

import { getPostByIdService, queryPostsService,deletePostService,uploadImageService } from '@/api/post'
import { SearchUserService,chageAvatarUrl } from '@/api/user'
import { likeResourceService, unlikeResourceService,getLikesCountService,getUserisLikedService } from '@/api/like'
import { createCommentService, getCommentsService, getCommentByIdService, updateCommentService, deleteCommentService } from '@/api/comment'

import { reactive, ref,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import type { Post, comment, userInfo } from '@/lib/types'
import useClipboard from "vue-clipboard3";
import { useUserInfoStore } from '@/stores/userInfo'
import commentsCard from './commentsCard.vue'
import Author from './author.vue'

import MarkdownEditor from './MarkdownEditor.vue'

const { toClipboard } = useClipboard();
const {params} = useRoute()
const router = useRouter()
const scrollContainer  = ref(null)
const blog = ref<Post | null>(null) // 帖子信息
const markdown = ref("") // 文章内容
const author = ref<null | userInfo>(null) // 用户
// const type = ref("#all") // 搜索类型
const loadBlogDone = ref(false) // 是否加载完成
const openEditer = ref(false) //是否弹出评论编辑器
const editChangeOpen = ref(false) // 编辑器 弹出框

const commentsList = ref<any>([])
// 响应式数组：存储上传后的图片链接
const imgUrlList = ref<string[]>([])
const commentCount = ref(0)

const shareColor = ref(['#9b9b9b', '#ffffff'])
const postId = params.id // 帖子id

// 关注状态
const subscribeValue = ref("关注")
const subscribeState = ref(false)


// 喜欢状态
const likeState = ref(false)
const likeCount = ref(0)
const likeMouseEnter = ref(['#67C23A', '#ffffff']) // 鼠标移入
const likeMouseLeave = ref(['#9b9b9b', '#ffffff']) // 鼠标移出


// 删除状态
const deleteColor = ref(['#9b9b9b', '#ffffff'])

// 编辑状态
const editColor = ref(['#9b9b9b', '#ffffff'])

let comments = reactive<comment>({    
    content: "",
    author: "",
    refer_type: "", //引用的类型
    refer_id: 0n,//引用的评论，可选
    source_id: 0n,//源ID，例如帖子ID
    source_type: ""//源类型，例如 "post"
})
const getBlogDetial = async () => {
    // console.log(postId);
    // @ts-ignore
    const res = await getPostByIdService(postId)
    // console.log(res.data);
    blog.value = res.data
    markdown.value = res.data.content
    // console.log(markdown.value);
    // blog.value!.adminTags = JSON.parse(blog.value?.adminTags)
    // if (typeof res.data.data.tag != 'object') {
    //     tags.value = JSON.parse(res.data.data.tag)
    // }

    // 初始化关注状态
    if(subscribeState.value == true){
        subscribeValue.value = "已关注"
        subscribeState.value = true
    }
    getCommentsList()
    getUser()
    getLikesCount()
}
getBlogDetial()

const getUser =async () =>{
    // console.log(blog);
    // @ts-ignore
  const res =await SearchUserService(blog !==null ? blog?.value.author:'')
//   console.log(res.data);
  author.value = res.data.Items[0]
//   console.log(author.value );
// @ts-ignore
  if(author.value !== null)author.value.avatar = chageAvatarUrl(author.value.avatar)
}
const getLikesCount = async () => {
    // const res = await getLikesCountService(blog.value?.id)
    // console.log(res.data);
    // likesCount.value= res.data.totalItems
        //是否点赞
    // console.log(post)
    // @ts-ignore
    const Res = await getUserisLikedService(postId, 'post')
    // console.log(Res)
    likeState.value = Res.data
    // 初始化喜欢状态
    if (likeState.value === false) {
    let likeTempColor = likeMouseEnter.value
    likeMouseEnter.value = likeMouseLeave.value
    likeMouseLeave.value = likeTempColor
    }
    // @ts-ignore
    const likeRes = await getLikesCountService(postId, 'post')
    likeCount.value = likeRes.data.totalItems
}



const removeBlog = () => {
    const res = confirm("确定删除吗？")
    if (res) {
        // @ts-ignore
        deletePostService(postId).then(() => {
            ElMessage.success("删除成功")
            router.push('/')
        })
    }
}
// 打开回复评论窗口
const openCommentsEdit = () => {
    if (useUserInfoStore().isLogin == false) {
        ElMessage.error("未登录")
        return 0;
    } else {
        openEditer.value = true
    }
}

// 得到评论列表
const getCommentsList =async () => {
    // @ts-ignore
    const res = await getCommentsService(postId)
    commentCount.value = res.data.totalItems
    //  过滤掉评论的评论
    // @ts-ignore
    commentsList.value =  res.data.items.filter(item => item.refer_type !== 'comment');
    console.log(commentsList.value);
    loadBlogDone.value = true
}

// 赞
const toggleLike = async () => {
	try {
	  if (likeState.value) {
        // @ts-ignore
		await unlikeResourceService(postId, 'post')
		likeCount.value--

	  } else {
        // @ts-ignore
		await likeResourceService(postId, 'post')
		likeCount.value++
	  }
	  likeState.value = !likeState.value
	} catch (err) {
	  ElMessage.error('操作失败，请稍后重试')
	}
  }
  // 点赞颜色
  let likeColor = computed(() => (likeState.value ? ['#f56c6c', '#ffffff'] : ['#9b9b9b', '#ffffff']))
// 发送评论
const sendComments =async () => {
    // 评论对象
    comments.refer_type = "post"
    // @ts-ignore
    comments.refer_id = BigInt(postId)
    //  源ID
    // @ts-ignore
    comments.source_id = BigInt(postId)
    comments.source_type = "post"
    comments.author = useUserInfoStore().userinfo.username
    const res =await createCommentService(comments)
    console.log(res);
    ElMessage({
        message: '回复成功.',
        type: 'success',
    })
    location.reload()
    openEditer.value = !openEditer.value

}
//插入图片
const handleUploadImage = async (event: any, insertImage: any, files: File[]) => {
    let formData: any = new FormData()
    formData.append('file', files[0])
    console.log(files[0]);
    const res =await uploadImageService(formData)
    ElMessage({
        message: res.data.sub_type,
        type: 'success'
    })
    let URL  = chageAvatarUrl(res.data.sub_url)
    // @ts-ignore
    imgUrlList.value.push(URL)
    console.log(imgUrlList.value);
}



// 分享链接
function copyShareUrl(postId?: number) {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  // 替换路径部分为 /blogDetail/:id
  url.pathname = `/blogDetail/${postId}`;

  const newUrl = url.toString();

  navigator.clipboard.writeText(newUrl)
    .then(() => {
      ElMessage.success('链接已复制到剪贴板');
    })
    .catch(err => {
      console.error('未能复制文本: ', err);
      ElMessage.error('复制链接失败');
    });
}

// 计算时间差
const calculateTime = () => {
const postTs = new Date(blog.value?.createdAt || '').getTime()
const diff = Date.now() - postTs
const m = 60 * 1000,
    h = 60 * m,
    d = 24 * h,
    w = 7 * d

if (diff < h) return `${Math.floor(diff / m)} 分钟前`
if (diff < d) return `${Math.floor(diff / h)} 小时前`
if (diff < w) return `${Math.floor(diff / d)} 天前`
return blog.value?.createdAt
}


</script>

<style scoped>
/* 滑动栏 */
.blog-content {
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
}
/* 顶部 */

/* 操作栏样式 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  background: #fff;
}

.action-group {
  display: flex;
  align-items: center;
}

.left-group .action-item {
  margin-right: 16px;
}

.right-group .action-item {
  margin-left: 16px;
}

.action-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: background-color 0.2s;
}

.action-item:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
