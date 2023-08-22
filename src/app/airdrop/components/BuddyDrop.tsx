"use client";

import { Connected } from "../../components/Connected";
import { Disconnected } from "../../components/Disconnected";
import { ConnectKitButton } from "connectkit";
import { ethAlchemy } from "../../utils/constants";
import { useState, useEffect } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import type { NftContract, Nft } from "alchemy-sdk";
import ErrorToast from "@/app/components/ErrorToast";
import AirdropToAll from "./AirdropToAll";
import AirdropToAddresses from "./AirdropToAddresses";

export default function BuddyDrop() {
  const [nftContract, setNftContract] = useState("");
  const { isConnected } = useAccount();
  const [nftMetadata, setNftMetadata] = useState<NftContract>();
  const [errorMsg, setErrorMsg] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { chain } = useNetwork();
  const { isLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [allNftsChecked, setAllNftsChecked] = useState(false);
  const [listOfNfts, setListOfNfts] = useState<string[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<string[]>([]);
  const [nftTotalSupply, setNftTotalSupply] = useState<string | undefined>("");

  /**
   * Get Contract metadat from a project's contract address
   * @returns metadata
   */
  async function getContractMetadata() {
    if (isConnected) {
      try {
        const response = await ethAlchemy.nft.getContractMetadata(nftContract);
        setNftMetadata(response);
        setNftTotalSupply(response.totalSupply);
      } catch (err: any) {
        setErrorMsg("An error occurred while fetching contract");
        console.log(err?.message);
      }
    }
    if (!isConnected) return;
  }

  /**
   * Get all the NFTs from a project's contract address
   * @returns nfts
   */
  useEffect(() => {
    async function getNFTsFromAddress() {
      if (isConnected && nftContract) {
        try {
          let allNfts = [];
          let nftsIterable =
            ethAlchemy.nft.getNftsForContractIterator(nftContract);
          for await (const nft of nftsIterable) {
            allNfts.push(nft);
          }
          setNfts(allNfts);
        } catch (err: any) {
          setErrorMsg("An error occurred while fetching tokens");
          console.log(err?.message);
        }
      }
      if (!isConnected && !nftContract) return;
    }
    getNFTsFromAddress();
  }, [nftContract]);

  return (
    <div className="hero justify-center">
      <Disconnected>
        <div className="place-items-center">
          <h1 className=" text-center">
            All-In-One Airdrop Tool for ERC6551 Accounts
          </h1>
          <div className="max-w-xs text-center my-4 space-y-2">
            <p className="text-sm">
              Buddy Drop is an easy, all-in-one tool to airdrop all kinds of
              tokens to ERC6551 compatible wallets. Great for gaming assets,
              reward tokens, and much more!
            </p>
          </div>
        </div>
        <ConnectKitButton />
      </Disconnected>
      <Connected>
        <div className="place-items-center">
          <h1 className=" text-center">
            All-In-One Airdrop Tool for ERC6551 Accounts
          </h1>
          {!nftMetadata && (
            <div className="max-w-xs text-center my-4 space-y-2">
              <p className="text-sm">
                Buddy Drop is an easy, all-in-one tool to airdrop all kinds of
                tokens to ERC6551 compatible wallets. Great for gaming assets,
                reward tokens, and much more!
              </p>
            </div>
          )}
          {nftMetadata && (
            <div className="grid justify-center items-center my-10 w-full">
              <div className=" w-80 border border-neutral border-opacity-20 p-4 rounded-lg shadow-lg">
                <div className="flex flex-row justify-between items-center">
                  <h2 className="text-3xl truncate text-ellipsis w-3/4">
                    {nftMetadata.name}
                  </h2>
                  <h2 className="text-md badge badge-neutral">
                    {nftMetadata.contractDeployer?.slice(0, 2)}...
                    {nftMetadata.contractDeployer?.slice(-4)}
                  </h2>
                </div>
                <p
                  className={`text-xs ${
                    showFullDescription ? "" : " h-10 overflow-hidden"
                  }`}
                >
                  {nftMetadata.openSea?.description}
                </p>
                <button
                  className="text-primary grid justify-center w-full"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-compact-up"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-chevron-compact-down"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
                      />
                    </svg>
                  )}
                </button>

                <img
                  className="w-full rounded-lg my-4"
                  src={nftMetadata.openSea?.imageUrl}
                  alt={nftMetadata.name}
                />
                <div className="w-full">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <div className="flex flex-row items-center space-x-2">
                        <h2 className="text-md text-neutral">
                          Airdrop To All Buddy Wallets?
                        </h2>
                      </div>
                      <input
                        type="checkbox"
                        checked={allNftsChecked}
                        className="checkbox checkbox-sm checkbox-neutral"
                        onChange={(e) => setAllNftsChecked(e.target.checked)}
                      />
                    </label>
                    {allNftsChecked ? (
                      <AirdropToAll
                        name={nftMetadata.name}
                        totalSupply={nftTotalSupply}
                        nftContract={nftContract}
                      />
                    ) : (
                      <div className="form-control w-full max-w-xs">
                        <input
                          type="text"
                          className="input input-sm input-bordered w-full"
                          placeholder="Enter Token IDs"
                          onChange={(e) => {
                            const inputText = e.target.value;
                            const tokenIds = inputText
                              .split(",")
                              .map((tokenId) => tokenId.trim());
                            setSelectedNfts(tokenIds);
                          }}
                        />
                        <label className="label">
                          <span className="label-text-alt text-[.5rem]">
                            Seperate Token ID's With Commas [1, 2, 3]
                          </span>
                        </label>
                        <AirdropToAddresses
                          name={nftMetadata.name}
                          tokenId={selectedNfts}
                          tokenContract={nftContract}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </div>
          )}
          {chain?.id === 1 ? (
            <form className="grid justify-center space-y-2">
              <h2 className="text-center">Enter A Valid Ethereum Address</h2>
              <input
                className="input input-bordered input-sm input-lg"
                placeholder="0x000..."
                onChange={(e) => setNftContract(e.target.value)}
              />
              <button
                className="btn btn-sm btn-neutral text-lg"
                type="button"
                onClick={getContractMetadata}
              >
                Find NFTs
              </button>
            </form>
          ) : (
            <div className="grid justify-center">
              <button
                onClick={() => switchNetwork?.(1)} // 1 represents Ethereum's chainId
                className="btn btn-sm btn-neutral m-2"
                disabled={isLoading}
              >
                {isLoading && pendingChainId === 1
                  ? "Waiting for Approval"
                  : "Switch to Ethereum"}
              </button>
            </div>
          )}
        </div>
      </Connected>
      {errorMsg && <ErrorToast message={errorMsg} />}
    </div>
  );
}
