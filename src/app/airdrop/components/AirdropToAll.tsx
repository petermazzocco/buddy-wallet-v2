"use client";

declare global {
  interface Window {
    my_modal: any;
  }
}

interface Props {
  name: string | undefined;
  tokenId: string[] | undefined;
  nftContract: string;
}

import { ethAlchemy } from "../../utils/constants";
import { useState, useEffect } from "react";
import type { Address } from "viem";
import { useAccount, useWalletClient, useNetwork } from "wagmi";
import type { OwnedToken } from "alchemy-sdk";
import ErrorToast from "@/app/components/ErrorToast";
import { TokenboundClient } from "@tokenbound/sdk";

export default function AirdropToAll({ name, tokenId, nftContract }: Props) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const { address, isConnected } = useAccount();
  const [errorMsg, setErrorMsg] = useState("");
  const [amount, setAmount] = useState<number>();
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );
  const [buddies, setBuddies] = useState<string[]>([]);
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();

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
   * @dev Get the address ERC6551 address from the NFTs
   * @returns an address
   * Maps over ALL NFTs and gets the address for each one
   */

  const tokenboundClient = new TokenboundClient({
    //@ts-ignore
    walletClient,
    chainId: chain?.id as number,
  });

  const handleAddress = async (tokenContract: string, tokenId: string) => {
    try {
      let tba = "";
      let tbaIterable = [];
      if (walletClient && chain) {
        tba = tokenboundClient.getAccount({
          tokenContract,
          tokenId,
        });
        for await (const address of tba) {
          tbaIterable.push(address);
        }
        setBuddies(tbaIterable);
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
          window.my_modal.showModal();
          tokenId?.map((token) => handleAddress(nftContract, token));
          console.log(tokenId?.map((token) => token));
        }}
      >
        Airdrop To All Addresses
      </button>
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle ">
        <form method="dialog" className="modal-box text-neutral bg-base-100">
          <div className="space-y-4 p-8 rounded-lg grid justify-center items-center">
            <h2 className="font-bold text-2xl text-center">
              Airdrop To {name} Buddy Wallets
            </h2>
            <div className="divider"></div>
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
