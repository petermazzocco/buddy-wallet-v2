"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWalletClient, useNetwork } from "wagmi";
import { mainnet, polygon, optimism } from "viem/chains";

export default function ChainMenu() {
  const router = useRouter();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const [chainName, setChainName] = useState("eth");

  async function handleChange(e: any) {
    const selectedChain = e.target.getAttribute("data-value");
    // Update the route based on the selected chain
    if (selectedChain === "eth") {
      await walletClient?.switchChain({ id: mainnet.id });
      router.push("/eth");
    } else if (selectedChain === "poly") {
      await walletClient?.switchChain({ id: polygon.id });
      router.push("/poly");
    } else if (selectedChain === "op") {
      await walletClient?.switchChain({ id: optimism.id });
      router.push("/op");
    }
  }

  useEffect(() => {
    if (chain?.id === 1) {
      setChainName("Ethereum");
    } else if (chain?.id === 137) {
      setChainName("Polygon");
    } else if (chain?.id === 10) {
      setChainName("Optimism");
    }
  }, [chain]);

  return (
    <>
      <details className="dropdown mb-32">
        <summary className="m-1 btn btn-ghost btn-sm">
          {chainName}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="black"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <li>
            <a onClick={handleChange} data-value="eth">
              Ethereum
            </a>
          </li>
          <li>
            <a onClick={handleChange} data-value="poly">
              Polygon
            </a>
          </li>
          <li>
            <a onClick={handleChange} data-value="op">
              Optimism
            </a>
          </li>
        </ul>
      </details>
    </>
  );
}
