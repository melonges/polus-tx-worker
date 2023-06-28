export const paymentsHelperAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes16", name: "uuid", type: "bytes16" },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "feerecvr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feevalue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "mrhrecvr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mrhvalue",
        type: "uint256",
      },
    ],
    name: "ERC20Payment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes16", name: "uuid", type: "bytes16" },
      {
        indexed: false,
        internalType: "address",
        name: "feerecvr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feevalue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "mrhrecvr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mrhvalue",
        type: "uint256",
      },
    ],
    name: "ETHPayment",
    type: "event",
  },
  {
    inputs: [
      { internalType: "bytes16", name: "uuid", type: "bytes16" },
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "feerecvr", type: "address" },
      { internalType: "uint256", name: "feevalue", type: "uint256" },
      { internalType: "address", name: "mrhrecvr", type: "address" },
      { internalType: "uint256", name: "mrhvalue", type: "uint256" },
    ],
    name: "DoERC20Payment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes16", name: "uuid", type: "bytes16" },
      { internalType: "address", name: "feerecvr", type: "address" },
      { internalType: "uint256", name: "feevalue", type: "uint256" },
      { internalType: "address", name: "mrhrecvr", type: "address" },
      { internalType: "uint256", name: "mrhvalue", type: "uint256" },
    ],
    name: "DoETHPayment",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
