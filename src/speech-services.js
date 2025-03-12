const { SpeechClient } = require('@google-cloud/speech');
const { OpenAI } = require('openai');

class SpeechService {
  constructor(provider) {
    this.provider = provider;
    this.initializeClient();
  }

  initializeClient() {
    switch (this.provider) {
      case 'google':
        this.client = new SpeechClient();
        break;
      case 'whisper':
        this.client = new OpenAI();
        break;
      default:
        throw new Error('不支持的语音识别服务提供商');
    }
  }

  async transcribe(audioBuffer, options = {}) {
    try {
      switch (this.provider) {
        case 'google':
          return await this.googleTranscribe(audioBuffer, options);
        case 'whisper':
          return await this.whisperTranscribe(audioBuffer, options);
        default:
          throw new Error('不支持的语音识别服务提供商');
      }
    } catch (error) {
      console.error(`${this.provider} 语音识别失败:`, error);
      throw error;
    }
  }

  async googleTranscribe(audioBuffer, options) {
    const audioBytes = audioBuffer.toString('base64');
    const config = {
      encoding: options.encoding || 'LINEAR16',
      sampleRateHertz: options.sampleRateHertz || 16000,
      languageCode: options.languageCode || 'zh-CN',
    };

    const request = {
      audio: { content: audioBytes },
      config: config,
    };

    const [response] = await this.client.recognize(request);
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  }

  async whisperTranscribe(audioBuffer, options) {
    const response = await this.client.audio.transcriptions.create({
      file: audioBuffer,
      model: 'whisper-1',
      language: options.languageCode || 'zh',
      response_format: 'text'
    });

    return response;
  }
}

module.exports = SpeechService;