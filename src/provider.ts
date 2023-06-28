import { randomUUID } from "crypto";
import { Address, PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";
import { paymentsHelperAbi } from "./abi.js";
import { createPublicClient, createWalletClient, http, parseGwei } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { CHAIN, privateKeyFile } from "./config.js";
import { FSProvider } from "./fs.js";

export type PrivateKey = Address;
export class Provider {
  private account: ReturnType<typeof privateKeyToAccount>;
  private walletClient: ReturnType<typeof createWalletClient>;
  private publicClient: ReturnType<typeof createPublicClient>;
  constructor(
    private feeRecipient: Address,
    private feePercentage: bigint,
    private contractAddress: Address,
    privateKey: Address
    // providerUrl: string
  ) {
    this.account = privateKeyToAccount(privateKey);
    this.publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(),
    });
    this.walletClient = createWalletClient({
      chain: CHAIN,
      transport: http(),
    });
  }

  public async newAccount() {
    const privateKey = generatePrivateKey();
    await FSProvider.appendFile(privateKeyFile, privateKey);
    return privateKeyToAccount(privateKey);
  }

  public replaceAccount(account: PrivateKeyAccount) {
    this.account = account;
  }

  public async getBalance() {
    return await this.publicClient.getBalance({
      address: this.account.address,
    });
  }

  public async sendTransaction(to: Address, balance: bigint) {
    const uuid = ("0x" + randomUUID().replaceAll("-", "")) as `0x${string}`;
    const gasPrice = await this.publicClient.getGasPrice();

    const requiredGas = await this.publicClient.estimateContractGas({
      address: this.contractAddress,
      functionName: "DoETHPayment",
      args: [uuid, this.feeRecipient, 1n, to, 1n],
      abi: paymentsHelperAbi,
      value: 3n,
      account: this.account,
    });

    const totalTransactionCost = gasPrice * requiredGas;
    console.log("totalTransactionCost", totalTransactionCost);
    const value = balance - totalTransactionCost;

    // const feeValue = (value * this.feePercentage) / 100n;

    const tx = await this.walletClient.writeContract({
      address: this.contractAddress,
      functionName: "DoETHPayment",
      args: [uuid, this.feeRecipient, value - 1n, to, 1n],
      abi: paymentsHelperAbi,
      value: value,
      chain: CHAIN,
      account: this.account,
    });
    console.log("tx", tx);

    const transactionReceipt =
      await this.publicClient.waitForTransactionReceipt({ hash: tx });
    const confirmations = await this.publicClient.getTransactionConfirmations({
      transactionReceipt,
    });
    console.log("confirmations", confirmations);
  }
}
