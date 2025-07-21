import { DataAPIClient} from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
import { RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import { OpenAI } from "openai";
import "dotenv/config"