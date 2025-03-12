<template>
  <div class="speech-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>语音识别</h2>
          <el-select v-model="provider" placeholder="选择服务提供商">
            <el-option label="Google" value="google" />
            <el-option label="Whisper" value="whisper" />
          </el-select>
        </div>
      </template>
      
      <div class="control-panel">
        <el-button
          type="primary"
          :icon="isRecording ? 'Stop' : 'Microphone'"
          @click="toggleRecording"
          :loading="isProcessing"
        >
          {{ isRecording ? '停止录音' : '开始录音' }}
        </el-button>
        <el-upload
          class="upload-demo"
          action="/api/speech-to-text"
          :data="{ provider }"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
        >
          <el-button type="primary" :icon="Upload" :loading="isProcessing">上传音频</el-button>
        </el-upload>
      </div>

      <div class="result-panel" v-if="transcription">
        <h3>识别结果：</h3>
        <el-input
          type="textarea"
          v-model="transcription"
          :rows="4"
          readonly
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Microphone, Stop, Upload } from '@element-plus/icons-vue'
import axios from 'axios'

const provider = ref('google')
const isRecording = ref(false)
const isProcessing = ref(false)
const transcription = ref('')
let mediaRecorder = null
let audioChunks = []

const toggleRecording = async () => {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        isProcessing.value = true
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('audio', audioBlob)

        try {
          const response = await axios.post(
            `/api/speech-to-text?provider=${provider.value}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          transcription.value = response.data.text
        } catch (error) {
          ElMessage.error('语音识别失败：' + error.message)
        } finally {
          isProcessing.value = false
        }
      }

      mediaRecorder.start()
      isRecording.value = true
    } catch (error) {
      ElMessage.error('无法访问麦克风：' + error.message)
    }
  } else {
    mediaRecorder.stop()
    mediaRecorder.stream.getTracks().forEach(track => track.stop())
    isRecording.value = false
  }
}

const beforeUpload = (file) => {
  const isAudio = file.type.startsWith('audio/')
  if (!isAudio) {
    ElMessage.error('请上传音频文件')
    return false
  }
  return true
}

const handleUploadSuccess = (response) => {
  transcription.value = response.text
  ElMessage.success('音频识别成功')
}

const handleUploadError = (error) => {
  ElMessage.error('音频识别失败：' + error.message)
}
</script>

<style scoped>
.speech-container {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-panel {
  text-align: center;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.result-panel {
  margin-top: 20px;
}

.result-panel h3 {
  margin-bottom: 10px;
}
</style>