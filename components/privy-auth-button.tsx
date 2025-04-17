'use client';

import { usePrivy, useLogin, useLogout } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component from Shadcn UI

export function PrivyAuthButton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { ready, authenticated, user } = usePrivy();
  console.log("ready", ready,authenticated, user)
  const { login } = useLogin();
  const { logout } = useLogout();

  // Disable buttons until Privy is ready
  const isDisabled = !ready;
  const isLoggingIn = !ready && !authenticated; // Or add a specific loading state if needed

  if (!authenticated) {
    return (
      <Button
        disabled={isDisabled || isLoggingIn}
        onClick={login}
        variant="outline" // Or your preferred style
        className={className}
        style={style}
      >
        {isLoggingIn ? 'Loading...' : 'Login'}
      </Button>
    );
  }

  // Optional: Display user info (e.g., wallet address)
  const walletAddress = user?.wallet?.address
    ? `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`
    : 'Account';

  return (
    <Button
      disabled={isDisabled}
      onClick={logout}
      variant="outline" // Or your preferred style
      className={className}
      style={style}
    >
      Logout ({walletAddress})
    </Button>
  );
} 