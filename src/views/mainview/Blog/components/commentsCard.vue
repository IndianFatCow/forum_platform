<template>
    <el-card shadow="always" style="margin-top: 10px;">
            <Author
            :user="author"
            />
            <!-- 时间 -->
            <div >
                <p style="size: 10px;">{{ calculateTime() }}</p>
            </div>
        <!-- 评论详情信息 -->
        <div >
            <el-link type="primary" v-if="refer_comment">回复 @{{ comments.author }}</el-link>
            <el-card shadow="hover" style="margin-top: 10px;">
                <v-md-editor v-model="comments.content" mode="preview"></v-md-editor>
            </el-card>
        </div>
        <!-- 帖子底部信息 -->
        <hr />
        <div>
            <!-- 喜欢 -->
            <div style="float: left;margin: 30px 10px 20px 0px;" @click="toggleLike" @mouseleave="likeColor = likeMouseLeave"
                @mouseenter="likeColor = likeMouseEnter">
                <like theme="two-tone" size="20" :fill="likeColor" />
                <span class="text-md mx-1" :style="{ color: likeColor[0] }">{{ likeCount }}</span>
            </div>
            <!-- 删除 -->
            <div v-show="useUserInfoStore().userinfo.username  == comments.author || useUserInfoStore().isAdmin" @click="removeComments"
                style="float: left;margin: 31px 10px 20px 0px;" @mouseleave="deleteColor = ['#9b9b9b', '#ffffff']"
                @mouseenter="deleteColor = ['#d0021b', '#ffffff']">
                <delete theme="two-tone" size="20" :fill="deleteColor" />
            </div>
            <!-- 回复 -->
            <div class="cursor-pointer text-center text-md justify-center items-center flex " @click="openCommentsEdit"
                style="float: left;margin: 30px 10px 20px 0px;" @mouseleave="shareColor = ['#9b9b9b', '#ffffff']"
                @mouseenter="shareColor = ['#4a90e2', '#ffffff']">
                <comment style="margin-top: 3px;" theme="two-tone" size="20" :fill="shareColor" />
            </div>

        </div>

        <!-- 评论回复弹出框 -->
        <el-drawer v-model="openEditer" title="I am the title" :with-header="false" direction="btt" size="80%">
            <h2  style="float: left;width: 100%;">回复@{{ author.nickname }}
            </h2>
            <!-- markdown编辑器 -->
            <v-md-editor v-model="commentsC.context" height="80%" :disabled-menus="[]"
                @upload-image="handleUploadImage"></v-md-editor>
            <!-- 发布按钮 -->
            <button type="button" style="float: right;" publishBlog @click="sendComments">
                发 &nbsp;&nbsp; 布 
            <edit theme="outline" size="24" :fill="['#ffffff', '#7ed321']"
                    style="float: right;margin-left: 5px;" />
            </button>
        </el-drawer>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive,computed,onMounted } from 'vue'
import type { comment,userInfo } from '@/lib/types'
import { ElNotification,ElMessage } from 'element-plus'
import { Like,Comment,Share,Delete,Edit} from '@icon-park/vue-next'
import { useUserInfoStore } from '@/stores/userInfo'
// import API from '@/plugins/axiosInstance';
import { likeResourceService, unlikeResourceService,getLikesCountService,getUserisLikedService } from '@/api/like'
import { createCommentService, getCommentsService, getCommentByIdService, updateCommentService, deleteCommentService } from '@/api/comment'
import { userInfoService } from '@/api/user'
import Author from './author.vue'
import { fa } from 'element-plus/es/locales.mjs'

const props = defineProps(['comments','bid'])
const comments: comment = props.comments
const deleteColor = ref(['#9b9b9b', '#ffffff'])

const author = ref<any>({})
const refer_comment = ref(false)
const refer_author = ref("")
// 喜欢状态
const likeState = ref(false)
const likeCount = ref(0)
const likeMouseEnter = ref(['#67C23A', '#ffffff'])
const likeMouseLeave = ref(['#9b9b9b', '#ffffff'])
// 点赞颜色
let likeColor = computed(() => (likeState.value ? ['#f56c6c', '#ffffff'] : ['#9b9b9b', '#ffffff']))

if (likeState.value == true) {
    let likeTempColor = likeMouseEnter.value
    likeMouseEnter.value = likeMouseLeave.value
    likeMouseLeave.value = likeTempColor
}
const commentsC = reactive({//存储编辑的评论
    context: '',
    source_id: comments.instanceID,
    source_type: 'comment',
    refer_id: comments.source_id,
    refer_type: 'comment',
})

const shareColor = ref(['#9b9b9b', '#ffffff'])
const commentsColor = ref(['#6b7280', '#ffffff'])
const openEditer = ref(false)

onMounted(async() => {
    try{
        // 获取评论作者信息
        const res = await userInfoService(comments.author)
        author.value = res.data
        // console.log("评论作者信息")
        // console.log(res.data)

        //获取点赞状态
        // @ts-ignore
        const likeRes = await getUserisLikedService(comments.instanceID.toString(), 'comment')
        likeState.value = likeRes.data
        refer_comment.value = comments.refer_type == "comment" ? true : false
        if(comments.refer_type == "comment"){
            // @ts-ignore
            const res = await getCommentByIdService(comments.refer_id.toString())
            refer_author.value = res.data.author
        }
    } catch {
        ElNotification({
            title: "请求被拒绝!",
            type: 'error',
        })
    }
})
// 打开回复评论窗口
const openCommentsEdit = () => {
    if (useUserInfoStore().isLogin == false) {
        ElNotification({
            title: "请求被拒绝!",
            message: "未登录!",
            type: 'error',
        })
        return 0;
    } else {
        openEditer.value = true
    }
}
// 赞
const toggleLike = async () => {
	try {
	  if (likeState.value) {
        // @ts-ignore
		await unlikeResourceService(comments.instanceID.toString(), 'comment')
		likeCount.value--

	  } else {
        // @ts-ignore
		await likeResourceService(comments.instanceID.toString(), 'comment')
		likeCount.value++
	  }
	  likeState.value = !likeState.value
	} catch (err) {
	  ElMessage.error('操作失败，请稍后重试')
	}
  }

// 删除评论
const removeComments =async () => {
    console.log("删除评论");
    console.log(comments);
    // @ts-ignore
    await deleteCommentService(comments.source_id,comments.instanceID.toString()).then(() => {
        ElMessage({
            message: '删除成功.',
            type: 'success',
        })
    }).catch(err => {console.log(err)})
}

// markdown上传图片
const handleUploadImage = (event: any, insertImage: any, files: File[]) => {
    // let formData: any = new FormData()
    // formData.append('file', files[0])
    // console.log(files[0]);


    // API({
    //     url: '/uploadImg',
    //     data: formData,
    //     method: 'post',
    //     headers: { 'Content-Type': 'multipart/form-data' }
    // }).then((res) => {
    //     console.log(res);
    //     insertImage({
    //         url: res.data
    //     })
    // })
}

// 发送评论
const sendComments =async () => {
    
    const res =await createCommentService(commentsC)
    console.log(res);
    ElMessage({
        message: '回复成功.',
        type: 'success',
    })
    location.reload()
    openEditer.value = !openEditer.value

}
// 计算时间差
const calculateTime = () => {
const postTs = new Date(comments.createdAt || '').getTime()
const diff = Date.now() - postTs
const m = 60 * 1000,
    h = 60 * m,
    d = 24 * h,
    w = 7 * d

if (diff < h) return `${Math.floor(diff / m)} 分钟前`
if (diff < d) return `${Math.floor(diff / h)} 小时前`
if (diff < w) return `${Math.floor(diff / d)} 天前`
return comments.createdAt
}
</script>