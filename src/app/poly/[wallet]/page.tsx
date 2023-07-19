import type { Address } from "viem";
import Wallet from "../../components/MATIC/Wallet";
import { ConnectKitButton } from "../../components/ConnectKitButton";
import { Disconnected } from "@/app/components/Disconnected";
import Toast from "@/app/components/Toast";

export default function Page({ params }: { params: { wallet: Address } }) {
  return (
    <div className="min-h-screen my-16">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10 grid justify-center place-items-center align-middle">
            <h1 className="text-6xl font-bold">Buddy Wallet</h1>
            <h2 className="pb-4 font-normal text-md">{params.wallet}</h2>
            <Disconnected>
              <ConnectKitButton />
            </Disconnected>
          </div>
        </div>
      </div>
      <Wallet buddy={params.wallet} />
      <Disconnected>
        <Toast>
          <p className="text-center">
            You are in view-only mode. <br /> If you're the owner, connect your
            wallet to interact.
          </p>
        </Toast>
      </Disconnected>
    </div>
  );
}
