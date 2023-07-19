"use client";

import { useState, useEffect } from "react";
import { opProviderClient, opAlchemy } from "../../utils/constants";
import { useAccount, useWalletClient, useNetwork, Address } from "wagmi";
import { usePagination } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Connected } from "../Connected";
import DeployAccount from "./DeployAccount";
import ErrorToast from "../ErrorToast";
import type { OwnedNft } from "alchemy-sdk";
import Link from "next/link";
import { TokenboundClient } from "@tokenbound/sdk";

export default function NFTs() {
  const [nfts, setNfts] = useState<OwnedNft[]>([]); // NFTs owned by the connected address
  const { address, isConnected } = useAccount(); // Connected address via Wagmi
  const [modal, setModal] = useState(false); // Modal for sending NFT
  const [errorMsg, setErrorMsg] = useState(""); // Error message
  const [selectedNft, setSelectedNft] = useState<number | null>(null); // Selected NFT
  const [copied, setCopied] = useState(false); // Copied to clipboard
  const [buddy, setBuddy] = useState(""); // Buddy Wallet
  const { data: walletClient } = useWalletClient(); // Wallet client
  const { chain } = useNetwork(); // Chain ID
  const [deployed, setDeployed] = useState(false); // Boolean for deployed account

  /**
   * Get the ETHEREUM NFT data for the connected address
   * @returns nfts
   */
  useEffect(() => {
    async function getNftsForOwner() {
      if (isConnected) {
        try {
          let nftArray = [] as OwnedNft[];
          const nftsIterable = opAlchemy.nft.getNftsForOwnerIterator(
            address as string
          );
          for await (const nft of nftsIterable) {
            nftArray.push(nft as OwnedNft);
          }
          setNfts(nftArray);
        } catch (err: any) {
          setErrorMsg("An error occurred while fetching NFTs");
          console.log(err?.message);
        }
      }
      if (!isConnected) return;
    }
    getNftsForOwner();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  /**
   * Pagination logic
   */
  const ITEMS_PER_PAGE = 9;
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

  /**
   * @dev Get the address ERC6551 address from the NFTs
   * @returns an address
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
        setBuddy(tba);
      }
    } catch (err: any) {
      setErrorMsg("An error occurred while fetching addresses.");
    }
  };

  /**
   * @dev Check if the ERC721 address is deployed
   * @returns deployed boolean
   */
  useEffect(() => {
    async function fetchBytecode() {
      try {
        const bytecode = await opProviderClient.getBytecode({
          address: buddy as Address,
        });
        // If the bytecode is undefined, the address is not deployed
        if (bytecode === undefined) {
          setDeployed(false);

          // If the bytecode has a value, the address is deployed
        } else if (bytecode !== undefined) {
          setDeployed(true);
        }
      } catch (err: any) {
        console.log(err?.message);
      }
    }
    fetchBytecode();
  }, [buddy]);

  // Logic to open and close the modal
  const openModal = () => {
    setModal(!modal);
  };
  const closeModal = () => {
    setModal(false);
  };

  // Logic to copy the ERC721 address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(buddy);
    setCopied(true);
    // Set the copied state to false after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
    // When modal closes, set the copied state to false
    if (!modal) {
      setCopied(false);
    }
  };

  return (
    <Connected>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-4 overflow-hidden">
        {/* Display only if connected and filter out removed NFTs */}
        {visibleNFTs
          ?.filter((nft: any) => nft.title !== "")
          .map((nft: any, index: number) => (
            <div
              className="card bg-gray-200 rounded-md p-3 space-y-1"
              key={index}
            >
              <h2 className="label truncate text-ellipsis">{nft.title}</h2>
              <Image
                src={nft.media[0]?.gateway}
                alt={nft.title}
                width={320}
                height={320}
                onClick={() => {
                  setSelectedNft(index);
                  openModal();
                  handleAddress(nft.contract.address, nft.tokenId);
                }}
                className="rounded-lg object-center object-cover hover:cursor-pointer "
              />
              <div className="flex flex-row justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNft(index);
                    openModal();
                    handleAddress(nft.contract.address, nft.tokenId);
                  }}
                  className="btn-sm btn btn-ghost rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    className="bi bi-arrows-fullscreen"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal component for selected NFT only */}
              <AnimatePresence>
                {modal && selectedNft === index && (
                  <div className="fixed inset-0 top-20 flex items-center justify-center  z-50">
                    <motion.div
                      initial={{ y: 90 }}
                      animate={{ y: -50 }}
                      className="bg-gray-200 shadow-2xl shadow-black mx-8 p-8 rounded-box"
                    >
                      <div className="flex flex-row justify-between">
                        <button
                          onClick={() => {
                            closeModal();
                          }}
                          className="btn btn-ghost btn-sm text-black"
                        >
                          x
                        </button>

                        {!copied ? (
                          <button
                            onClick={() => copyAddress()}
                            className=" btn btn-ghost btn-sm  tooltip"
                            data-tip="Copy Address"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-front"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="btn btn-ghost btn-sm  tooltip"
                            data-tip="Copied"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-front"
                              viewBox="0 0 16 16"
                            >
                              <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm5 10v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2v5a2 2 0 0 1-2 2H5z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <h2 className="text-center text-xl sm:text-3xl mb-0 md:mb-2 text-black mt-6">
                        {nft.title}&apos;s Buddy Wallet
                      </h2>
                      <div className="divider "></div>
                      <div className="grid justify-center">
                        <div className="grid xs:grid-cols-1 md:grid-cols-1 xs:space-x-0 md:space-x-4">
                          <div className="col-span-1">
                            <div className="relative">
                              <div className="indicator">
                                {deployed && (
                                  <a
                                    href={`https://polygonscan.com/address/${buddy}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <span className="indicator-item badge badge-neutral hover:badge-outline hover:bg-white">
                                      {buddy.slice(0, 2)}...
                                      {buddy.slice(buddy.length - 4)}
                                    </span>
                                  </a>
                                )}
                                <Image
                                  width={280}
                                  height={280}
                                  src={nft.media[0]?.gateway}
                                  alt={nft.title}
                                  className="rounded-md"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1 pt-4">
                            {!deployed ? (
                              <DeployAccount
                                tokenContract={nft.contract.address}
                                tokenId={nft.tokenId}
                                buddy={buddy as Address}
                              />
                            ) : (
                              <Link
                                href={`/poly/${
                                  buddy as Address
                                }?src=${encodeURIComponent(
                                  nft.media[0]?.gateway
                                )}&alt=${encodeURIComponent(
                                  nft.title
                                )}&name=${encodeURIComponent(nft.title)}`}
                              >
                                <button
                                  className="btn btn-neutral text-lg"
                                  type="button"
                                >
                                  Open Wallet
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
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>
      <div className="btn-group flex justify-center items-center mt-20 gap-4">
        <button className="btn btn-ghost" onClick={pagination.previous}>
          «
        </button>
        <h2>{pagination.active}</h2>
        <button className="btn btn-ghost" onClick={pagination.next}>
          »
        </button>
      </div>
      {errorMsg && <ErrorToast message={errorMsg} />}
    </Connected>
  );
}
