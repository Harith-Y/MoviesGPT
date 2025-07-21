"use client"

import Image from "next/image"
import MoviesGPTLogo from "./assets/moviesGPTLogo.png"

import { useChat } from "ai/react"
import { Message } from "ai"

const Home = () => {
    const {append, isLoading, messages, input, handleInputChange, handleSubmit} = useChat()
    const noMessages = true
    return (
        <main>
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
                        {/* <PromptSuggestionsRow/> */}
                    </>
                ) : (
                    <>
                        {/* Map messages onto text bubble */}
                        {/*<LoadingBubble/>*/}
                    </>
                )}

            </section>
            <form onSubmit={handleSubmit}>
                <input
                    className="question-box"
                    onChange={handleInputChange}
                    value={input}
                    placeholder="Ask me something..."
                />
                <input type="submit"/>
            </form>
        </main>
    )
}

export default Home