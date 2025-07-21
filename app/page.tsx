"use client"

import Image from "next/image"
import MoviesGPTLogo from "./assets/moviesGPTLogo.png"

import { useChat } from "ai/react"
import { Message } from "ai"

const Home = () => {

    const noMessages = true
    return (
        <main>
            <Image src={MoviesGPTLogo} width="250" alt="MoviesGPT Logo"/>
            <section>
                {noMessages ? (
                    <>
                        <p className="starter-text">
                            The Ultimate place for Movies fans!
                            Ask any details about the latest movies!
                            We hope you enjoy!
                        </p>
                        <br/>
                        {/* <PromptSuggestionRow/> */}
                    </>
                ) : (
                    <>
                        {/* Map messages onto text bubble */}
                        {/*<LoadingBubble/>*/}
                    </>
                )}
            </section>
        </main>
    )
}

export default Home