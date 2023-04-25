import { createReadStream } from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import config from 'config'

class OpenAI {
  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_TOKEN || config.get('OPENAI_TOKEN'),
    })
    this.openai = new OpenAIApi(configuration)
  }

  roles = {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      })
      return response.data.choices[0].message
    } catch (e) {
      console.log('Error while GPT chat', e.message)
    }
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        'whisper-1'
      )
      return response.data.text
    } catch (e) {
      console.log('Error while transcription', e.message)
    }
  }
}

export const openai = new OpenAI()
