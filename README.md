# 智能个人助理系统

一个基于AI技术的智能个人助理系统，支持语音识别、文本摘要生成和自适应学习功能。系统采用模块化设计，支持多个API服务提供商，并具有自我学习和优化能力。

## 核心功能

### 1. 语音识别（Speech-to-Text）
- 支持多个语音识别服务提供商（Google Cloud Speech、OpenAI Whisper）
- 支持实时语音转文本
- 支持多种音频格式和采样率
- 支持中文等多语言识别

### 2. 智能摘要生成
- 支持多个AI服务提供商（GPT-4、腾讯云DeepSeek）
- 自适应学习用户偏好
- 支持自定义摘要长度和风格
- 智能保留关键信息

### 3. 自适应学习
- 基于用户反馈的自动优化
- 学习用户的摘要偏好
- 持续改进摘要质量
- 支持个性化定制

## 技术架构

### 后端技术栈
- Node.js + Express.js
- MongoDB 数据库
- OpenAI API
- Google Cloud Speech API
- 腾讯云 NLP API

### 前端技术栈
- Vue 3
- Element Plus UI
- Vite 构建工具
- Axios HTTP 客户端

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- MongoDB >= 4.0.0
- NPM >= 6.0.0

### 安装步骤

1. 克隆项目代码
```bash
git clone [项目地址]
cd personal-assistant
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

3. 配置环境变量
- 复制 `.env.example` 文件为 `.env`
- 配置以下必要的API密钥：
  - OPENAI_API_KEY
  - GOOGLE_APPLICATION_CREDENTIALS
  - TENCENT_SECRET_ID
  - TENCENT_SECRET_KEY

4. 启动服务
```bash
# 启动后端服务
npm start

# 启动前端开发服务器
cd frontend
npm run dev
```

## API接口

### 语音识别
```
POST /api/speech-to-text
Content-Type: multipart/form-data

参数：
- audio: 音频文件
- provider: 可选，服务提供商（google/whisper）
```

### 生成摘要
```
POST /api/generate-summary
Content-Type: application/json

参数：
- text: 需要生成摘要的文本
- provider: 可选，服务提供商（gpt/deepseek）
```

### 反馈学习
```
POST /api/learn-from-feedback
Content-Type: application/json

参数：
- originalText: 原始文本
- aiSummary: AI生成的摘要
- userFeedback: 用户修改后的摘要
```

## 贡献指南

欢迎提交问题和改进建议！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues
- 电子邮件：[您的邮箱]
- 项目讨论区