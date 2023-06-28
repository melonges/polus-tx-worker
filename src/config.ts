import path from 'path';
import { polygon } from 'viem/chains';
export const CHAIN = polygon;
export const privateKeyFile = path.join(__dirname, '../privateKey.txt');
