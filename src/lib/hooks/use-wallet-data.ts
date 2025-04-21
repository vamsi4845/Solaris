import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { getBalance, getLastXTransactions, getPrice} from "@/utils/helper";
import { WalletData } from "@/utils/types";



async function fetchWalletData(publicKey: string, connection: Connection): Promise<WalletData> {
  const [balance, transactions, price] = await Promise.all([
    getBalance(publicKey, connection),
    getLastXTransactions(publicKey, connection, 13),
    getPrice('solana')
  ]);
  return {
    balance: balance / LAMPORTS_PER_SOL,
    transactions,
    price,
    address: publicKey?.toString()
  };
}

export function useWalletData(publicKey: PublicKey | null, connection: Connection) {
  return useQuery({
    queryKey: ["wallet-data", publicKey?.toString()],
    queryFn: () => fetchWalletData(publicKey!.toString(), connection),
    enabled: !!publicKey, // Only run query if publicKey exists
    refetchInterval: 5000, // Refetch every 1 seconds
  });
} 