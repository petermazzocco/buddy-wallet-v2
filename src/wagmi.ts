import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { goerli, mainnet, polygon, optimism } from "wagmi/chains";

const WC_ID = process.env.NEXT_PUBLIC_WALLETCONNECT as string;
const walletConnectProjectId = WC_ID;
const chains = [mainnet, polygon, optimism];
export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "BUDDY WALLET",
    walletConnectProjectId,
    chains,
  })
);
