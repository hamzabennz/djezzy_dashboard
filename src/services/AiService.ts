import ApiService from './ApiService'
import {
    generateContent,
    generateContentWithHistory,
} from '../views/concepts/ai/Chat/utils/geminiApi'
import type {
    PostAiChatResponse,
    Conversation,
} from '../views/concepts/ai/Chat/types'
import dayjs from 'dayjs'
import uniqueId from 'lodash/uniqueId'

export async function apiPostChat<T>({
    prompt,
    attachments,
    history,
}: {
    prompt: string
    attachments?: File[]
    history?: Conversation[]
}): Promise<PostAiChatResponse> {
    try {
        let content = ''

        if (history && history.length > 0) {
            // Format history for Gemini
            const messages = history.map((msg) => ({
                role: msg.sender.id === 'ai' ? 'model' : 'user',
                parts: msg.content || '',
            }))

            // Add current message
            messages.push({
                role: 'user',
                parts: prompt,
            })

            content = await generateContentWithHistory(messages)
        } else {
            content = await generateContent(prompt)
        }

        return {
            id: uniqueId('gemini-response-'),
            choices: [
                {
                    finish_reason: 'stop',
                    index: 0,
                    message: {
                        content: content,
                        role: 'assistant',
                    },
                },
            ],
            created: dayjs().unix(),
            model: 'gemini-pro',
        }
    } catch (error) {
        console.error('Error in apiPostChat:', error)
        throw error
    }
}

// Keep other methods intact
export async function apiGetChatHistory<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/ai/chat/history',
        method: 'get',
    })
}

export async function apiGetImages<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/ai/images',
        method: 'get',
        params,
    })
}

export async function apiPostImages<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/ai/images',
        method: 'post',
        data,
    })
}
