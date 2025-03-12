const { OpenAI } = require('openai');
const tencentcloud = require('tencentcloud-sdk-nodejs');

class SummaryService {
  constructor(provider) {
    this.provider = provider;
    this.initializeClient();
  }

  initializeClient() {
    switch (this.provider) {
      case 'gpt':
        this.client = new OpenAI();
        break;
      case 'deepseek':
        const NlpClient = tencentcloud.nlp.v20190408.Client;
        const clientConfig = {
          credential: {
            secretId: process.env.TENCENT_SECRET_ID,
            secretKey: process.env.TENCENT_SECRET_KEY,
          },
          region: 'ap-guangzhou',
          profile: {
            httpProfile: {
              endpoint: 'nlp.tencentcloudapi.com',
            },
          },
        };
        this.client = new NlpClient(clientConfig);
        break;
      default:
        throw new Error('不支持的摘要服务提供商');
    }
  }

  async generateSummary(text, options = {}) {
    try {
      switch (this.provider) {
        case 'gpt':
          return await this.gptSummarize(text, options);
        case 'deepseek':
          return await this.deepseekSummarize(text, options);
        default:
          throw new Error('不支持的摘要服务提供商');
      }
    } catch (error) {
      console.error(`${this.provider} 生成摘要失败:`, error);
      throw error;
    }
  }

  async gptSummarize(text, options) {
    const completion = await this.client.chat.completions.create({
      model: options.model || 'gpt-4',
      messages: [{
        role: 'system',
        content: '你是一个专业的文本摘要助手，请根据输入的文本生成简洁明了的摘要。'
      }, {
        role: 'user',
        content: text
      }]
    });

    return completion.choices[0].message.content;
  }

  async deepseekSummarize(text, options) {
    const params = {
      Text: text,
      Length: options.length || 200
    };

    const response = await this.client.AutoSummarization(params);
    return response.Summary;
  }
}

module.exports = SummaryService;