import { AIChat } from "@/components/chatbox/ai-chatbox";
import { BackgroundGrid } from "@/components/backgrounds/background-grid";
import { WalletDashboard } from "@/components/dashboard/wallet-dashboard";

export default function Home() {
  return (
    <div className="bg-black text-white overflow-hidden">
      <BackgroundGrid />
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-1 gap-4 px-4 py-4">
        <WalletDashboard />
        <AIChat />
      </div>
    </div>
  );
}
