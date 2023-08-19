import Image from "next/image";
import airdrop from "../public/img/airdrop.png";
import BuddyDrop from "./components/BuddyDrop";
import AlertToast from "../components/AlertToast";

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
      <AlertToast
        message={`BuddyDrop is currently only available on Ethereum.\n Support for other chains coming soon.`}
      />
    </div>
  );
}
