"use client";

import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, createWalletClient, http } from "viem";
import { goerli, mainnet } from "viem/chains";
import { TokenboundClient } from "@tokenbound/sdk";
import { useState } from "react";

const MAINNET_API = process.env.NEXT_PUBLIC_ALCHEMY_API as string; // Mainnet API key
const GOERLI_API = process.env.NEXT_PUBLIC_GOERLI as string; // Goerli API key
const GOERLI_URL = `https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}`; // Goerli URL
const MAINNET_URL = `https://eth-mainnet.g.alchemy.com/v2/${MAINNET_API}`; // Mainnet URL

const config = {
  apiKey: MAINNET_API,
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

export const tokenboundClient = new TokenboundClient({
  //@ts-ignore
  walletClient,
  chainId: mainnet.id,
});
