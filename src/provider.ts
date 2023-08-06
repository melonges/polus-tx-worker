import { randomUUID } from "crypto";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { paymentsHelperAbi } from "./abi.js";
import { privateKeyFile } from "./config.js";
import { FSProvider } from "./fs.js";
import { PrivateKeyProvider } from "./privateKeyProvider.js";

export class Provider {
  private wallet: Wallet;
  private jsonRpcProvider: JsonRpcProvider;
  private contract: Contract;
  constructor(
    private feeRecipient: string,
    rpcUrl: string,
    private contractAddress: string,
    currentPrivateKey: string,
    private privateKeyProvider: PrivateKeyProvider
  ) {
    this.jsonRpcProvider = new JsonRpcProvider(rpcUrl);
    this.wallet = new Wallet(currentPrivateKey, this.jsonRpcProvider);
    this.contract = new Contract(
      this.contractAddress,
      paymentsHelperAbi,
      this.wallet
    );
  }

  public getBalance() {
    return this.jsonRpcProvider.getBalance(this.wallet.address);
  }

  public async newWallet() {
    return new Wallet(
      await this.privateKeyProvider.getNextPrivateKey(),
      this.jsonRpcProvider
    );
  }

  public replaceWallet(wallet: Wallet) {
    this.wallet = wallet;
  }

  public replaceConrtactProvider() {
    this.contract = new Contract(
      this.contractAddress,
      paymentsHelperAbi,
      this.wallet
    );
  }

  public async sendTransaction(to: string, balance: bigint) {
    const uuid = ("0x" + randomUUID().replaceAll("-", "")) as `0x${string}`;

    const feeData = await this.jsonRpcProvider.getFeeData();
    if (!feeData.maxPriorityFeePerGas || !feeData.maxFeePerGas) {
      throw new Error("No fee data");
    }
    const maxFeePerGas =
      feeData.maxPriorityFeePerGas + feeData.maxFeePerGas * 2n;

    const requiredGas = await this.contract.DoETHPayment.estimateGas(
      uuid,
      this.feeRecipient,
      1n,
      to,
      1n,
      { value: 2n }
    );
    const sendAmount = balance - maxFeePerGas * requiredGas;
    console.log("to", to);
    console.log("pk", this.wallet.privateKey);

    const tx = await this.contract.DoETHPayment.send(
      uuid,
      this.feeRecipient,
      1n,
      to,
      sendAmount - 1n,
      {
        value: sendAmount,
      }
    );
    await tx.wait();
  }
}
