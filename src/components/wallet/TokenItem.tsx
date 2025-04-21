import { motion } from "framer-motion";
import Image from "next/image";

export default function TokenItem({ walletData }: { walletData: any }) {
    return (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-2 px-4  rounded-lg transition-colors duration-150"
      >
        <div className="flex items-center gap-3">
          <Image
            className="shrink-0 rounded-full shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0_1px_1px_rgba(0,0,0,0.05),0_2px_2px_rgba(0,0,0,0.05),0_2px_4px_rgba(0,0,0,0.05)]"
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png"
            width={32}
            height={32}
            alt="Solana"
          />
          <div>
            <div className="font-medium">Solana</div>
            <div className="text-xs text-muted-foreground">SOL</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">
            {walletData?.balance.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            ${(walletData?.balance * walletData?.price).toFixed(2)}
          </div>
        </div>
      </motion.li>
    );
  }