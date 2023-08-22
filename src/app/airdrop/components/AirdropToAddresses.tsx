"use client";

declare global {
  interface Window {
    my_modal_1: any;
  }
}
interface Props {
  name: string | undefined;
  tokenId: string[];
  tokenContract: string;
}

import { ethAlchemy } from "../../utils/constants";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import type { OwnedToken } from "alchemy-sdk";
import type { Address } from "viem";
import ErrorToast from "@/app/components/ErrorToast";
import { TokenboundClient } from "@tokenbound/sdk";

export default function AirdropToAddresses({
  name,
  tokenId,
  tokenContract,
}: Props) {
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const { address, isConnected } = useAccount();
  const [errorMsg, setErrorMsg] = useState("");
  const [buddy, setBuddy] = useState<string[]>([]);
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();

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

  /**
   * @dev Get the address ERC6551 address from the certain token ID's
   * @returns an array of addresses
   * Maps over all the visible NFTs and gets the address for each one
   */

  const tokenboundClient = new TokenboundClient({
    //@ts-ignore
    walletClient,
    chainId: chain?.id as number,
  });

  const handleAddress = async (tokenContract: string, tokenId: string) => {
    try {
      let tba = "";
      if (walletClient && chain) {
        tba = tokenboundClient.getAccount({
          tokenContract,
          tokenId,
        });
        setBuddy((prevBuddy) => [...prevBuddy, tba]);
      }
    } catch (err: any) {
      setErrorMsg("An error occurred while fetching addresses.");
    }
  };

  return (
    <div>
      <button
        className="btn btn-sm btn-secondary w-full"
        onClick={() => {
          window.my_modal_1.showModal();
          {
            tokenId.map((id) => {
              handleAddress(tokenContract, id);
            });
          }
        }}
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
            <div className="flex flex-row space-x-1 place-items-center align-middle">
              <h2>Airdropping To Id[s]:</h2>
              <p className="text-xs">{tokenId}</p>
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
