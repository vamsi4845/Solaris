"use server";

import { SYSTEM_PROMPT_BASE } from "@/utils/config";
import OpenAI from "openai";
import { Message, SavedWallet } from "../utils/types";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export async function GPTResponse(chatHistory: Message[], savedWallets: SavedWallet[]) {
  // Format the wallet list nicely for the prompt
  const walletListString = savedWallets.length > 0 
    ? savedWallets.map(w => `- Name: ${w.name}, Address: ${w.address}`).join('\n')
    : 'No wallets saved yet.';

  // Construct the final system prompt
  const dynamicSystemPrompt = SYSTEM_PROMPT_BASE.replace('{walletList}', walletListString);

  // Prepend the dynamic system prompt to the chat history
  const messagesWithSystemPrompt: Message[] = [
    { role: "system", content: dynamicSystemPrompt }, 
    ...chatHistory
  ];
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messagesWithSystemPrompt,
    function_call: { name: "get_action_data" },
    functions: [
      {
        name: "get_action_data",
        description: "Get JSON object of performed action",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: [
                "faucet",
                "send",
                "buy",
                "swap",
                "check_balance",
                "get_address",
                "create_token",
                "transaction_status",
                "recent_transaction",
                "launch_nft",
                "pump_fun",
                "price",
                "not_found",
                "domain",
                "stake",
              ],
            },
            amount: {
              type: "number",
              description: "Amount to send or swap",
            },
            toPublicKey: {
              type: "string",
              description: "Recipient's public key (resolved from name if applicable)",
            },
            fromToken: {
              type: "string",
              description: "Token to swap from",
            },
            toToken: {
              type: "string",
              description: "Token to swap to",
            },
            tokenName: {
              type: "string",
              description: "Token name",
            },
            tokenSymbol: {
              type: "string",
              description: "Token symbol",
            },
            tokenDecimals: {
              type: "number",
              description: "Token decimals",
            },
            nftName: { 
              type: "string",
              description: "NFT collection name",
            },
            uri: {
              type: "string",
              description: "Token image URI",
            },
            mintAmount: {
              type: "number",
              description: "Amount to mint",
            },
            message: {
              type: "string",
              description: "Response text for user",
            },
            domainName: {
              type: "string",
              description: "Domain name to register",
            },
            misc: {
              type: "boolean",
              description: "Miscellaneous action",
            },
          },
          required: ["action", "message"],
        },
      },
    ],
  });
  return response.choices[0].message.function_call;
}
