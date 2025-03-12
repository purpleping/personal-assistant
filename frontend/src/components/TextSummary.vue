<template>
  <div class="summary-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>文本摘要</h2>
          <el-select v-model="provider" placeholder="选择服务提供商">
            <el-option label="GPT" value="gpt" />
            <el-option label="DeepSeek" value="deepseek" />
          </el-select>
        </div>
      </template>

      <div class="input-panel">
        <h3>输入文本：</h3>
        <el-input
          type="textarea"
          v-model="inputText"
          :rows="6"
          placeholder="请输入需要生成摘要的文本"
          @input="updateInputStats"
        />
        <div class="input-stats">
          <span>字数：{{ charCount }}</span>
        </div>
      </div>

      <div class="control-panel">
        <el-button
          type="primary"
          :icon="Document"
          @click="generateSummary"
          :loading="isProcessing"
        >
          生成摘要
        </el-button>
      </div>

      <div class="result-panel" v-if="summary">
        <h3>摘要结果：</h3>
        <el-input
          type="textarea"
          v-model="summary"
          :rows="4"
        />
        <div class="summary-actions">
          <el-button type="text" @click="copyToClipboard">复制到剪贴板</el-button>
          <el-button type="text" @click="submitFeedback">提交反馈</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const provider = ref('gpt')
const inputText = ref('')
const summary = ref('')
const isProcessing = ref(false)
const charCount = ref(0)

const updateInputStats = () => {
  charCount.value = inputText.value.length
}

const generateSummary = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入需要生成摘要的文本')
    return
  }

  isProcessing.value = true
  try {
    const response = await axios.post(
      `/api/generate-summary?provider=${provider.value}`,
      { text: inputText.value }
    )
    summary.value = response.data.summary
  } catch (error) {
    ElMessage.error('生成摘要失败：' + error.message)
  } finally {
    isProcessing.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(summary.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败：' + error.message)
  }
}

const submitFeedback = () => {
  router.push({
    name: 'feedback',
    params: {
      originalText: inputText.value,
      aiSummary: summary.value
    }
  })
}
</script>

<style scoped>
.summary-container {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-panel,
.control-panel,
.result-panel {
  margin-bottom: 20px;
}

.input-panel h3,
.result-panel h3 {
  margin-bottom: 10px;
}

.input-stats {
  margin-top: 5px;
  color: #909399;
  font-size: 14px;
}

.summary-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>