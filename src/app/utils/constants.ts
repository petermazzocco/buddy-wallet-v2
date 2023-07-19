"use client";

import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { goerli, mainnet, polygon, optimism } from "viem/chains";

export const MAINNET_API = process.env.NEXT_PUBLIC_ALCHEMY_API as string; // Mainnet API key
export const GOERLI_API = process.env.NEXT_PUBLIC_GOERLI as string; // Goerli API key
export const POLYGON_API = process.env.NEXT_PUBLIC_POLYGON as string; // Polygon API key
export const OPTIMISM_API = process.env.NEXT_PUBLIC_OPTIMISM as string; // Optimism API key

export const GOERLI_URL = `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}`; // Goerli URL
export const MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API}`; // Mainnet URL
export const POLYGON_URL = `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_API}`; // Polygon URL
export const OPTIMISM_URL = `https://opt-mainnet.g.alchemy.com/v2/${OPTIMISM_API}`; // Optimism URL

const goerliConfig = {
  apiKey: GOERLI_API,
  network: Network.ETH_GOERLI,
};

const ethConfig = {
  apiKey: MAINNET_API,
  network: Network.ETH_MAINNET,
};

const polyConfig = {
  apiKey: POLYGON_API,
  network: Network.MATIC_MAINNET,
};

const opConfig = {
  apiKey: OPTIMISM_API,
  network: Network.OPT_MAINNET,
};

export const ethAlchemy = new Alchemy(ethConfig);
export const polyAlchemy = new Alchemy(polyConfig);
export const opAlchemy = new Alchemy(opConfig);
export const goerliAlchemy = new Alchemy(goerliConfig);

export const ethProviderClient = createPublicClient({
  chain: mainnet,
  transport: http(MAINNET_URL),
});

export const polyProviderClient = createPublicClient({
  chain: polygon,
  transport: http(POLYGON_URL),
});

export const opProviderClient = createPublicClient({
  chain: optimism,
  transport: http(OPTIMISM_URL),
});

export const ethWalletClient = createWalletClient({
  chain: mainnet,
  transport: http(MAINNET_URL),
});

export const polyWalletClient = createWalletClient({
  chain: polygon,
  transport: http(POLYGON_URL),
});

export const opWalletClient = createWalletClient({
  chain: optimism,
  transport: http(OPTIMISM_URL),
});
