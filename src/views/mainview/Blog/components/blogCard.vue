<template>
	<el-container >
    <el-divider  />
      <el-header class="blog-card__content">
        
		<!-- 标题 -->
		<RouterLink
		  :to="toBlogDetailUrl"
		  class="blog-card__title"
		>
		  {{ post.title }}
		</RouterLink>
		<div class="blog-card__author">
      <!-- <img :src="(postUser?.avatar !== 'abandoned' && postUser != null) ? postUser.avatar : defaultAvatar" class="blog-card__avatar" />
			<span>{{ postUser != null ? postUser.nickname : '默认昵称' }}</span> -->
      <Author
        v-if="postUser"
        :user="postUser"
        default-avatar="/images/default-avatar.png"
        @follow="handleFollow"
        @message="handleMessage"
      />
		</div>
			<div class="blog-card__time">
				<ClockCircleOutlined />
				<span>{{ calculateTime() }}</span>
			</div>
	  </el-header>
      <el-main class="blog-card group">
		<!-- 简要介绍 -->
			<!-- 封面图 -->
			<img
				class="blog-card__cover"
				alt="art cover"
				loading="lazy"
				src="@/assets/sunflower.jpg"
			/>
		<el-text class="blog-card__excerpt">
		  <RouterLink :to="toBlogDetailUrl" tag="a" target="_blank">
			{{ post.content.slice(0, 35) + '……' }}
		  </RouterLink>
		</el-text>
	  </el-main>
		<el-footer class="blog-card__footer">

		<el-container class="blog-card__actions-footer">
			<!-- 点赞 -->
			<el-aside width="33%" class="blog-card__action">
			<Like theme="outline" size="24" :fill="likeColor" @click="toggleLike" />
			<span class="action-text">{{ likeCount }}</span>
			</el-aside>

			<!-- 评论 -->
			<el-main class="blog-card__action">
			<Comment theme="outline" size="24" fill="#333" />
			<span class="action-text">{{ commentCount }}</span>
			</el-main>

			<!-- 分享 -->
			<el-aside width="33%" class="blog-card__action" @click="copyCurrentUrl(post.instanceID)">
			<Share theme="outline" size="24" fill="#333" />
			<span class="action-text">分享</span>
			</el-aside>
		</el-container>
		</el-footer>
    </el-container>

</template>
  
  
  <script setup lang="ts">

  import { Like,Comment,Share} from '@icon-park/vue-next'
  import { ref, computed ,onMounted } from 'vue'
  import { useRouter, RouterLink } from 'vue-router'
  // import { useUserInfoStore } from '@/stores/userInfo'
  import { likeResourceService, unlikeResourceService,getLikesCountService,getUserisLikedService } from '@/api/like'
  // import { getPostByIdService, queryPostsService } from '@/api/post'
  import { createCommentService, getCommentsService, getCommentByIdService, updateCommentService, deleteCommentService } from '@/api/comment'
  import { SearchUserService,chageAvatarUrl } from '@/api/user'
  import { usePostStore} from '@/stores/postStore'
  
  import defaultAvatar from '@/assets/algo_logo.webp'
  import Author from './author.vue'
  import { ElMessage } from 'element-plus'
  import type { userInfo, Post, like, comment } from '@/lib/types'
  import { getCurrentInstance } from 'vue';
  
const instance = getCurrentInstance(); // 获取当前实例链接
const proxy = instance ? instance.proxy : null;
  
  interface Props { post: Post }  // 确保传入的博客数据包含了（post）所有的字段
  const props = defineProps<Props>() //接受父组件传参
  const post = props.post
  // console.log(post)

//   const postUseravatar = computed(() => userInfoStore.userinfo.avatar)
//   const getuser = async () => {
// 	const res = await SearchUserService(post.author)
// 	return res.data.Items[0]
//   }
  const postUser = ref<userInfo | null>(null)

  const likeCount = ref<number>(0)
//   const liked = ref(blog.likeState === 1)
const liked = ref(false)

const commentCount = ref<number>(0)
onMounted(async () => {
  try {
    // 获取当前用户
    const userRes = await SearchUserService(post.author)
    // console.log(userRes.data.Items[0])
    postUser.value = userRes.data.Items[0]
    console.log(postUser.value)
    // @ts-ignore
    if(postUser.value && postUser.value.avatar !== "abandoned")postUser.value.avatar = chageAvatarUrl(postUser.value.avatar)
    //获取评论数
    const commentRes = await getCommentsService(post.instanceID.toString(), 1)
    // console.log(commentRes.data.totalItems)
    commentCount.value = commentRes.data.totalItems
  } catch (e) {
    console.error('获取用户失败', e)
  }

  try {
    //是否点赞
    // console.log(post)
    const Res = await getUserisLikedService(post.instanceID.toString(), 'post')
    // console.log(likeRes)
    liked.value = Res.data
    const likeRes = await getLikesCountService(post.instanceID.toString(), 'post')
    likeCount.value = likeRes.data.totalItems
	// console.log(likeCount.value)
  } catch (e) {
	console.error('获取点赞数失败', e)
  } 
})
  // 点赞颜色
  const likeColor = computed(() => (liked.value ? ['#f56c6c', '#ffffff'] : ['#9b9b9b', '#ffffff']))
//   const starColor = computed(() => (starred.value ? ['#f5a623', '#ffffff'] : ['#9b9b9b', '#ffffff']))
  const commentColor = ref(['#9b9b9b', '#ffffff'])
  
  
  // router
  const router = useRouter()
  const toBlogDetailUrl = `/BlogDetail/${post.instanceID.toString()}`
  // console.log(post.instanceID)
  // toggle like
  const toggleLike = async () => {
	try {
	  if (liked.value) {
		await unlikeResourceService(post.instanceID.toString(), 'post')
		likeCount.value--
	  } else {
		await likeResourceService(post.instanceID.toString(), 'post')
		likeCount.value++
	  }
	  liked.value = !liked.value
	} catch (err) {
	  ElMessage.error('操作失败，请稍后重试')
	}
  }
  function handleFollow(username: string) {
  // 调用关注接口……
  
}

function handleMessage(username: string) {
  // 打开私信窗口……
}
function copyCurrentUrl(postId: number) {
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
	const postTs = new Date(post.createdAt).getTime()
	const diff = Date.now() - postTs
	const m = 60 * 1000,
	  h = 60 * m,
	  d = 24 * h,
	  w = 7 * d
  
	if (diff < h) return `${Math.floor(diff / m)} 分钟前`
	if (diff < d) return `${Math.floor(diff / h)} 小时前`
	if (diff < w) return `${Math.floor(diff / d)} 天前`
	return post.createdAt
  }
</script>
  
<style scoped lang="scss">
.blog-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 10px;
  width: 100%;
  height: 250px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: border-radius 0.3s ease;

  &:hover {
    border-radius: 1.25rem;
  }

  &__cover {
    flex-shrink: 0;
    width: 30%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
  }

  &__content {
    flex: 1;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0f172a;
    text-decoration: none;
    margin-bottom: 0.5rem;
  }

  &__excerpt {
    font-size: 0.875rem;
    color: #3b82f6;
    margin-bottom: 1rem;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__author {
    display: flex;
    align-items: center;

    & .blog-card__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }

  &__actions {
    display: flex;
    align-items: center;

    > div {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 1rem;

      & span {
        margin-left: 0.25rem;
        font-size: 0.875rem;
      }
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
  }

  &__time,
  &__like {
    display: flex;
    align-items: center;

    & span {
      margin-left: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    & svg {
      margin-right: 0.25rem;
    }

    &.blog-card__like {
      cursor: pointer;
    }
  }
}
// .blog-card__footer {
// 	background: rgb(255, 254, 254);
// }
.blog-card__actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 三等分布局 */
  height: 60px;                    /* 固定高度，保证统一 */
  padding: 0 1rem;
}

.blog-card__action {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.blog-card__action:hover {
  opacity: 0.8;
}

.action-text {
  margin-left: 0.25rem;
  font-size: 0.875rem;
  color: #333;
}
</style>