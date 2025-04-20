"use client";

import TokenItem from "./TokenItem";

export function WalletUi({ walletData}: { walletData: any}) {


  return (
    <div className="flex flex-col h-full p-1 dark text-primary-foreground bg-card/64 rounded-lg md:min-w-[260px]">
      {/* Balance Section */}
      <div className="mb-4 text-center">
        <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
        <div className="text-3xl font-semibold">
            <div className="flex flex-col">
              <span>${(walletData?.balance * walletData?.price).toFixed(2)}</span>
            </div>
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
        <h3 className="text-sm font-medium text-muted-foreground px-2">
          Your Tokens
        </h3>
        <TokenItem walletData={walletData} />
      </div>
    </div>
  );
} 