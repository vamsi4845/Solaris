"use client" // This is correct as we access localStorage

import { PublicKey } from "@solana/web3.js";
import { Message } from "../utils/types";
import triggerCommand from "./commands";
import { GPTResponse } from "./llm"; // Ensure this import points to the updated llm.ts
// import { getLastXTransactions } from "@/utils/helper"; // Import commented out if not used

// Define SavedWallet interface matching localStorage structure
interface SavedWallet {
  id: string;
  name: string;
  address: string;
}

export default async function AIResponse(
  chatHistory: Message[],
  publicKey: PublicKey,
  sendTransaction: any, // Consider adding specific types if possible
  connection: any,       // Consider adding specific types if possible
) {

  // 1. Read saved wallets from localStorage
  let walletsFromStorage: SavedWallet[] = [];
  try {
    // localStorage is only available in the browser context
    if (typeof window !== 'undefined') {
        const storedWallets = localStorage.getItem("savedWallets");
        if (storedWallets) {
          walletsFromStorage = JSON.parse(storedWallets);
        }
    }
  } catch (error) {
    console.error("Failed to parse saved wallets from localStorage:", error);
    // Decide how to handle the error, e.g., proceed without wallet context
  }

  // 2. Call GPTResponse, passing the chat history AND the retrieved wallets
  const response = await GPTResponse(chatHistory, walletsFromStorage); // Pass wallets here

  // Ensure response and arguments exist before parsing
  if (!response?.arguments) {
      console.error("LLM response or arguments missing");
      // Handle error appropriately, maybe return an error message
      return { type: 'error', message: 'Sorry, I could not process your request properly.' };
  }

  let parsedResponse;
  try {
      parsedResponse = JSON.parse(response.arguments);
  } catch (error) {
      console.error("Failed to parse LLM response arguments:", error, response.arguments);
      // Handle JSON parse error
      return { type: 'error', message: 'Sorry, I received an invalid response. Please try again.' };
  }

  // 3. Call triggerCommand with the parsed response
  // Note: triggerCommand might also need adjustments if it relies on recipientName etc.
  // which is now handled directly by resolving to toPublicKey
  const data = await triggerCommand(
    parsedResponse,
    publicKey,
    connection,
    sendTransaction // Pass sendTransaction if triggerCommand needs it
  );

  return data;
}