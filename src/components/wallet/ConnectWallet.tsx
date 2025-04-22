import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const ConnectWallet: FC = () => {
  const { publicKey } = useWallet();

  return (
    <div className="flex items-center justify-center">
      <WalletMultiButton 
        className="!bg-black hover:!bg-black/90 !p-2"
      >
        {publicKey ? 'Connected' : 'Login'}
      </WalletMultiButton>
    </div>
  );
}; 