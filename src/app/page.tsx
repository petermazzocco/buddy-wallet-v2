import Image from "next/image";
import logo from "./public/img/logo.png";
import { ConnectKitButton } from "./components/ConnectKitButton";
import { Disconnected } from "./components/Disconnected";
import { Connected } from "./components/Connected";
import NFTs from "./components/NFTs";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10">
            <Disconnected>
              <Image width={200} height={200} src={logo} alt="logo" />
            </Disconnected>
            <h1 className="text-6xl font-bold">Buddy Wallet</h1>
            <h2 className="pb-4 font-normal text-lg">
              View Your NFT&apos;s Buddy Wallet Using ERC6551
            </h2>
            {/* Render Connect Button only if user isn't connected */}
            <Disconnected>
              <ConnectKitButton />
            </Disconnected>
            {/* Render NFTS only if user is connected */}
            <Connected>
              <NFTs />
            </Connected>
          </div>
        </div>
      </div>
    </main>
  );
}
