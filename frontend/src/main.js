import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

// 导入各个功能模块的组件
import SpeechRecognition from './components/SpeechRecognition.vue'
import TextSummary from './components/TextSummary.vue'
import FeedbackLearning from './components/FeedbackLearning.vue'

// 配置路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/speech',
      name: 'speech',
      component: SpeechRecognition,
      meta: { title: '语音识别' }
    },
    {
      path: '/summary',
      name: 'summary',
      component: TextSummary,
      meta: { title: '文本摘要' }
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: FeedbackLearning,
      meta: { title: '学习反馈' }
    },
    {
      path: '/',
      redirect: '/speech'
    }
  ]
})

// 创建Vue应用实例
const app = createApp(App)

// 使用路由和Element Plus
app.use(router)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')