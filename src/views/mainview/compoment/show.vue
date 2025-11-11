<template>
  <el-container class="welcome-container" width="100%">
    <el-main>
      <section class="hero-section">
        <div class="content">
          <h1 class="main-title">南邮论坛</h1>
          <h2 class="subtitle">你的校园社区交流平台</h2>

          <p class="description">
            欢迎来到 <strong>南邮论坛</strong>！
            本站是一个面向南邮师生的社区论坛系统，提供用户注册与登录、板块管理、帖子发布与管理、评论与回复、搜索等功能，
            旨在为用户提供一个高效、便捷、丰富的校园交流平台。
          </p>

          <div class="button-group">
            <div class="button-wrapper">
              <el-button type="primary" round size="large" @click="goToForum">
                进入论坛
              </el-button>
              <span class="badge">开发版本1.0</span>
            </div>
            <a href="#" class="secondary-link">了解更多功能</a>
          </div>
        </div>
      </section>

    </el-main>
  </el-container>
</template>

<script setup lang="ts">
const goToForum = () => {
  window.location.href = "/home";
};
</script>

<style scoped>
.welcome-container {
  min-height: 10vh; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-section {
  width: 100%;
  background-color: #fff;
  padding: 8rem 2rem;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.main-title {
  font-size: 4rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(to right, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 0.5rem;
}

.description {
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #4b5563;
  line-height: 1.8;
}

.button-group {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.button-wrapper {
  position: relative;
}

.badge {
  position: absolute;
  top: -10px;
  right: -20px;
  background-color: #34d399;
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 9999px;
  white-space: nowrap;
}

.secondary-link {
  font-size: 0.9rem;
  color: #6366f1;
  text-decoration: none;
}
</style>
