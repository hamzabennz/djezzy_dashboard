import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, CornerDownLeft, Loader } from 'lucide-react'
import { useTower } from '../context/TowerContext'

// Import the API utils
import { queryNetworkMonitorAI, Message } from '../utils/chatApi'
import ReactMarkdown from 'react-markdown' // Add this import

// Add this formatting function before the component
const formatMessage = (content: string) => {
    // Remove extra newlines and spaces
    return content.trim().replace(/\n{3,}/g, '\n\n')
}

const Chatbot: React.FC = () => {
    const { towers } = useTower()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content:
                "Hello! I'm NetTowerGuard AI. How can I help you with tower monitoring today?",
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to the bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!inputValue.trim()) return

        // Add user message
        const userMessage: Message = {
            role: 'user',
            content: inputValue,
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Get response from AI with conversation history for context
            const aiResponse = await queryNetworkMonitorAI(
                inputValue,
                towers,
                messages,
            )

            // Add AI response to the messages
            setMessages((prev) => [
                ...prev,
                { role: 'model', content: aiResponse },
            ])
        } catch (error) {
            console.error('Error getting AI response:', error)
            setMessages((prev) => [
                ...prev,
                {
                    role: 'model',
                    content:
                        'Sorry, I encountered an error processing your request. Please try again.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    // Handle quick action suggestions
    const handleSuggestion = (suggestion: string) => {
        setInputValue(suggestion)
    }

    // Suggested prompts
    const suggestions = [
        'Summarize the current network status',
        'Which towers need urgent maintenance?',
        'Predict potential failures in the next 24 hours',
        "What's causing most tower failures?",
    ]

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
                            NetTowerGuard AI
                        </h3>
                        <button
                            className="text-white/80 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Updated Messages section */}
                    <div className="p-3 flex-1 overflow-y-auto max-h-96 flex flex-col gap-3">
                        {messages.map((message, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg text-sm ${
                                    message.role === 'user'
                                        ? 'bg-primary text-white ml-auto'
                                        : 'bg-gray-100 text-gray-800 mr-auto'
                                } max-w-[85%]`}
                            >
                                <ReactMarkdown
                                    className={`prose ${
                                        message.role === 'user'
                                            ? 'prose-invert'
                                            : 'prose-gray'
                                    } max-w-none text-sm`}
                                    components={{
                                        // Style for code blocks
                                        code: ({
                                            node,
                                            inline,
                                            className,
                                            children,
                                            ...props
                                        }) => (
                                            <code
                                                className={`${className} ${
                                                    inline
                                                        ? 'bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded'
                                                        : 'block bg-gray-800 text-gray-100 p-2 rounded-md'
                                                }`}
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        ),
                                        // Style for lists
                                        ul: ({ children }) => (
                                            <ul className="list-disc pl-4 my-2">
                                                {children}
                                            </ul>
                                        ),
                                        // Style for links
                                        a: ({ children, href }) => (
                                            <a
                                                href={href}
                                                className="text-blue-500 hover:underline"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {children}
                                            </a>
                                        ),
                                    }}
                                >
                                    {formatMessage(message.content)}
                                </ReactMarkdown>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 text-sm mr-auto">
                                <Loader className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-gray-800">
                                    Processing your request...
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggested queries - shown when conversation is new */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="px-3 pb-2">
                            <p className="text-xs text-gray-500 mb-2">
                                Try asking:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion, i) => (
                                    <button
                                        key={i}
                                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                                        onClick={() =>
                                            handleSuggestion(suggestion)
                                        }
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form
                        className="p-3 border-t border-gray-200 flex gap-2"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Ask about tower monitoring..."
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
