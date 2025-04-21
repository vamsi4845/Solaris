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


export interface WalletData {
  balance: number;
  transactions: Transaction[]; 
  price: number;
  address: string;
}

export interface SavedWallet {
  name: string;
  address: string;
}