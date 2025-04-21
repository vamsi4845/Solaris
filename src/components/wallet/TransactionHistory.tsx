"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TransactionHistoryProps, Transaction } from "@/utils/types";
import { AnimatedList } from "@/components/magicui/animated-list";

// Helper function to format timestamp
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Helper function to truncate signature
const truncateSignature = (signature: string, length: number = 4): string => {
  if (signature.length <= length * 2 + 3) return signature;
  return `${signature.substring(0, length)}...${signature.substring(signature.length - length)}`;
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {

  console.log(transactions)
  const getStatusIcon = (status: Transaction['confirmationStatus'], error: unknown | null) => {
    if (error) return <AlertCircle className="h-4 w-4 text-destructive" />;
    switch (status) {
      case "finalized":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "confirmed":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processed":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const TransactionItem = ({ tx }: { tx: Transaction }) => (
    <motion.div
      layout
      className="flex items-center gap-2 p-1 rounded-lg transition-colors duration-150 w-full group" 
    >
      <div className="flex-shrink-0">
        {getStatusIcon(tx.confirmationStatus, tx.err)}
      </div>
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <a
            href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono hover:underline cursor-pointer truncate text-muted-foreground min-w-[80px]"
          >
            {truncateSignature(tx.signature)}
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto text-xs font-mono bg-popover text-popover-foreground p-2" side="top" align="start">
          {tx.signature}
        </HoverCardContent>
      </HoverCard>
      <span className="text-xs text-muted-foreground flex-1 text-center">
        {formatDate(tx.blockTime)}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatTime(tx.blockTime)}
      </span>
    </motion.div>
  );

  return (
    <Card className="dark text-primary-foreground bg-card/64 h-full flex flex-col border-none shadow-none">
      <CardHeader className="!px-2 !py-1">
        <CardTitle className="text-base font-medium text-muted-foreground">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full px-4 pb-4">
          {transactions && transactions.length > 0 ? (
            <AnimatedList delay={200}>
              {[...transactions].reverse().map((tx) => (
                <TransactionItem key={tx.signature} tx={tx} />
              ))}
            </AnimatedList>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No transactions yet.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
