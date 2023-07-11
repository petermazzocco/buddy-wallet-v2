import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { goerli } from "wagmi/chains";

const walletConnectProjectId = "b78a90321fdf414247141fff7aded49c";
const chains = [goerli];
export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "BUDDY WALLET",
    walletConnectProjectId,
    chains,
  })
);
