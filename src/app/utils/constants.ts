import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { goerli, mainnet } from "viem/chains";
import { useNetwork } from "wagmi";
import { useState } from "react";

export interface OwnedNFT {
  contract: {
    address: string;
  };
  title: string;
  tokenId: string;
  media: {
    gateway: string;
    thumbnail: string;
    raw: string;
    format: string;
    bytes: number;
  }[];
  deployed?: boolean;
}

const ALCHEMY_API = process.env.NEXT_PUBLIC_ALCHEMY_API as string; // Mainnet API key
const GOERLI_API = process.env.NEXT_PUBLIC_GOERLI as string; // Goerli API key
const GOERLI_URL = `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}`; // Goerli URL
const MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API}`; // Mainnet URL

const config = {
  apiKey: ALCHEMY_API,
  network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(config);

export const providerClient = createPublicClient({
  chain: mainnet,
  transport: http(MAINNET_URL),
});

export const walletClient = (account: any) =>
  createWalletClient({
    account,
    chain: mainnet,
    transport: http(MAINNET_URL),
  });
