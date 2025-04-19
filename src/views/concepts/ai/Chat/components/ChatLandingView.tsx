import useChatSend from '../hooks/useChatSend'
import {
    PiLightbulbDuotone,
    PiBookOpenTextDuotone,
    PiCompassDuotone,
    PiCodeDuotone,
} from 'react-icons/pi'
import type { ReactNode } from 'react'

type PromptType = 'idea' | 'guide' | 'writing' | 'coding'

const suggeustionIcon: Record<PromptType, ReactNode> = {
    idea: <PiLightbulbDuotone className="text-blue-500" />,
    guide: <PiCompassDuotone className="text-emerald-500" />,
    writing: <PiBookOpenTextDuotone className="text-amber-500" />,
    coding: <PiCodeDuotone className="text-indigo-500" />,
}

const promptSuggestion: {
    title: string
    prompt: string
    type: PromptType
}[] = [
        {
            title: 'Explain how mobile networks handle congestion',
            prompt: `Explain how mobile networks manage congestion during peak hours, and provide examples of techniques used to optimize performance.`,
            type: 'guide',
        },
        {
            title: 'Draft a sales pitch for Djezzy’s 5G services',
            prompt: `Create a compelling sales pitch for Djezzy's 5G services, highlighting its benefits for businesses and individual users.`,
            type: 'writing',
        },
        {
            title: 'Provide innovative ideas for improving network coverage',
            prompt: `Suggest innovative ideas to improve mobile network coverage in rural and urban areas, considering cost-effectiveness and scalability.`,
            type: 'idea',
        },
        {
            title: 'Write code to simulate network latency',
            prompt: `Write a Python script to simulate network latency in a mobile network. Include options for different latency scenarios and edge cases.`,
            type: 'coding',
        },
    ]
const ChatLandingView = () => {
    const { handleSend } = useChatSend()

    return (
        <div className="max-w-[900px] w-full mx-auto mt-20">
            <div>
                <div className="heading-text text-4xl leading-snug">
                    <span className="font-semibold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent text-5xl">
                        Hello, there
                    </span>
                    <br />
                    <span>How can I help you today?</span>
                </div>
                <div className="mt-8 grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {promptSuggestion.map((suggestion) => (
                        <div
                            key={suggestion.title}
                            className="flex flex-col gap-4 justify-between rounded-xl bg-red-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600 p-5 min-h-40 2xl:min-h-60 cursor-pointer"
                            role="button"
                            onClick={() => handleSend(suggestion.title)}
                        >
                            <h6 className="font-normal">{suggestion.title}</h6>
                            <div>
                                <div className="bg-white dark:bg-gray-800 rounded-full p-2 inline-flex">
                                    <span className="text-2xl">
                                        {suggeustionIcon[suggestion.type]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatLandingView
