require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const SummaryService = require('./summary-services');
const SpeechService = require('./speech-services');
const LearningService = require('./learning-services');

// 初始化Express应用
const app = express();
const upload = multer({ dest: 'uploads/' });

// 初始化语音识别客户端
const speechClient = new SpeechClient();

// 初始化OpenAI客户端
const openai = new OpenAI();

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/personal-assistant', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义学习记录模型
const LearningRecord = mongoose.model('LearningRecord', {
  originalText: String,
  aiSummary: String,
  userFeedback: String,
  learningPoints: [String],
  timestamp: { type: Date, default: Date.now }
});

// 初始化语音识别服务
const googleSpeechService = new SpeechService('google');
const whisperSpeechService = new SpeechService('whisper');

// 初始化摘要服务
const gptSummaryService = new SummaryService('gpt');
const deepseekSummaryService = new SummaryService('deepseek');

// 初始化学习服务
const learningService = new LearningService();

// 语音识别接口
app.post('/api/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    const provider = req.query.provider || 'google';
    const speechService = provider === 'google' ? googleSpeechService : whisperSpeechService;
    
    const transcription = await speechService.transcribe(req.file.buffer, {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'zh-CN'
    });

    res.json({ text: transcription, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 生成摘要接口
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { text } = req.body;
    const provider = req.query.provider || 'gpt';
    const summaryService = provider === 'gpt' ? gptSummaryService : deepseekSummaryService;
    
    // 获取优化后的提示词
    const optimizedPrompt = await learningService.generateOptimizedPrompt(text);
    
    const summary = await summaryService.generateSummary(optimizedPrompt, {
      model: 'gpt-4',
      length: 200
    });

    res.json({ summary, provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 用户反馈学习接口
app.post('/api/learn-from-feedback', async (req, res) => {
  try {
    const { originalText, aiSummary, userFeedback } = req.body;
    
    // 分析用户反馈，提取学习要点
    const analysis = await learningService.analyzeFeedbackDifference(aiSummary, userFeedback);
    
    // 保存学习记录
    const record = new LearningRecord({
      originalText,
      aiSummary,
      userFeedback,
      learningPoints: Object.values(analysis)
    });
    await record.save();

    // 获取更新后的摘要模式
    const patterns = await learningService.getSummaryPatterns();

    res.json({ success: true, analysis, patterns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 分析用户反馈，提取学习要点
async function analyzeFeedback(aiSummary, userFeedback) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "分析AI摘要和用户反馈之间的差异，提取关键的学习要点。"
      }, {
        role: "user",
        content: `AI摘要：${aiSummary}\n用户反馈：${userFeedback}`
      }]
    });

    return completion.choices[0].message.content.split('\n');
  } catch (error) {
    console.error('分析反馈时出错:', error);
    return [];
  }
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});