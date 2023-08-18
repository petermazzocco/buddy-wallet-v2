"use client";

import { ConnectKitProvider } from "connectkit";
import * as React from "react";
import { WagmiConfig } from "wagmi";
import { config } from "../wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider
        customTheme={{
          "--ck-overlay-background": "rgba(0, 0, 0, 0.5)",
          "--ck-connectbutton-font-size": "1.25rem",
          "--ck-connectbutton-background": "#141524",
          "--ck-body-background": "#141524",
          "--ck-font-family": "Bebas Neue",
          "--ck-connectbutton-border-radius": "0.4rem",
        }}
      >
        {mounted && children}
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
