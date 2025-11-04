import { defineStore } from 'pinia'
import type { Post } from '@/lib/types'

interface PostState {
  posts: Post[]
  currentPost: Post | null
}

export const usePostStore = defineStore('post', {
  state: (): PostState => ({
    posts: [],
    currentPost: null
  }),
  actions: {
    /** 设置帖子列表 */
    setPosts(posts: Post[]) {
      this.posts = posts
    },
    /** 添加单个帖子到列表最前 */
    addPost(post: Post) {
      this.posts.unshift(post)
    },
    /** 更新列表中已有的帖子 */
    updatePost(updated: Post) {
      const idx = this.posts.findIndex(p => p.ID === updated.ID)
      if (idx !== -1) {
        this.posts.splice(idx, 1, updated)
      }
      if (this.currentPost?.ID === updated.ID) {
        this.currentPost = updated
      }
    },
    /** 删除指定 ID 的帖子 */
    removePost(id: number) {
      this.posts = this.posts.filter(p => p.ID !== id)
      if (this.currentPost?.ID === id) {
        this.currentPost = null
      }
    },
    /** 设置当前选中的帖子 */
    setCurrentPost(post: Post) {
      this.currentPost = post
    },
    /** 清空当前选中 */
    clearCurrentPost() {
      this.currentPost = null
    }
  },
  /** 持久化存储 */
  persist: true
})

export default usePostStore
