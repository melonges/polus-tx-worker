import "dotenv/config";
import { Provider } from "./provider.js";
import { PrivateKeyProvider } from "./privateKeyProvider.js";
import path from "path";
import { getInterval, sleep } from "./sleep.js";

const feeRecipient = process.env.FEE_RECIPIENT;
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const cicleSize = Number(process.env.CICLE_SIZE);
const RPC_URL = process.env.RPC_URL;
const privateKeyPath = path.resolve(__dirname, "../privateKey.json");

async function main() {
  if (!feeRecipient || !contractAddress || !privateKey || !RPC_URL) {
    throw new Error("Missing environment variables");
  }

  const privateKeyProvider = new PrivateKeyProvider(privateKeyPath, cicleSize);
  const provider = new Provider(
    feeRecipient,
    RPC_URL,
    contractAddress,
    await privateKeyProvider.getCurrentPrivateKey(),
    privateKeyProvider
  );

  try {
    while (true) {
      const balance = await provider.getBalance();
      const toWallet = await provider.newWallet();
      await provider.sendTransaction(toWallet.address, balance, () => {
        provider.replaceWallet(toWallet);
        provider.replaceConrtactProvider();
      });
      const interval = getInterval();
      console.log(`Sleeping for ${interval / 1000} seconds`);
      await sleep(interval);
    }
  } catch (error) {
    console.error(error);
    provider.rollBack();
    process.exit(1);
  }
}

main();
