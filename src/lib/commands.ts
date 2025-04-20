"use client"

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getCoinGeckoId, getLastXTransactions, getPrice } from "../utils/helper";

import { SolanaAgentKit } from "solana-agent-kit";

  const agent = new SolanaAgentKit(
    process.env.NEXT_PUBLIC_SOLANA_PRIVATE_KEY!,
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
    process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  );

interface CommandProps {
  [key: string]: string;
}

export default async function triggerCommand(
  data: CommandProps,
  publicKey: PublicKey,
  connection: Connection,
) {
  if (!publicKey) {
    return {
      message: "Please connect your wallet.",
      status: "error",
    };
  }
  const { action } = data;
  let response;
  switch (action) {
    case "faucet":
      response = await handleFaucetCommand();
      return response;
    case "price":
      response = await handlePriceCommand(data);
      return response;
    case "send":
      response = await handleSendCommand(data);
      return response;
    case "buy":
      response = await handleBuyCommand();
      return response;
    case "swap":
      response = await handleSwapCommand();
      return response;
    case "create_token":
      response = await handleCreateTokenCommand(data);
      return response;
    case "check_balance":
      response = await handleCheckBalanceCommand(publicKey);
      return response;
    case "get_address":
      response = await handleGetAddressCommand();
      return response;
    case "transaction_status":
      response = await handleTransactionStatusCommand(publicKey, connection);
      return response;
    case "recent_transaction":
      response = await handleRecentTransactionCommand(publicKey, connection);
      return response;
    case "launch_nft":
      response = await handleLaunchNFTCommand(data);
      return response;
    default:
      response = {
        message: data.message,
        status: "error",
      };
      return response;
  }
}


const handleFaucetCommand = async () => {
  try {
    const response = await agent.requestFaucetFunds();
    console.log("response", response);
    return {
      message: "Faucet request sent successfully.",
      status: "success",
    };
  } catch (error: any) {
    console.error("Faucet request failed:", error);

    let errorMessage = "Failed to request faucet funds. Please try again later.";

    // Check if the error message contains the specific faucet 429 response
    if (error instanceof Error && error.message.includes('"code": 429')) {
      try {
        // Extract the JSON part of the error message
        const jsonStringMatch = error.message.match(/(\{.*\})/);
        if (jsonStringMatch && jsonStringMatch[1]) {
          const errorJson = JSON.parse(jsonStringMatch[1]);
          if (errorJson.error && errorJson.error.message) {
            // Use the specific message from the faucet response
            errorMessage = errorJson.error.message;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse faucet error JSON:", parseError);
        // Keep the generic message if parsing fails
      }
    }

    return {
      message: errorMessage,
      status: "error",
    };
  }
};

const handlePriceCommand = async (data: CommandProps) => {
  const { tokenName } = data;
  const coinGeckoId = getCoinGeckoId(tokenName)
  console.log(coinGeckoId)
  if (!coinGeckoId) {
    return { message: `Currently we don't support this token.`, status: 'error' };
  }
  try {
    const price = await getPrice(coinGeckoId)
    return { message: `${tokenName} Price is ${price.toFixed(2)}$`, status: 'success' };
  } catch (error) {
    console.error("Error fetching token price:", error);
    return { status: 'error', error: 'Failed to fetch token price. Please try again.' };
  }
};

const handleSendCommand = async (data: CommandProps) => {
  const { amount, toPublicKey } = data;
  if (!amount || !toPublicKey) {
    return {
      message: "Please provide the amount and recipient address.",
      status: "error",
    };
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return {
      message: "Invalid amount. Please provide a valid amount.",
      status: "error",
    };
  }
  try {

    const signature = await agent.transfer(
      new PublicKey(toPublicKey),
      parsedAmount,
    );
    console.log(signature);
    if (signature) {
      return {
        message:
          "Sent " +
          amount +
          "SOL to " +
          toPublicKey +
          "\n\n" +
          "check on [Explorer](https://solscan.io/tx/" +
          signature +
          "?cluster=devnet)",
        status: "success",
      };
    }
  } catch (error) {
    return {
      message: "Failed to send transaction.",
      status: "error",
    };
  }
};

const handleBuyCommand = async () => {
  const response = await agent.trade(
    new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
    1,
    new PublicKey("So11111111111111111111111111111111111111112"),
  );
  console.log("response", response);
  return {
    message:
      "**Buy Command isn't implemented yet. ☹️**" +
      "\n\n" +
      "BUT BUT BUT" +
      "\n\n" +
      "You can buy from below listed exchanges." +
      "\n\n" +
      "[Binance](https://www.binance.com)" +
      "\n\n" +
      "[Coinbase](https://www.coinbase.com)" +
      "\n\n" +
      "etc...",
    status: "error",
  };
};

const handleSwapCommand = async () => {
  return {
    message:
      "**Swap Command isn't implemented yet. ☹️**" +
      "\n\n" +
      "BUT BUT BUT" +
      "\n\n" +
      "You can swap from below listed exchanges." +
      "\n\n" +
      "[Uniswap](https://app.uniswap.org/)" +
      "\n\n" +
      "[Raydium](https://raydium.io/)" +
      "\n\n" +
      "[Jupiter](https://jup.ag/)" +
      "\n\n" +
      "etc...",
    status: "error",
  };
};

const handleCreateTokenCommand = async (data: CommandProps) => {
  const { tokenName, tokenSymbol, tokenDecimals, uri, mintAmount } = data;
  if (!tokenName || !tokenSymbol || !tokenDecimals || !uri || !mintAmount) {
    return {
      message:
        "Please provide all the required details for token creation" +
        "\n" +
        "tokenName: " +
        tokenName +
        "\n" +
        "tokenSymbol: " +
        tokenSymbol +
        "\n" +
        "tokenDecimals: " +
        tokenDecimals +
        "\n" +
        "uri: " +
        uri +
        "\n" +
        "mintAmount: " +
        mintAmount,
      status: "error",
    };
  }
  try {
    console.log("in")
    const mintPublicKey = await agent.deployToken(
      tokenName,
      uri,
      tokenSymbol,
      parseInt(tokenDecimals),
      parseInt(mintAmount),
    );

    console.log("mintPublicKey", mintPublicKey);

    return {
      message:
        "**Token created successfully.** \
        Check on [Link](https://solscan.io/address/" +
        mintPublicKey.mint.toString() +
        "?cluster=devnet)" +
        "\n\n" +
        "**Total Supply:** " +
        mintAmount +
        "\n\n" +
        "**Token Name:** " +
        tokenName +
        "\n\n" +
        "**Token Symbol:** " +
        tokenSymbol +
        "\n\n" +
        "**Token Decimals:** " +
        tokenDecimals,
      status: "success",
    };
  } catch (error) {
    return {
      message: "Failed to create token.",
      status: "error",
    };
  }
};
const handleCheckBalanceCommand = async (publicKey: PublicKey) => {
  if (!publicKey) {
    return {
      message: "Please connect your wallet.",
      status: "error",
    };
  }

  const balance = await agent.getBalance();

  return {
    message: `Your balance is ${balance.toFixed(4)} SOL.`,
    status: "success",
  };
};
const handleGetAddressCommand = async () => {
  return {
    message: `Your address is ${agent.wallet.publicKey.toString()}.`,
    status: "success",
  };
};
const handleTransactionStatusCommand = async (
  publicKey: PublicKey,
  connection: Connection,
) => {
  if (!publicKey) {
    return {
      message: "Please connect your wallet.",
      status: "error",
    };
  }
  const transactions = await getLastXTransactions(
    publicKey.toString(),
    connection,
    1,
  );
  return {
    message: `Your last transaction's status is: ${transactions[0].confirmationStatus}`,
    status: "success",
  };
};


const handleRecentTransactionCommand = async (
  publicKey: PublicKey,
  connection: Connection,
) => {
  if (!publicKey) {
    return {
      message: "Please connect your wallet.",
      status: "error",
    };
  }
  const transactions = await getLastXTransactions(
    agent.wallet.publicKey.toString(),
    connection,
    5,
  );
  return {
    message:
      "Your last 5 transactions's status are: " +
      " \n " +
      transactions
        .map(
          (transaction) =>
            "| [" +
            transaction.signature.substring(0, 8) +
            "](https://solscan.io/tx/" +
            transaction.signature +
            "?cluster=devnet) |",
        )
        .join("\n"),
    status: "success",
  };
};

const handleLaunchNFTCommand = async (data: CommandProps) => {
  const { nftName, uri } = data;
  if (!nftName || !uri) {
    return {
      message: "Please provide all the required details for NFT creation",
      status: "error",
    };
  }
  try {
      const mintPublicKey = await agent.deployCollection({
        name:nftName,
        uri: uri,
      })

    console.log("mintPublicKey", mintPublicKey);
  } catch (error: any) {
    console.error("NFT launch failed:", error);
    return {
      message: `Failed to launch NFT: ${error.message || 'Unknown error'}`,
      status: "error",
    };
  }
};


