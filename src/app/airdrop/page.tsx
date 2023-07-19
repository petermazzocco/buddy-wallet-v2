import Image from "next/image";
import airdrop from "../public/img/airdrop.png";

export default function Page() {
  return (
    <div className="min-h-screen my-16">
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-full mx-10 grid justify-center place-items-center align-middle">
            <h1 className="text-6xl font-bold">Buddy drop</h1>
            <h2 className="text-2xl">A New Way To Airdrop</h2>
            <Image width={200} height={200} src={airdrop} alt="logo" />
          </div>
        </div>
      </div>
      <div className="hero grid justify-center">
        <div className="hero-content text-center">
          <div className="max-w-md mx-10 grid justify-center place-items-center align-middle space-y-6">
            <div>
              <h2 className="text-2xl">Nested Rewards</h2>
              <p>
                Buddy Drop is an easy, all-in-one tool to airdrop all kinds of
                tokens to ERC6551 compatible wallets. Great for gaming assets,
                reward tokens, and much more!
              </p>
            </div>
            <div className="w-[20rem] h-[5rem] rounded-md bg-neutral grid items-center">
              <h2 className="text-white text-4xl">COMING AUGUST 2023</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
