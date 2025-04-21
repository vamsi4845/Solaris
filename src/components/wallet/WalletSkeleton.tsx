"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function TokenSkeleton() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

function TransactionSkeleton() {
  return (
    <motion.div
      layout
      className="flex items-center gap-2 p-1 rounded-lg w-full group"
    >
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-16 flex-1" />
      <Skeleton className="h-3 w-12" />
    </motion.div>
  );
}

export function WalletSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Wallet UI Skeleton */}
      <div className="flex flex-col h-full p-1 dark text-primary-foreground bg-card/64 rounded-lg md:min-w-[260px]">
        {/* Balance Section */}
        <div className="mb-4 text-center">
          <Skeleton className="h-4 w-24 mx-auto mb-2" />
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>

        {/* Token List Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <Skeleton className="h-4 w-20 mb-2 mx-2" />
          <TokenSkeleton />
          <TokenSkeleton />
        </div>
      </div>

      {/* Transaction History Skeleton */}
      <Card className="dark text-primary-foreground bg-card/64 h-full flex flex-col border-none shadow-none">
        <CardHeader className="!px-2 !py-1">
          <CardTitle className="text-base font-medium text-muted-foreground">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="px-4 pb-4 flex flex-col gap-1">
            {Array.from({ length: 15 }).map((_, index) => (
              <TransactionSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 