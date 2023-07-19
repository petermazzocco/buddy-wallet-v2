"use client";

import { useNetwork } from "wagmi";
import Link from "next/link";
import Image from "next/image";
export default function WalletButton() {
  const { chain } = useNetwork();

  if (chain?.id === 1) {
    return (
      <div className="indicator">
        <span className="indicator-item badge  text-white">
          <Image
            width={15}
            height={15}
            src={"https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025"}
            alt="logo"
            className="py-5"
          />
        </span>
        <Link href="/eth">
          <button className="btn btn-neutral text-xl border-2 text-white">
            Wallet
          </button>
        </Link>
      </div>
    );
  }
  if (chain?.id === 137) {
    return (
      <div className="indicator">
        <span className="indicator-item badge  text-white">
          <Image
            width={15}
            height={15}
            src={"https://cryptologos.cc/logos/polygon-matic-logo.png?v=025"}
            alt="logo"
            className="py-5"
          />
        </span>
        <Link href="/poly">
          <button className="btn btn-neutral text-xl border-2 text-white">
            Wallet
          </button>
        </Link>
      </div>
    );
  }

  if (chain?.id === 10) {
    return (
      <div className="indicator">
        <span className="indicator-item badge  text-white">
          <Image
            width={15}
            height={15}
            src={
              "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=025"
            }
            alt="logo"
            className="py-5"
          />
        </span>
        <Link href="/op">
          <button className="btn btn-neutral text-xl border-2 text-white">
            Wallet
          </button>
        </Link>
      </div>
    );
  }
}
