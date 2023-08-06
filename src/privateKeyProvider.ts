import { Wallet } from "ethers";
import fs from "fs/promises";

interface IPriveteKeyList {
  privateKeys: string[];
  currentPrivateKeyIndex: number;
}

export class PrivateKeyProvider {
  static genesisPrivateKey: string;
  static {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Missing environment variables");
    }
    PrivateKeyProvider.genesisPrivateKey = privateKey;
  }
  constructor(public privateKeyFilePath: string, public cicleSize: number) {}

  private async initPrivateKeyList() {
    const privateKeyList: IPriveteKeyList = {
      privateKeys: [PrivateKeyProvider.genesisPrivateKey],
      currentPrivateKeyIndex: 0,
    };

    const json = JSON.stringify(privateKeyList);
    await fs.writeFile(this.privateKeyFilePath, json, { encoding: "utf-8" });
    return privateKeyList;
  }

  private async getPrivateKeyList(privateKeyFilePath: string) {
    const privateKeyList = await fs.readFile(privateKeyFilePath, {
      encoding: "utf-8",
    });
    return JSON.parse(privateKeyList) as IPriveteKeyList;
  }

  async appendPrivateKey(privateKey: string) {
    const privateKeyList = await this.getPrivateKeyList(
      this.privateKeyFilePath
    );
    if (privateKeyList.privateKeys.length >= this.cicleSize) {
      throw new Error("Private key list is full");
    }
    privateKeyList.privateKeys.push(privateKey);
    privateKeyList.currentPrivateKeyIndex =
      privateKeyList.privateKeys.length - 1;
    const json = JSON.stringify(privateKeyList);
    await fs.writeFile(this.privateKeyFilePath, json, { encoding: "utf-8" });
  }

  async getCurrentPrivateKey() {
    try {
      await fs.access(this.privateKeyFilePath);
    } catch (error) {
      await this.initPrivateKeyList();
    }
    const privateKeyList = await this.getPrivateKeyList(
      this.privateKeyFilePath
    );
    return privateKeyList.privateKeys[privateKeyList.currentPrivateKeyIndex];
  }
  async getNextPrivateKey() {
    const privateKeyList = await this.getPrivateKeyList(
      this.privateKeyFilePath
    );
    if (privateKeyList.currentPrivateKeyIndex + 1 >= this.cicleSize) {
      privateKeyList.currentPrivateKeyIndex = 0;
    } else {
      const privateKey = Wallet.createRandom().privateKey;
      privateKeyList.privateKeys.push(privateKey);
      privateKeyList.currentPrivateKeyIndex++;
    }
    const json = JSON.stringify(privateKeyList);
    await fs.writeFile(this.privateKeyFilePath, json, { encoding: "utf-8" });
    return privateKeyList.privateKeys[privateKeyList.currentPrivateKeyIndex];
  }
}
