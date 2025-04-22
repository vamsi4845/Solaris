export interface Message {
  id?: number;
  content: string;
  role: "user" | "system";
}

// Define the Transaction interface based on the provided structure
export interface Transaction {
  blockTime: number;
  confirmationStatus: "finalized" | "confirmed" | "processed"; // Added common statuses
  err: unknown | null; // Use unknown instead of any for better type safety
  memo: string | null;
  signature: string;
  slot: number;
}

export interface TransactionHistoryProps {
  transactions: Transaction[];
}

export interface Portfolio {
  address: string;
    solBalance: {
      amount: number;
      valueUSD: number;
    };
    tokenHoldings: {
      contractAddress: string;
      symbol: string;
      name: string;
      amount: string;
      decimals: number;
      priceUSD: number;
      valueUSD: number;
    }[];
    nftHoldings: number;
    totalValueUSD: number;
}

export interface WalletData {
  transactions: Transaction[];
  portfolio: Portfolio;
}

export interface SavedWallet {
  name: string;
  address: string;
}


export interface Token {
  contractAddress?: string;
  symbol?: string;
  name?: string;
  amount?: string;
  decimals?: number;
  priceUSD?: number;
  valueUSD?: number;
}
