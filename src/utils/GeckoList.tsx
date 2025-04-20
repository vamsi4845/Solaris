// Interface for the new structure
interface CoinGeckoEntry {
  id: string;          // The CoinGecko ID
  aliases: string[];   // Array of lowercase names, symbols, variations
}

// Define the list using the new structure
export const MANUAL_COINGECKO_LIST: CoinGeckoEntry[] = [
  { id: 'bitcoin', aliases: ['btc', 'bitcoin'] },
  { id: 'ethereum', aliases: ['eth', 'ether', 'ethereum'] },
  { id: 'solana', aliases: ['sol', 'solana'] },
  { id: 'usd-coin', aliases: ['usdc', 'usd coin'] },
  { id: 'tether', aliases: ['usdt', 'tether'] },
  { id: 'raydium', aliases: ['ray', 'raydium'] },
  { id: 'serum', aliases: ['srm', 'serum'] },
  { id: 'bonk', aliases: ['bonk'] },
  { id: 'dogecoin', aliases: ['doge', 'dogecoin'] },
  { id: 'shiba-inu', aliases: ['shiba', 'shiba inu'] },
  { id: 'pepe', aliases: ['pepecoin', 'pepe'] },
  { id: 'dogwifhat', aliases: ['dogwifhat'] },
  { id: 'floki', aliases: ['floki'] },
  { id: 'jupiter-exchange-solana', aliases: ['jup','jupiter'] },
  { id: 'peach', aliases: ['peach'] },
  { id: 'peach', aliases: ['peach'] },
  { id: 'peach', aliases: ['peach'] },
  { id: 'peach', aliases: ['peach'] },
  { id: 'peach', aliases: ['peach'] },
  { id: 'peach', aliases: ['peach'] },
  
  // Add more tokens here
  // { id: 'coingecko-id', aliases: ['ticker', 'name', 'variation'] },
];


