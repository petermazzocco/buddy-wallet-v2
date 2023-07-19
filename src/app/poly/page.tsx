import { Disconnected } from "../components/Disconnected";
import { Connected } from "../components/Connected";
import NFTs from "../components/MATIC/NFTs";
import Image from "next/image";
import logo from "../public/img/logo.png";
import { ConnectKitButton } from "../components/ConnectKitButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "POLYGON - BUDDY WALLET",
  description: "Polygon Buddy Wallet",
};

export default function Page() {
  return (
    <main className="min-h-screen my-16">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10 grid justify-center place-items-center align-middle">
            <h1 className="text-6xl font-bold">Buddy Wallet</h1>
            <Image
              width={50}
              height={50}
              src={"https://cryptologos.cc/logos/polygon-matic-logo.png?v=025"}
              alt="logo"
              className="py-5"
            />
            {/* Render Connect Button only if user isn't connected */}
            <Disconnected>
              <Image width={200} height={200} src={logo} alt="logo" />
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
