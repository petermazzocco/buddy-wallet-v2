"use client";

import { Connected } from "../../components/Connected";
import { Disconnected } from "../../components/Disconnected";
import { ConnectKitButton } from "connectkit";
import { ethAlchemy } from "../../utils/constants";
import { useState } from "react";
import { useAccount } from "wagmi";
import type { NftContract } from "alchemy-sdk";
import ErrorToast from "@/app/components/ErrorToast";
import FindTokens from "./FindTokens";

export default function BuddyDrop() {
  const [nftContract, setNftContract] = useState("");
  const { isConnected } = useAccount();
  const [nftMetadata, setNftMetadata] = useState<NftContract>();
  const [errorMsg, setErrorMsg] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  /**
   * Get Contract metadat from a project's contract address
   * @returns metadata
   */
  async function getContractMetadata() {
    if (isConnected) {
      try {
        const response = await ethAlchemy.nft.getContractMetadata(nftContract);
        setNftMetadata(response);
      } catch (err: any) {
        setErrorMsg("An error occurred while fetching contract");
        console.log(err?.message);
      }
    }
    if (!isConnected) return;
  }

  return (
    <div className="hero justify-center">
      <Disconnected>
        <ConnectKitButton />
      </Disconnected>
      <Connected>
        <div className="place-items-center">
          <h1 className="mb-4 text-center">
            All-In-One Airdrop Tool for ERC6551 Accounts
          </h1>
          {nftMetadata && (
            <div className="grid justify-center items-center my-10 w-full">
              <div className="max-w-xs border border-neutral border-opacity-20 p-4 rounded-lg shadow-lg">
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
                  <FindTokens
                    name={nftMetadata.name}
                    nftAddress={nftContract as `0x${string}`}
                  />
                </div>
              </div>
            </div>
          )}

          <form className="grid justify-center space-y-4">
            <input
              className="input input-bordered input-sm input-lg"
              placeholder="Enter Contract Address"
              onChange={(e) => setNftContract(e.target.value)}
            />
            <button
              className="btn btn-sm btn-neutral"
              type="button"
              onClick={getContractMetadata}
            >
              Find NFTs
            </button>
          </form>
        </div>
      </Connected>
      {errorMsg && <ErrorToast message={errorMsg} />}
    </div>
  );
}
