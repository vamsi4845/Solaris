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

export default function UserDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(true);

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
          <span className="truncate text-sm font-medium text-foreground mb-0.5">
            Mary P.
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            mary@askdigital.com
          </span>
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
        <DropdownMenuItem className="gap-3 px-1">
          <RiLogoutCircleLine
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
