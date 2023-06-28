import { PathLike } from "fs";
import fs from "fs/promises";
export class FSProvider {
  static appendFile(path: PathLike, data: string) {
    return fs.writeFile(path, data + "\n", { flag: "a", encoding: "utf-8" });
  }
}
