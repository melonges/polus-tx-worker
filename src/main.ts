import "dotenv/config";
import { Provider, PrivateKey } from "./provider.js";
import { Address } from "viem";

async function main() {
  const feeRecipient = process.env.FEE_RECIPIENT as Address;
  const feePercentage = BigInt(process.env.FEE_PERCENTAGE || 5);
  const contractAddress = process.env.CONTRACT_ADDRESS as Address;
  const privateKey = process.env.PRIVATE_KEY as PrivateKey;

  const provider = new Provider(
    feeRecipient,
    feePercentage,
    contractAddress,
    privateKey
  );

  let balance = await provider.getBalance();
  while (balance > 0) {
    console.log("Balance:", balance);
    const toAccount = await provider.newAccount({ writeToFile: true });
    // const toAccount = await provider.newAccount();
    await provider.sendTransaction(toAccount.address, balance);
    provider.replaceAccount(toAccount);
    balance = await provider.getBalance();
  }
}

main();
