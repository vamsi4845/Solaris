"use client";

import TokenItem from "./TokenItem";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WalletData {
  balance: number;
  price: number;
  address: string;
  transactions?: Array<unknown>;
}

export function WalletUi({ walletData }: { walletData: WalletData }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (walletData?.address) {
      await navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col h-full p-1 dark text-primary-foreground bg-card/64 rounded-lg md:min-w-[260px]">
      {/* Balance Section */}
      <div className="mb-1 text-center">
        <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
        <div className="text-3xl font-semibold">
          <div className="flex flex-col">
            <span>${(walletData?.balance * walletData?.price).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Address Section */}
      {walletData?.address && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            className={cn(
              "flex items-center gap-2 !bg-[#eaeaec] !hover:bg-[#eaeaec] text-xs font-mono transition-colors duration-200 shadow-none",
              copied ? "text-green-500" : "text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
            )}
            onClick={copyToClipboard}
          >
            <span>{truncateAddress(walletData.address)}</span>
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}

      {/* Token List Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-medium text-muted-foreground px-2">
          Your Tokens
        </h3>
        <TokenItem walletData={walletData} />
      </div>
    </div>
  );
} 