'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiLogoutCircleLine, RiWallet3Fill } from "@remixicon/react";
import { AddWalletDialog } from "./wallet/add-wallet-dialog";
import { useState } from "react";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { Check } from "lucide-react";
export default function UserDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);
  const {logout} = useWallet();
  const copyToClipboard = async () => {
    if (publicKey?.toString()) {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage
              src="/avatar.jpg"
              width={32}
              height={32}
              alt="Profile image"
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 p-2" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
        {publicKey?.toString() && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            className={cn(
              "flex items-center gap-2 !bg-white !hover:bg-[#eaeaec] text-xs font-mono transition-colors duration-200 shadow-none",
              copied ? "text-green-500" : "text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
            )}
            onClick={copyToClipboard}
          >
            <span>{truncateAddress(publicKey.toString())}</span>
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      )}
        </DropdownMenuLabel>
        <AddWalletDialog>
          <DropdownMenuItem
            className="gap-3 px-1 hover:border-none"
            asChild
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex items-center gap-3 w-full px-2 py-1.5 cursor-pointer">
              <RiWallet3Fill
                size={20}
                className="text-muted-foreground/70"
                aria-hidden="true"
              />
              <span>Wallet List</span>
            </div>
          </DropdownMenuItem>
        </AddWalletDialog>
        <DropdownMenuItem className="gap-3 px-1" onClick={logout}>
          <RiLogoutCircleLine
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span onClick={logout}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
