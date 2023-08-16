"use client";

declare global {
  interface Window {
    my_modal: any;
  }
}

interface Props {
  name: string | undefined;
  nftAddress: `0x${string}` | undefined;
}

import { ethAlchemy } from "../../utils/constants";
import { useState, useEffect } from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import type { OwnedToken, Nft } from "alchemy-sdk";
import { usePagination } from "@mantine/hooks";
import ErrorToast from "@/app/components/ErrorToast";

export default function FindTokens({ name, nftAddress }: Props) {
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const { address, isConnected } = useAccount();
  const [errorMsg, setErrorMsg] = useState("");
  const [amount, setAmount] = useState<number>();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [allNftsChecked, setAllNftsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );

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
   * Get all the NFTs from a project's contract address
   * @returns nfts
   */
  useEffect(() => {
    async function getNFTsFromAddress() {
      if (isConnected && nftAddress) {
        try {
          setLoading(true);
          let allNfts = [];
          let nftsIterable =
            ethAlchemy.nft.getNftsForContractIterator(nftAddress);
          for await (const nft of nftsIterable) {
            allNfts.push(nft);
          }
          setNfts(allNfts);
          setLoading(false);
        } catch (err: any) {
          setErrorMsg("An error occurred while fetching tokens");
          console.log(err?.message);
        }
      }
      if (!isConnected && !nftAddress) return;
    }
    getNFTsFromAddress();
  }, [nftAddress]);

  const ITEMS_PER_PAGE = 5;
  const totalNFTs = nfts ? nfts.length : 0;
  const totalPages = Math.ceil(totalNFTs / ITEMS_PER_PAGE);
  const [visibleNFTs, setVisibleNFTs] = useState(nfts.slice(0, ITEMS_PER_PAGE));
  const pagination = usePagination({
    total: totalPages,
    initialPage: 1,
    onChange(page) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      setVisibleNFTs(nfts.slice(start, end));
    },
  });
  // Set the visible NFTs when the nfts array changes
  useEffect(() => {
    if (nfts.length > 0) {
      setVisibleNFTs(nfts.slice(0, ITEMS_PER_PAGE));
    }
  }, [nfts]);

  return (
    <div>
      <button
        className="btn btn-sm btn-secondary w-full"
        onClick={() => window.my_modal.showModal()}
      >
        Initiate Airdrop
      </button>
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle ">
        <form method="dialog" className="modal-box text-base-100 bg-primary ">
          <div className="space-y-4 p-8 rounded-lg grid justify-center items-center">
            <h2 className="font-bold text-2xl text-center pb-4">
              Airdrop To {name} Buddy Wallets
            </h2>
            <div className="join join-horizontal text-neutral ">
              <input
                type="number"
                placeholder="Enter Amount"
                className="input input-bordered input-sm w-full max-w-xs join-item"
                onChange={(e) => setAmount(parseInt(e.target.value))}
              />
              <select
                className="select select-bordered select-sm w-full max-w-xs join-item"
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
            <div className="form-control">
              <label
                className="label cursor-pointer"
                onClick={() => setAllNftsChecked(!allNftsChecked)}
              >
                <h2 className="text-md text-accent">Airdrop To All NFTs</h2>
                <input
                  type="checkbox"
                  defaultChecked
                  checked={allNftsChecked}
                  className="checkbox checkbox-sm checkbox-accent"
                />
              </label>
            </div>
            {allNftsChecked
              ? null
              : loading && (
                  <span className="justify-self-center loading loading-dots loading-lg"></span>
                )}
            {allNftsChecked
              ? null
              : visibleNFTs.map((nft, i) => (
                  <>
                    <div className="grid grid-cols-3 justify-center">
                      <div className="col-span-1" key={i}>
                        <p>{nft?.title}</p>
                      </div>
                    </div>
                  </>
                ))}
            {allNftsChecked
              ? null
              : visibleNFTs.length > 0 && (
                  <div className="btn-group flex justify-center items-center mt-20 gap-4">
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={pagination.previous}
                    >
                      «
                    </button>
                    <h2>{pagination.active}</h2>
                    <button
                      className="btn btn-ghost"
                      type="button"
                      onClick={pagination.next}
                    >
                      »
                    </button>
                  </div>
                )}
            <button
              className="btn btn-sm text-lg w-1/2 btn-secondary justify-self-center"
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
