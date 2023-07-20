"use client";

import { useNetwork } from "wagmi";
import Link from "next/link";
import Image from "next/image";
export default function WalletButton() {
  const { chain } = useNetwork();

  if (chain?.id === undefined) {
    return (
      <div className="indicator">
        <span className="indicator-item badge  text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-wallet"
            viewBox="0 0 16 16"
          >
            <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
          </svg>
        </span>
        <Link href="/eth">
          <button className="btn btn-neutral text-xl border-2 text-white">
            Wallet
          </button>
        </Link>
      </div>
    );
  }
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
