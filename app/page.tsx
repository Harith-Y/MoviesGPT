"use client"

import Image from "next/image"
import MoviesGPTLogo from "./assets/moviesGPTLogo.png"
import Bubble from "./components/Bubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"
import LoadingBubble from "./components/LoadingBubble"

import { useChat } from "ai/react"
import { Message } from "ai"

const Home = () => {
    const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
    const noMessages = !messages || messages.length === 0

    const handlePrompt = (promptText) => {
        const msg: Message = {
            id: crypto.randomUUID(),
            content: promptText,
            role: "user"
        }
        append(msg)
    }
    return (
        <main suppressHydrationWarning={true}>
            <Image src={MoviesGPTLogo} width="250" alt="MoviesGPT Logo"/>
            <section className={noMessages ? "": "populated"}>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            The Ultimate place for Movies fans!
                            Ask any details about the latest movies!
                            We hope you enjoy!
                        </p>
                        <br/>
                        <PromptSuggestionsRow onPromptClick={handlePrompt}/>
                    </>
                ) : (
                    <>
                        {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}
                        {isLoading && <LoadingBubble/>}
                    </>
                )}
            </section>
            <form onSubmit={handleSubmit}>
                <input
                    className="question-box"
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Ask me something..."
                    disabled={isLoading}
                />
                <input type="submit" disabled={isLoading}/>
            </form>
        </main>
    )
}

export default Home