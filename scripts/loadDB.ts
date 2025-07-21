import { DataAPIClient} from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
import { RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { OpenAI } from "openai";
import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

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

const movieData = [
    'https://en.wikipedia.org/wiki/List_of_Hindi_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Telugu_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Bengali_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Gujarati_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Kannada_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Malayalam_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Marathi_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Punjabi_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Tamil_films_of_2025',
    'https://en.wikipedia.org/wiki/List_of_Tulu_films_of_2025',
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const database = client.db(ASTRA_DB_API_ENDPOINT);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})
// // Define the type for the collection
// interface User {
//     name: string;
//     age?: number;
// }

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    const res = await database.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1024,
            metric: similarityMetric,
        },
        keyspace: ASTRA_DB_NAMESPACE
    })
    console.log(res)
};

const loadSampleData = async () => {
    const collection = await database.collection(ASTRA_DB_COLLECTION)
    for await (const url of movieData) {
        console.log(url + ":\n");
        const content = await scrapePage(url)
        const chunks = await splitter.splitText(content)

        for await (const chunk of chunks) {
            const response = await embedClient.embeddings.create({
                model: "nvidia/nv-embedqa-e5-v5",
                input: chunk,
                encoding_format: "float",
                ...({input_type: "query", truncate: "NONE"} as EmbeddingExtraBody)
            })

            const vector = response.data[0].embedding
            console.log(response)
            const res = await collection.insertOne({
                $vector: vector,
                test: chunk
            })

            console.log(res)
        }
    }
}

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: 'new'
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())