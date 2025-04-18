import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const ConnectWallet: FC = () => {
  const { publicKey } = useWallet();

  return (
    <div className="flex items-center justify-center">
      <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
    </div>
  );
}; 