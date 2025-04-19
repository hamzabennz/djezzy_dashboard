/**
 * Utility for interacting with the Google Gemini API
 */

// Load API key from environment variables
const API_KEY = 'AIzaSyBpFYtxYTimzvs9inh3Qv4cqt06ns0XhF4'
if (!API_KEY) {
    console.error('GEMINI_API_KEY is not set in the environment variables')
}

// API endpoints for gemini-2.0-flash model
const API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Type definitions for API responses
interface GeminiResponse {
    candidates?: {
        content?: {
            parts?: {
                text?: string
            }[]
        }
    }[]
}

interface Message {
    role: string
    parts: string
}

/**
 * Send a prompt to the Gemini API and get a response
 */
export async function queryGeminiApi(prompt: string): Promise<string> {
    if (!API_KEY) {
        console.error('Gemini API key is missing')
        return 'Sorry, I cannot respond at the moment due to configuration issues.'
    }

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a Network Tower Assistant for Djezzy, a telecommunications company. 
                      You help diagnose network tower issues and provide technical information.
                      Keep responses concise and technical, focused on telecom network infrastructure.
                      User query: ${prompt}`,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(
                `API request failed with status: ${response.status} - ${await response.text()}`,
            )
        }

        const data = (await response.json()) as GeminiResponse

        // Extract the text from the response
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
            return text
        } else {
            throw new Error('Unexpected response format from Gemini API')
        }
    } catch (error) {
        console.error('Error querying Gemini API:', error)
        return 'I encountered an error processing your request. Please try again later.'
    }
}

/**
 * Send a prompt to the Gemini API and get a response
 * This is used by AiService.ts
 */
export async function generateContent(prompt: string): Promise<string> {
    return queryGeminiApi(prompt)
}

/**
 * Send a conversation history to the Gemini API and get a response
 * This is used by AiService.ts
 */
export async function generateContentWithHistory(
    messages: Array<Message>,
): Promise<string> {
    if (!API_KEY) {
        console.error('Gemini API key is missing')
        return 'Sorry, I cannot respond at the moment due to configuration issues.'
    }

    try {
        // Format the conversation history for the API
        const contents = messages.map((msg) => ({
            role: msg.role === 'model' ? 'MODEL' : 'USER',
            parts: [{ text: msg.parts }],
        }))

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(
                `API request failed with status: ${response.status} - ${await response.text()}`,
            )
        }

        const data = (await response.json()) as GeminiResponse

        // Extract the text from the response with proper type checking
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
            return text
        } else {
            throw new Error('Unexpected response format from Gemini API')
        }
    } catch (error) {
        console.error(
            'Error querying Gemini API with history:',
            error instanceof Error ? error.message : String(error),
        )
        return 'I encountered an error processing your conversation. Please try again later.'
    }
}
