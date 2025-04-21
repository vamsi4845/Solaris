interface SavedWallet {
  name: string;
  address: string;
}

export function getSavedWallets(): SavedWallet[] {
  if (typeof window === 'undefined') return [];
  
  const savedWalletsStr = localStorage.getItem('savedWallets');
  if (!savedWalletsStr) return [];

  try {
    return JSON.parse(savedWalletsStr);
  } catch (error) {
    console.error('Error parsing saved wallets:', error);
    return [];
  }
}

export function saveWallet(name: string, address: string): void {
  if (typeof window === 'undefined') return;

  const wallets = getSavedWallets();
  wallets.push({ name, address });
  localStorage.setItem('savedWallets', JSON.stringify(wallets));
}

export function removeWallet(address: string): void {
  if (typeof window === 'undefined') return;

  const wallets = getSavedWallets();
  const filteredWallets = wallets.filter(wallet => wallet.address !== address);
  localStorage.setItem('savedWallets', JSON.stringify(filteredWallets));
}
