import { Alchemy, Network } from "alchemy-sdk";
import { createPublicClient, createWalletClient, http, custom } from "viem";
import { goerli, mainnet } from "viem/chains";

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

const config = {
  apiKey: GOERLI_API,
  network: Network.ETH_GOERLI,
};

export const alchemy = new Alchemy(config);

export const providerClient = createPublicClient({
  chain: goerli,
  transport: http(`https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}`),
  //https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}
  //https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API}
});

export const walletClient = (account: any) =>
  createWalletClient({
    account,
    chain: goerli,
    transport: http(`https://eth-goerli.g.alchemy.com/v2/${GOERLI_API}`),
  });
