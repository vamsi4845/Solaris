# Simple Solana AI Agent

This project is a basic AI agent designed to interact with the Solana blockchain using natural language commands.

## Features

- Execute simple Solana transactions via AI prompts.
- Check wallet balance.
- Retrieve wallet address.

## Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file with your Solana private key, RPC URL, and OpenAI API key.
    ```plaintext
    SOLANA_PRIVATE_KEY="YOUR_PRIVATE_KEY"
    SOLANA_RPC_URL="YOUR_RPC_URL"
    OPENAI_API_KEY="YOUR_OPENAI_KEY"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Access the agent at `http://localhost:3000`.

## Disclaimer

This is a simple example project. Use with caution, especially with real private keys.
