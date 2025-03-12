<template>
  <el-container class="app-container">
    <el-aside width="200px">
      <el-menu
        :router="true"
        :default-active="$route.path"
        class="nav-menu"
      >
        <el-menu-item index="/speech">
          <el-icon><Microphone /></el-icon>
          <span>语音识别</span>
        </el-menu-item>
        <el-menu-item index="/summary">
          <el-icon><Document /></el-icon>
          <span>文本摘要</span>
        </el-menu-item>
        <el-menu-item index="/feedback">
          <el-icon><ChatLineRound /></el-icon>
          <span>学习反馈</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { Microphone, Document, ChatLineRound } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.nav-menu {
  height: 100%;
  border-right: solid 1px #e6e6e6;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>