import path from "path";
import { polygon, arbitrum} from "viem/chains";
export const chain= polygon;
// export const chain= arbitrum;
export const privateKeyFile = path.join(__dirname, "../privateKey.txt");
