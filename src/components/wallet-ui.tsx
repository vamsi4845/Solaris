"use client";

import { useWalletData } from "@/lib/hooks/use-wallet-data";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder token data - replace with actual token fetching
const tokens = [
  {
    id: "ark",
    name: "Ark",
    symbol: "ARK",
    balance: 15494.9,
    balanceUSD: 2867.0,
    image: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741861900/coin-01-sm-dark_hkrvvm.svg",
  },
  {
    id: "tok",
    name: "Token",
    symbol: "TOK",
    balance: 12984.2,
    balanceUSD: 31.2,
    image: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741861900/coin-02-sm-dark_iqldgv.svg",
  },
];

interface TokenItemProps {
  token: typeof tokens[0];
}

function TokenItem({ token }: TokenItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-3 px-4 hover:bg-card/70 rounded-lg transition-colors duration-150"
    >
      <div className="flex items-center gap-3">
        <Image
          className="shrink-0 rounded-full shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.05),0_2px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.05)]"
          src={token.image}
          width={32}
          height={32}
          alt={token.name}
        />
        <div>
          <div className="font-medium">{token.name}</div>
          <div className="text-xs text-muted-foreground">{token.symbol}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">
          {token.balance.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 4,
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          ${token.balanceUSD.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </motion.li>
  );
}

export function WalletUi() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data: walletData, isLoading } = useWalletData(publicKey, connection);
  console.log("walletData", walletData?.tokenBalances);

  // const totalBalanceUSD = tokens.reduce((acc, token) => acc + token.balanceUSD, 0);

  if(isLoading){
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full p-4 dark text-primary-foreground bg-card/64 rounded-lg md:min-w-[260px]">
      {/* Balance Section */}
      <div className="mb-6 text-center">
        <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
        <div className="text-3xl font-semibold">
          {isLoading ? (
            <div className="h-9 w-32 mx-auto bg-muted/20 animate-pulse rounded" />
          ) : (
            <div className="flex flex-col">
              <span>${walletData?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="text-sm text-muted-foreground">
                {walletData?.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex justify-around items-center mb-6 gap-3">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto px-2 py-1 text-xs hover:bg-card/80"
        >
          <RiAddCircleLine size={20} className="mb-1" />
          Buy
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto px-2 py-1 text-xs hover:bg-card/80"
        >
          <RiArrowUpCircleLine size={20} className="mb-1" />
          Send
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto px-2 py-1 text-xs hover:bg-card/80"
        >
          <RiArrowDownCircleLine size={20} className="mb-1" />
          Receive
        </Button>
      </div> */}

      {/* Token List Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-medium text-muted-foreground px-2 mb-2">
          Your Tokens
        </h3>

        <ul className="space-y-1">
          {tokens.map((token) => (
            <TokenItem key={token.id} token={token} />
          ))}
        </ul>
      </div>
    </div>
  );
} 