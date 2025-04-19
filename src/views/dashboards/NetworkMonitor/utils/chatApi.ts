import { Tower } from '../types';

// Using the same API KEY and URL as the main Chat component
const API_KEY = 'AIzaSyBpFYtxYTimzvs9inh3Qv4cqt06ns0XhF4';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
    candidates?: {
        content?: {
            parts?: {
                text?: string
            }[]
        }
    }[]
}

export interface Message {
    role: 'user' | 'model';
    content: string;
}

/**
 * Query the Gemini API with network tower monitoring context
 */
export async function queryNetworkMonitorAI(
    prompt: string,
    towers: Tower[],
    conversationHistory: Message[] = []
): Promise<string> {
    if (!API_KEY) {
        console.error('Gemini API key is missing');
        return 'Sorry, I cannot respond at the moment due to configuration issues.';
    }

    try {
        // Generate network monitoring context
        const operationalTowers = towers.filter(t => t.status === 'operational').length;
        const atRiskTowers = towers.filter(t => t.status === 'at-risk').length;
        const failedTowers = towers.filter(t => t.status === 'failed').length;

        // Get problematic towers for better context
        const highRiskTowers = towers
            .filter(t => t.failureProbability > 50 || t.status !== 'operational')
            .slice(0, 5)  // Limit to 5 towers to avoid token limits
            .map(t => ({
                id: t.id,
                name: t.name,
                location: t.location,
                status: t.status,
                signalStrength: t.signalStrength,
                failureProbability: t.failureProbability,
                lastFailure: t.failureHistory[0]?.reason || 'None'
            }));

        // Calculate system health
        const avgSignalStrength = towers.reduce((sum, t) => sum + t.signalStrength, 0) / towers.length;
        const systemHealth = Math.floor(avgSignalStrength - (failedTowers * 3));

        // Format conversation history for the API
        const formattedHistory = conversationHistory.map(msg => ({
            role: msg.role === 'model' ? 'MODEL' : 'USER',
            parts: [{ text: msg.content }]
        }));

        // Add system prompt at the beginning with rich tower context
        const systemContext = {
            role: 'USER',
            parts: [{
                text: `You are NetTowerGuard AI, the network tower monitoring assistant for Djezzy telecommunications company.
                
Current Network Status:
- Total towers: ${towers.length}
- Operational: ${operationalTowers} towers (${Math.round((operationalTowers / towers.length) * 100)}%)
- At Risk: ${atRiskTowers} towers (${Math.round((atRiskTowers / towers.length) * 100)}%)
- Failed: ${failedTowers} towers (${Math.round((failedTowers / towers.length) * 100)}%)
- System Health: ${systemHealth}%
- Average Signal Strength: ${avgSignalStrength.toFixed(1)}%

High Priority Towers (requiring attention):
${highRiskTowers.map(t => `- ${t.name} (${t.location}): Status ${t.status}, Risk ${t.failureProbability}%, Signal ${t.signalStrength}%, Last Issue: ${t.lastFailure}`).join('\n')}

Your role:
1. Provide technical analysis of tower network status
2. Recommend maintenance priorities
3. Identify potential failure patterns
4. Offer troubleshooting steps for tower issues
5. Analyze risk and provide actionable insights

Reply professionally and concisely as a telecommunications specialist. Focus on technical accuracy and actionable recommendations.

User query: ${prompt}`
            }]
        };

        // Combine system prompt with conversation history for context
        const contents = [systemContext, ...formattedHistory.slice(-5)]; // Limit history to last 5 messages

        // Call the Gemini API
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.3,  // Lower temperature for more precise technical responses
                    maxOutputTokens: 1024,
                    topK: 40,
                    topP: 0.95,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(
                `API request failed with status: ${response.status} - ${await response.text()}`
            );
        }

        const data = (await response.json()) as GeminiResponse;

        // Extract the text from the response
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            return text;
        } else {
            throw new Error('Unexpected response format from Gemini API');
        }
    } catch (error) {
        console.error('Error querying Network Monitor AI:', error);
        return 'I encountered an error processing your network monitoring request. Please try again later.';
    }
}