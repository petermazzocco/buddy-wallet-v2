"use client";

declare global {
  interface Window {
    my_modal_1: any;
  }
}
interface Props {
  name: string | undefined;
}

import { ethAlchemy } from "../../utils/constants";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import type { OwnedToken } from "alchemy-sdk";
import type { Address } from "viem";
import ErrorToast from "@/app/components/ErrorToast";

export default function AirdropToAddresses({ name }: Props) {
  const [listOfNfts, setListOfNfts] = useState<string[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<string | undefined>(
    undefined
  );
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const { address, isConnected } = useAccount();
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * Get the EC20 tokens for the connected address
   * @returns tokens
   */
  useEffect(() => {
    async function getTokensForOwner() {
      if (isConnected) {
        try {
          let response = await ethAlchemy.core.getTokensForOwner(
            address as Address
          );
          setTokens(response.tokens);
        } catch (err: any) {
          setErrorMsg("An error occurred while fetching tokens");
          console.log(err?.message);
        }
      }
      if (!isConnected) return;
    }

    getTokensForOwner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div>
      <button
        className="btn btn-sm btn-secondary w-full"
        onClick={() => window.my_modal_1.showModal()}
      >
        Airdrop to Individual Addresses
      </button>
      <dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle ">
        <form method="dialog" className="modal-box text-neutral bg-base-100">
          <div className="space-y-4 p-8 rounded-lg grid justify-center items-center">
            <h2 className="font-bold text-2xl text-center">
              Airdrop To Selected {name} Buddy Wallets
            </h2>
            <div className="divider"></div>
            <div className="join">
              <input
                className="input input-bordered join-item w-full input-sm text-neutral"
                placeholder="Enter Token ID"
                type="number"
                onChange={(e) => setSelectedNfts(e.target.value)}
              />
              <button
                className="btn join-item btn-sm btn-neutral"
                type="button"
                onClick={() => {
                  if (selectedNfts && !listOfNfts.includes(selectedNfts)) {
                    setListOfNfts((prevList) => [...prevList, selectedNfts]);
                    setSelectedNfts(""); // Clear the selected token after adding
                  }
                }}
              >
                Add To List
              </button>
            </div>
            <div className="join join-horizontal text-neutral ">
              <input
                type="number"
                placeholder="Enter Amount"
                className="input input-bordered input-sm w-full max-w-xs join-item"
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
              <select
                className="select select-bordered select-sm w-full max-w-xs join-item bg-neutral text-base-100"
                onChange={(e) => setSelectedToken(e.target.value)}
                value={selectedToken}
              >
                <option disabled defaultValue={"Select A Token"}>
                  Select A Token
                </option>
                {tokens.map((token, i) => (
                  <option key={i}>{token.symbol}</option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-sm text-lg w-full btn-secondary justify-self-center"
              type="button"
            >
              Send Airdrop
            </button>
            <div className="modal-action">
              <button className="btn btn-ghost">Exit</button>
            </div>
          </div>
        </form>
      </dialog>
      {errorMsg && <ErrorToast message={errorMsg} />}
    </div>
  );
}
