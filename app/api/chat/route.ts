import OpenAI from "openai"

import {DataAPIClient} from "@datastax/astra-db-ts";

interface EmbeddingExtraBody {
    input_type?: "query" | "document";
    truncate?: "NONE" | "START" | "END";
}

const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENROUTER_API_KEY,
    NVIDIA_API_KEY
} = process.env

const embedClient = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: NVIDIA_API_KEY
});

const chatClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const database = client.db(ASTRA_DB_API_ENDPOINT);

export async function POST(req: Request) {
    try {
        const {messages} = await req.json()
        const latestMessage = messages[messages?.length - 1]?.content

        let docContext = ""

        const embedding = await embedClient.embeddings.create({
            model: "nvidia/nv-embedqa-e5-v5",
            input: latestMessage,
            encoding_format: "float",
            ...({input_type: "query", truncate: "NONE"} as EmbeddingExtraBody)
        })

        try {
            const collection = await database.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null, {
                sort: {
                    $vector: embedding.data[0].embedding,
                },
                limit: 10
            })

            const documents = await cursor.toArray()
            const docsMap = documents?.map(doc => doc.text)
            docContext = JSON.stringify(docsMap)

        } catch (error) {
            console.log("Error querying db...")
        }

        const template = {
            role: "system",
            content: `You are an AI assistant who knows everything about Movies.
            Use the below context to augment what you know about Movies.
            The context will provide you with the most recent page data from wikipedia.
            If the context doesn't include the information you need answer absed on your
            existing knowledge and don't mention the source of your information or
            what the context does or doesn't include.
            Format responses using markdown where applicable and don't return
            images.
        -----------------
        START CONTEXT
        ${docContext}
        END CONTEXT
        -----------------
        QUESTION: ${latestMessage}
        -----------------
        `
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "deepseek/deepseek-v3-base:free",
              messages: [template, ...messages],
              stream: true,
            }),
          });
        
          // Return the streaming response directly
          return new Response(response.body, {
            headers: {
              "Content-Type": "text/event-stream", // or "application/json" if chunked JSON
              "Cache-Control": "no-cache",
              "Connection": "keep-alive",
            },
          });
    
        } catch (err) {
        throw err
    }
}

