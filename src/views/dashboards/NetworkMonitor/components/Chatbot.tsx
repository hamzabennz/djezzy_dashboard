import React, { useState } from 'react'
import { MessageSquare, X, CornerDownLeft, Loader } from 'lucide-react'

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<
        { type: 'user' | 'bot'; content: string }[]
    >([
        {
            type: 'bot',
            content:
                "Hello! I'm your AI assistant. How can I help you with tower monitoring today?",
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        // Add user message
        setMessages((prev) => [...prev, { type: 'user', content: inputValue }])
        setInputValue('')

        // Simulate AI response
        setIsLoading(true)
        setTimeout(() => {
            // Example response
            const responses = [
                "I've analyzed the issue with Tower #4872. The failure is likely due to a power supply malfunction. Please dispatch a maintenance team for inspection. Estimated downtime: 3-4 hours.",

                'Based on the data, I recommend immediate maintenance for towers in the northwest sector. Weather conditions are deteriorating, which could affect signal strength by up to 35%.',

                "Tower #3956 is showing early warning signs of failure. The probability has increased to 78% in the last hour. Root cause appears to be an antenna alignment issue following yesterday's storm.",

                "I've scheduled diagnostic tests for all at-risk towers. Results will be available in approximately 20 minutes. Would you like to prioritize any specific region?",
            ]

            setMessages((prev) => [
                ...prev,
                {
                    type: 'bot',
                    content:
                        responses[Math.floor(Math.random() * responses.length)],
                },
            ])
            setIsLoading(false)
        }, 1500)
    }

    return (
        <>
            {/* Chatbot toggle button */}
            {!isOpen && (
                <button
                    className="fixed bottom-6 right-6 bg-primary hover:bg-primary-deep text-white rounded-full p-3 shadow-lg transition-all duration-200 flex items-center"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            )}

            {/* Chatbot interface */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-xl w-80 sm:w-96 flex flex-col transition-transform duration-300 ease-in-out">
                    {/* Header */}
                    <div className="bg-primary p-3 rounded-t-lg flex items-center justify-between">
                        <h3 className="font-medium text-white">
                            Network AI Assistant
                        </h3>
                        <button
                            className="text-white/80 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="p-3 flex-1 overflow-y-auto max-h-96 flex flex-col gap-3">
                        {messages.map((message, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg text-sm ${message.type === 'user'
                                    ? 'bg-primary text-white ml-auto'
                                    : 'bg-gray-100 text-gray-800 mr-auto'
                                    } max-w-[80%]`}
                            >
                                {message.content}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 text-sm mr-auto">
                                <Loader className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-gray-800">Processing your request...</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form
                        className="p-3 border-t border-gray-200 flex gap-2"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Report an issue or ask for help..."
                            className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-deep rounded-lg p-2 text-white disabled:opacity-50"
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <CornerDownLeft className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Chatbot
