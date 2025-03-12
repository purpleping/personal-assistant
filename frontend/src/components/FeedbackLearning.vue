<template>
  <div class="feedback-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>学习反馈</h2>
        </div>
      </template>

      <div class="input-panel">
        <h3>原始摘要：</h3>
        <el-input
          type="textarea"
          v-model="aiSummary"
          :rows="4"
          placeholder="请输入AI生成的原始摘要"
        />

        <h3 class="mt-20">您的修改：</h3>
        <el-input
          type="textarea"
          v-model="userFeedback"
          :rows="4"
          placeholder="请输入您对摘要的修改建议"
        />
      </div>

      <div class="control-panel">
        <el-button
          type="primary"
          :icon="ChatLineRound"
          @click="submitFeedback"
          :loading="isProcessing"
        >
          提交反馈
        </el-button>
      </div>

      <div class="result-panel" v-if="analysis">
        <h3>分析结果：</h3>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="内容长度">
            {{ analysis.lengthPreference }}
          </el-descriptions-item>
          <el-descriptions-item label="关键信息">
            {{ analysis.keyPointsRetention }}
          </el-descriptions-item>
          <el-descriptions-item label="语言风格">
            {{ analysis.stylePreference }}
          </el-descriptions-item>
          <el-descriptions-item label="结构组织">
            {{ analysis.structurePreference }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatLineRound } from '@element-plus/icons-vue'
import axios from 'axios'

const aiSummary = ref('')
const userFeedback = ref('')
const analysis = ref(null)
const isProcessing = ref(false)

const submitFeedback = async () => {
  if (!aiSummary.value.trim() || !userFeedback.value.trim()) {
    ElMessage.warning('请输入原始摘要和修改建议')
    return
  }

  isProcessing.value = true
  try {
    const response = await axios.post('/api/learn-from-feedback', {
      originalText: '',
      aiSummary: aiSummary.value,
      userFeedback: userFeedback.value
    })
    analysis.value = response.data.analysis
    ElMessage.success('反馈提交成功')
  } catch (error) {
    ElMessage.error('提交反馈失败：' + error.message)
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.feedback-container {
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

.mt-20 {
  margin-top: 20px;
}

.control-panel {
  text-align: center;
}

.result-panel :deep(.el-descriptions) {
  margin-top: 10px;
}
</style>