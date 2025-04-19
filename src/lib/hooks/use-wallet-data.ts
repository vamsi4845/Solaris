import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { getBalance, getLastXTransactions, getTokenBalance } from "@/utils/helper";

interface WalletData {
  balance: number;
  transactions: any[]; 
  tokenBalances: any[];
}

async function fetchWalletData(publicKey: string, connection: Connection): Promise<WalletData> {
  const [balance, transactions, tokenBalances] = await Promise.all([
    getBalance(publicKey, connection),
    getLastXTransactions(publicKey, connection, 5),
    getTokenBalance(publicKey, connection),
  ]);
  return {
    balance: balance / LAMPORTS_PER_SOL,
    transactions,
    tokenBalances,
  };
}

export function useWalletData(publicKey: PublicKey | null, connection: Connection) {
  return useQuery({
    queryKey: ["wallet-data", publicKey?.toString()],
    queryFn: () => fetchWalletData(publicKey!.toString(), connection),
    enabled: !!publicKey, // Only run query if publicKey exists
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
  });
} 