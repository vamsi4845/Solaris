'use client'
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletData } from "@/lib/hooks/use-wallet-data";
import { TransactionHistory } from "./TransactionHistory";
import { WalletUi } from "./wallet-ui";
import { useConnection } from "@solana/wallet-adapter-react";
import { WalletSkeleton } from "./WalletSkeleton";

export function Wallet() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { data: walletData, isLoading } = useWalletData(publicKey, connection);
  
    if(isLoading){
      return <WalletSkeleton />;
    }

    return (
        <div className="flex flex-col gap-3">
            <WalletUi walletData={walletData} />
            <TransactionHistory transactions={walletData?.transactions ?? []} />
        </div>
    )
}
