import { randomUUID } from "crypto";
import { JsonRpcProvider, ethers } from "ethers";
import { Address, PrivateKeyAccount, privateKeyToAccount } from "viem/accounts";
import { paymentsHelperAbi } from "./abi.js";
import { createPublicClient, createWalletClient, http, parseEther, parseGwei } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { chain, privateKeyFile } from "./config.js";
import { FSProvider } from "./fs.js";

const weiPerGwei = 1_000_000_000n;
const requiredGas = 70_000n;
export type PrivateKey = Address;
export class Provider {
  private account: ReturnType<typeof privateKeyToAccount>;
  private walletClient: ReturnType<typeof createWalletClient>;
  private publicClient: ReturnType<typeof createPublicClient>;
  private jsonRpcProvider: JsonRpcProvider;
  constructor(
    private feeRecipient: Address,
    private feePercentage: bigint,
    private contractAddress: Address,
    privateKey: Address,
    // providerUrl: string
  ) {
    this.account = privateKeyToAccount(privateKey);
    this.publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    this.walletClient = createWalletClient({
      chain,
      transport: http(),
    });
    this.jsonRpcProvider = new JsonRpcProvider("https://polygon.rpc.blxrbdn.com");
  }

  public async newAccount({ writeToFile }: { writeToFile?: boolean } = {}) {
    const privateKey = generatePrivateKey();
    if (writeToFile) await FSProvider.appendFile(privateKeyFile, privateKey);
    return privateKeyToAccount(privateKey);
  }

  public replaceAccount(account: PrivateKeyAccount) {
    this.account = account;
  }

  public getBalance() {
    return this.publicClient.getBalance({
      address: this.account.address,
    });
  }

  public async sendTransaction(to: Address, balance: bigint) {
    const uuid = ("0x" + randomUUID().replaceAll("-", "")) as `0x${string}`;
    const gasPrice = await this.publicClient.getGasPrice();
    // console.log("gasPrice", gasPrice);

    // const feeData = await this.jsonRpcProvider.getFeeData();
    // // //
    // if (!feeData.maxPriorityFeePerGas || !feeData.maxFeePerGas) {
    //     throw new Error("No fee data");
    // }
    //
    // const maxFeePerGas =
    //     feeData.maxPriorityFeePerGas + feeData.maxFeePerGas * 2n

    // const wallet = new ethers.Wallet(privateKey, this.jsonRpcProvider);
    // const contract = new ethers.Contract("0x377f05e398e14f2d2efd9332cdb17b27048ab266", paymentsHelperAbi, wallet);
    // const tx = await contract.DoETHPayment(uuid, this.feeRecipient, parseEther("0.001"), to, parseEther("0.009"), { value: parseEther("0.011") });
    // console.log("tx", tx);
    // process.exit(0);


    // const requiredGas = await this.publicClient.estimateContractGas({
    //   address: this.contractAddress,
    //   functionName: "DoETHPayment",
    //   args: [uuid, this.feeRecipient, 1n, to, 1n],
    //   abi: paymentsHelperAbi,
    //   value: 2n,
    //   account: this.account,
    // });



    const totalTransactionCost = balance * this.feePercentage / 100n;
    const sendAmount = balance - totalTransactionCost;
    console.log("sendAmount", sendAmount);
    console.log("totalTransactionCost", totalTransactionCost);

    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      functionName: "DoETHPayment",
      args: [uuid, this.feeRecipient, 1n, to, sendAmount - 1n],
      abi: paymentsHelperAbi,
      value: sendAmount,
      chain,
      account: this.account,
      gas: requiredGas,
    });
    console.log("tx", hash);

    const transactionReceipt =
      await this.publicClient.waitForTransactionReceipt({ hash });
    const confirmations = await this.publicClient.getTransactionConfirmations({
      transactionReceipt,
    });
    console.log("confirmations", confirmations);
  }
}
