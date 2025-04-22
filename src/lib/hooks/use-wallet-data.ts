import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { getBalance, getLastXTransactions, getPortfolio, getPrice} from "@/utils/helper";
import { WalletData } from "@/utils/types";



async function fetchWalletData(publicKey: string, connection: Connection): Promise<WalletData> {
  const [transactions, portfolio] = await Promise.all([
    getLastXTransactions(publicKey, connection, 10),
    getPortfolio(publicKey?.toString() ?? '')
  ]);
  return {
    transactions,
    portfolio
  };
}

export function useWalletData(publicKey: PublicKey | null, connection: Connection) {
  return useQuery({
    queryKey: ["wallet-data", publicKey?.toString()],
    queryFn: () => fetchWalletData(publicKey!.toString(), connection),
    enabled: !!publicKey,
    refetchInterval: 3000,
    staleTime: 3000,
  });
} 