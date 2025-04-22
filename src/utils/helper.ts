import { Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { MANUAL_COINGECKO_LIST} from "./GeckoList";
import { NextResponse } from 'next/server';


const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens';
const JUPITER_TOKEN_LIST_API = 'https://token.jup.ag/all';

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



async function getTokenMetadata(mint: string): Promise<{ symbol: string; name: string }> {
  try {
    const response = await axios.get(JUPITER_TOKEN_LIST_API);
    const token = response.data.find((t: any) => t.address === mint);
    return {
      symbol: token?.symbol || 'Unknown',
      name: token?.name || 'Unknown Token'
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return { symbol: 'Unknown', name: 'Unknown Token' };
  }
}

async function getTokenPriceWithRetry(mint: string, retries = 2): Promise<number> {
  try {
    const dexscreenerResponse = await axios.get(`${DEXSCREENER_API}/${mint}`);
    const pairs = dexscreenerResponse.data.pairs;

    if (pairs && pairs.length > 0) {
      // Get the price from the most liquid pair (highest volume)
      const mostLiquidPair = pairs.reduce((max: any, pair: any) =>
        pair.volume24h > max.volume24h ? pair : max, pairs[0]);
      return parseFloat(mostLiquidPair.priceUsd);
    }

    return 0;
  } catch (error) {
    console.error(`Error fetching price for ${mint}:`, error);
    if (retries > 0) {
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getTokenPriceWithRetry(mint, retries - 1);
    }
    return 0;
  }
}

  export async  function getPortfolio(address: string) {
    try {

      if (!address) {
        return NextResponse.json(
          { error: 'Address parameter is required' },
          { status: 400 }
        );
      }

      // Initialize Solana connection
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
      );

      // Validate and create PublicKey
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(address);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid Solana address' },
          { status: 400 }
        );
      }

      // Get SOL balance and price
      const solBalance = await connection.getBalance(publicKey);
      const solPrice = await getTokenPriceWithRetry('So11111111111111111111111111111111111111112');
      const solValueUSD = (solBalance / 1e9) * solPrice;

      // Get token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      });

      // Get all token mints first
      const mints = tokenAccounts.value.map(account =>
        account.account.data.parsed.info.mint
      );

      // Fetch all token metadata and prices in parallel with batching
      const batchSize = 5; // Reduced batch size to avoid rate limiting
      const tokenMetadata = await Promise.all(mints.map(mint => getTokenMetadata(mint)));

      // Process prices in batches to avoid rate limiting
      const tokenPrices: number[] = [];
      for (let i = 0; i < mints.length; i += batchSize) {
        const batch = mints.slice(i, i + batchSize);
        const batchPrices = await Promise.all(batch.map(mint => getTokenPriceWithRetry(mint)));
        tokenPrices.push(...batchPrices);
        // Add delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Process token accounts with prices and metadata
      const tokenHoldings = tokenAccounts.value.map((account, index) => {
        const mint = account.account.data.parsed.info.mint;
        const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
        const decimals = account.account.data.parsed.info.tokenAmount.decimals;
        const price = tokenPrices[index];
        const metadata = tokenMetadata[index];
        const valueUSD = amount * price;

        return {
          contractAddress: mint,
          symbol: metadata.symbol,
          name: metadata.name,
          amount: amount.toString(),
          decimals,
          priceUSD: price,
          valueUSD
        };
      });

      // Get NFT holdings
      const nftAccounts = tokenAccounts.value.filter(account =>
        account.account.data.parsed.info.tokenAmount.decimals === 0 &&
        account.account.data.parsed.info.tokenAmount.amount === '1'
      );

      // Calculate total portfolio value
      const totalValueUSD = solValueUSD + tokenHoldings.reduce((sum, token) => sum + token.valueUSD, 0);
      console.log("tokenHoldings",tokenHoldings);

      return ({
        address,
        solBalance: {
          amount: solBalance / 1e9,
          valueUSD: solValueUSD
        },
        tokenHoldings,
        nftHoldings: nftAccounts.length,
        totalValueUSD
      });

    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return ({
        error: 'Failed to fetch portfolio information'
      });
    }
  }