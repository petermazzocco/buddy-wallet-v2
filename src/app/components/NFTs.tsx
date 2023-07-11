"use client";

import { useState, useEffect } from "react";
import { OwnedNFT, alchemy } from "../utils/constants";
import { useAccount } from "wagmi";
import { usePagination } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../public/img/logo.png";
import Image from "next/image";
import { Connected } from "./Connected";
import DeployAccount from "./DeployAccount";

export default function NFTs() {
  const [nfts, setNfts] = useState<OwnedNFT[]>([]); // NFTs owned by the connected address
  const { address, isConnected } = useAccount(); // Connected address via Wagmi
  const [modal, setModal] = useState(false); // Modal for sending NFT
  const [errorMsg, setErrorMsg] = useState(""); // Error message
  const [selectedNft, setSelectedNft] = useState<number | null>(null); // Selected NFT
  const [copied, setCopied] = useState(false); // Copied to clipboard
  const [visible, setVisible] = useState(false); // Transaction visibility
  const [buddy, setBuddy] = useState(""); // Buddy Wallet

  /**
   * Get the NFT data for the connected address
   * @returns nfts
   */
  useEffect(() => {
    async function getNftsForOwner() {
      if (isConnected) {
        try {
          let nftArray = [] as OwnedNFT[];
          const nftsIterable = alchemy.nft.getNftsForOwnerIterator(
            address as string
          );
          for await (const nft of nftsIterable) {
            nftArray.push(nft as OwnedNFT);
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

  // Logic to switch between Asset and Transfer components
  const handleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <Connected>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-4">
        {/* Display only if connected and filter out removed NFTs */}
        {visibleNFTs
          ?.filter((nft: any) => nft.title !== "")
          .map((nft: any, index: number) => (
            <div
              className="card bg-gray-200 rounded-md p-3 space-y-1"
              key={index}
            >
              <h2 className="label truncate text-ellipsis">{nft.title}</h2>
              <img
                src={nft.media[0]?.gateway}
                className="rounded-lg object-center object-cover w-80 h-80"
                alt={nft.title}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = "../public/img/fallback.jpeg";
                  e.currentTarget.className =
                    "rounded-lg object-center object-cover w-80 h-80";
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setSelectedNft(index);
                  openModal();
                  // handleAddress(nft.contract.address, nft.tokenId);
                }}
                className="btn btn-primary"
              >
                View Buddy Wallet
              </button>

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
                          className="btn btn-circle btn-outline glass hover:btn-info text-black"
                        >
                          x
                        </button>

                        <div className="flex">
                          <Image width={50} height={50} src={logo} alt="logo" />
                        </div>
                      </div>
                      <h2 className="text-center text-xl sm:text-3xl mb-0 md:mb-2 text-black mt-6">
                        {nft.title}&apos;s Buddy Wallet
                      </h2>
                      <div className="divider "></div>
                      <div className="grid justify-center">
                        <div className="grid xs:grid-cols-1 md:grid-cols-1 xs:space-x-0 md:space-x-4">
                          <div className="col-span-1">
                            <div className="relative">
                              <img
                                src={nft.media[0]?.gateway}
                                className="rounded-md w-72 h-72 object-cover"
                                alt={nft.title}
                                onError={(
                                  e: React.SyntheticEvent<
                                    HTMLImageElement,
                                    Event
                                  >
                                ) => {
                                  e.currentTarget.src = "./fallback.jpeg";
                                  e.currentTarget.className =
                                    "w-72 h-72 rounded-lg object-cover object-center";
                                }}
                              />

                              <a
                                href={`https://goerli.etherscan.io/address/${buddy}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <button
                                  className="absolute bottom-2 left-2 btn btn-circle text-black glass hover:btn-info tooltip items-center grid"
                                  data-tip="Etherscan"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-search"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                  </svg>
                                </button>
                              </a>
                              {!copied ? (
                                <button
                                  onClick={() => copyAddress()}
                                  className="absolute bottom-2 right-2 btn btn-circle text-black glass hover:btn-info tooltip items-center grid"
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
                                  className="absolute bottom-2 right-2 btn btn-circle btn-success tooltip items-center grid"
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
                            <label className="label">
                              <span className="label-text-alt">
                                View On Etherscan
                              </span>
                              <span className="label-text-alt">
                                Copy Address
                              </span>
                            </label>
                          </div>
                          <div className="col-span-1">
                            {!visible ? (
                              <div>
                                {/* <Assets buddy={buddy} /> */}
                                <DeployAccount
                                  tokenContract={nft.contract.address}
                                  tokenId={nft.tokenId}
                                />
                              </div>
                            ) : (
                              <div className="grid justify-center space-y-2 w-full">
                                {/* <TransferTo buddy={buddy} name={nft.title} /> */}

                                <button
                                  className="btn btn-primary"
                                  onClick={handleVisibility}
                                >
                                  View Available Assets
                                </button>
                              </div>
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
    </Connected>
  );
}
