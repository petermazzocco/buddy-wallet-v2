import Image from "next/image";
import logo from "./public/img/logo.png";
import { ConnectKitButton } from "./components/ConnectKitButton";
import { Disconnected } from "./components/Disconnected";
import { Connected } from "./components/Connected";
import WalletButton from "./components/WalletButton";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen my-16">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10 grid justify-center place-items-center align-middle">
            <h1 className="text-6xl font-bold">Buddy Wallet</h1>
            <h2 className="pb-4 font-normal text-lg">
              View Your NFT&apos;s Buddy Wallet Using ERC6551
            </h2>
            <Image width={200} height={200} src={logo} alt="logo" />
            <div className="flex flex-row space-x-14 ">
              <WalletButton />
              <Link href="/airdrop">
                <div className="indicator">
                  <span className="indicator-item badge badge-warning text-white">
                    NEW
                  </span>
                  <button className="btn btn-neutral text-white text-xl border-2">
                    Airdrop
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center align-middle space-x-5 my-5 text-3xl">
        <a
          href="https://medium.com/future-primitive/tldr-nfts-have-their-own-wallets-try-it-here-http-tokenbound-org-6fac135a1f9d"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className=" hover:underline underline-offset-2">
            What Is ERC6551?
          </h2>{" "}
        </a>
        <span className="font-black">|</span>
        <Link href="/faq">
          <h2 className="hover:underline cursor-pointer underline-offset-2">
            FAQ
          </h2>
        </Link>
      </div>
    </main>
  );
}
