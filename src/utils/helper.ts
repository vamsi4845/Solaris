import { Connection, PublicKey,LAMPORTS_PER_SOL} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

export const getBalance = async (publicKey: string, connection: Connection) => {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance;
};

export const getLastXTransactions = async (
  publicKey: string,
  connection: Connection,
  limit: number,
) => {
  const transactions = await connection.getSignaturesForAddress(
    new PublicKey(publicKey),
    {
      limit,
    },
  );
  return transactions;
};


export const getTokenBalance = async (publicKey: string, connection: Connection) => {
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(publicKey),
      { programId: TOKEN_PROGRAM_ID },
    );

    const tokenMetadataPromises = accounts.value.map(async (account) => {
      const parsedInfo = account.account.data.parsed.info;
      const mintAddress = new PublicKey(parsedInfo.mint);
      let symbol = `DEV-${parsedInfo.mint.slice(0, 4)}`; // Default fallback symbol
      let name = `DevToken ${parsedInfo.mint.slice(0, 8)}`; // Default fallback name
      let uri: string | undefined = undefined;

      try {
        const [metadataPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(), // Metaplex Metadata Program ID
            mintAddress.toBuffer(),
          ],
          new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
        );

        const metadataAccount = await Metadata.fromAccountAddress(connection, metadataPDA, 'processed'); // Use 'processed' cluster commitment

        // Use fetched metadata if available and not empty after trimming
        const fetchedSymbol = metadataAccount.data.symbol.trim();
        const fetchedName = metadataAccount.data.name.trim();
        if (fetchedSymbol) symbol = fetchedSymbol;
        if (fetchedName) name = fetchedName;
        uri = metadataAccount.data.uri.trim() || undefined;

      } catch (error) {
        // Metadata account likely doesn't exist or failed to fetch
        // console.warn(`Could not fetch metadata for mint ${parsedInfo.mint}:`, error); // Optional warning
      }

      return {
        mint: parsedInfo.mint,
        balance: Number(parsedInfo.tokenAmount.uiAmountString || parsedInfo.tokenAmount.amount / Math.pow(10, parsedInfo.tokenAmount.decimals)),
        decimals: parsedInfo.tokenAmount.decimals,
        symbol: symbol, // Use fetched or fallback
        name: name,     // Use fetched or fallback
        uri: uri,       // Use fetched or undefined
      };
    });

    const tokensWithMetadata = await Promise.all(tokenMetadataPromises);
    return tokensWithMetadata.filter(token => token.balance > 0);

  } catch (error) {
    console.error("Error fetching token balances:", error);
    return [];
  }
};


