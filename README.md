# MoviesGPT

MoviesGPT is an AI-powered assistant that knows everything about movies! Ask it anything about the latest movies, and it will answer using up-to-date information from Wikipedia and its own knowledge base.
#### Refer the [Blog](https://medium.com/@yharith16/rag-chatbot-4fe7081770f0)
## Features
- Chat with an AI that specializes in movies
- Uses the latest Wikipedia data for movie information
- Supports multiple Indian languages and film industries
- Fast, streaming responses

## How It Works
- Scrapes Wikipedia pages for the latest movie lists
- Splits and embeds the content using NVIDIA's embedding model
- Stores and retrieves data from AstraDB
- Answers your questions using OpenRouter's chat models, augmented with the latest context

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- AstraDB account and API credentials
- NVIDIA and OpenRouter API keys

### Installation
1. Clone this repository:
   ```bash
   git clone <repo-url>
   cd nextjs-moviesgpt
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the root directory and add the following variables:
   ```env
   ASTRA_DB_NAMESPACE=your_namespace
   ASTRA_DB_COLLECTION=your_collection
   ASTRA_DB_API_ENDPOINT=your_db_endpoint
   ASTRA_DB_APPLICATION_TOKEN=your_db_token
   OPENROUTER_API_KEY=your_openrouter_key
   NVIDIA_API_KEY=your_nvidia_key
   ```

### Load Movie Data
To scrape and load the latest movie data into your database, run:
```bash
npm run seed
```

### Start the App
To start the Next.js app:
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Type your movie-related question in the chat box and get instant answers!
- Try prompts like:
  - "What are the latest Hindi movies?"
  - "List upcoming Tamil films in 2025."
  - "Who starred in the latest Bengali movies?"

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
