"use client"

import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Message, SavedWallet } from "../utils/types"; // Import SavedWallet
import triggerCommand from "./commands";
import { GPTResponse } from "./llm";

export default async function AIResponse(
  chatHistory: Message[],
  publicKey: PublicKey,
  wallet: WalletContextState,
  connection: Connection,
) {

  // --- Get saved wallets from localStorage ---
  let savedWallets: SavedWallet[] = [];
  if (typeof window !== 'undefined' && window.localStorage) {
      const storedWallets = localStorage.getItem("savedWallets");
      if (storedWallets) {
          try {
              savedWallets = JSON.parse(storedWallets);
          } catch (e) {
              console.error("Failed to parse saved wallets from localStorage", e);
              // Handle error appropriately, maybe clear corrupted data
          }
      }
  }
  // --- ---

  // Pass savedWallets to GPTResponse
  const functionCall = await GPTResponse(chatHistory, savedWallets); 

  // Check if functionCall and arguments exist before parsing
  if (!functionCall?.arguments) {
      console.error("LLM did not return a function call or arguments.");
      // Handle error appropriately, maybe return a default message
      return { message: "Sorry, I encountered an error. Please try again." }; 
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(functionCall.arguments);
  } catch (e) {
    console.error("Failed to parse LLM function call arguments:", e);
    console.error("Raw arguments:", functionCall.arguments);
    return { message: "Sorry, I received an invalid response structure. Please try rephrasing." };
  }


  const data = await triggerCommand(
    parsedResponse,
    wallet,
    connection,
  );
  console.log("data",data)
  return data;
}