import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { MANUAL_COINGECKO_LIST, MANUAL_COINGECKO_MAP } from "./GeckoList";

export const getBalance = async (publicKey: string, connection: Connection) => {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance;
};

export const getLastXTransactions = async (
  publicKey: string,
  connection: Connection,
  limit: number,
) => {
  const transactions = await connection.getSignaturesForAddress(
    new PublicKey(publicKey),
    {
      limit,
    },
  );
  return transactions;
};


export const getPrice= async (name:string) => {
  const options = {
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/simple/price',
    params: {ids: name, vs_currencies: 'usd'},
    headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-JLgw31n1yTfXkfDqFCT3maHL'}
  };
  
  const response = await axios.request(options)
  const data = response.data
  return data[name].usd
}

// Function to lookup ID using the manual map
// New lookup function for the list structure
export function getCoinGeckoId(userInput: string): string | null {
  const inputLower = userInput.toLowerCase().trim();
  if (!inputLower) return null;

  // Iterate through the list
  for (const entry of MANUAL_COINGECKO_LIST) {
    // Check if the user input exists in the aliases array
    if (entry.aliases.includes(inputLower)) {
      return entry.id; // Return the ID if found
    }
  }

  return null; // Return null if no match is found
}