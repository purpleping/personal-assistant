const { OpenAI } = require('openai');

class LearningService {
  constructor() {
    this.openai = new OpenAI();
    this.summaryPatterns = new Map();
  }

  async analyzeFeedbackDifference(aiSummary, userFeedback) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "分析AI生成的摘要和用户修改后的摘要之间的差异，识别出用户的修改模式和偏好。请从以下几个方面分析：\n1. 内容长度的调整\n2. 关键信息的保留与删除\n3. 语言风格的变化\n4. 结构组织的改变"
        }, {
          role: "user",
          content: `原始摘要：${aiSummary}\n用户修改：${userFeedback}`
        }]
      });

      const analysis = JSON.parse(completion.choices[0].message.content);
      await this.updateSummaryPatterns(analysis);
      return analysis;
    } catch (error) {
      console.error('分析反馈差异时出错:', error);
      throw error;
    }
  }

  async updateSummaryPatterns(analysis) {
    // 更新摘要生成模式
    const { lengthPreference, keyPointsRetention, stylePreference, structurePreference } = analysis;
    
    this.summaryPatterns.set('length', lengthPreference);
    this.summaryPatterns.set('keyPoints', keyPointsRetention);
    this.summaryPatterns.set('style', stylePreference);
    this.summaryPatterns.set('structure', structurePreference);
  }

  async generateOptimizedPrompt(text) {
    // 根据学习到的模式生成优化后的提示词
    const length = this.summaryPatterns.get('length') || '中等长度';
    const keyPoints = this.summaryPatterns.get('keyPoints') || '保留所有关键信息';
    const style = this.summaryPatterns.get('style') || '正式';
    const structure = this.summaryPatterns.get('structure') || '段落式';

    return `请生成一个${length}的摘要，${keyPoints}。使用${style}的语言风格，采用${structure}的结构组织。\n\n原文：${text}`;
  }

  async getSummaryPatterns() {
    // 获取当前的摘要生成模式
    return Object.fromEntries(this.summaryPatterns);
  }
}

module.exports = LearningService;