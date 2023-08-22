import Image from "next/image";
import Link from "next/link";
import airdrop from "../public/img/airdrop.png";
import BuddyDrop from "./components/BuddyDrop";

export default function Page() {
  return (
    <div className="min-h-screen my-16">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10 grid justify-center place-items-center align-middle">
            <h1 className="text-6xl font-bold">Buddy drop</h1>
            <Image width={200} height={200} src={airdrop} alt="logo" />
          </div>
        </div>
      </div>
      <BuddyDrop />
      <div className="flex flex-row justify-center items-center align-middle space-x-5 my-20 text-3xl">
        <Link href={"/airdrop/tutorial"}>
          <h2 className="hover:underline underline-offset-2">How To Airdrop</h2>
        </Link>
        <span className="font-black">|</span>
        <h2 className="hover:underline underline-offset-2">Contract</h2>
      </div>
    </div>
  );
}
