"use client";

import { useState, useEffect } from "react";
import { OwnedNFT, alchemy, providerClient } from "../utils/constants";
import { useAccount, useWalletClient, useNetwork, Address } from "wagmi";
import { usePagination } from "@mantine/hooks";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../public/img/logo.png";
import Image from "next/image";
import { Connected } from "./Connected";
import DeployAccount from "./DeployAccount";
import ErrorToast from "./ErrorToast";
import { TokenboundClient } from "@tokenbound/sdk";
import ExecuteCall from "./ExecuteCall";

export default function NFTs() {
  const [nfts, setNfts] = useState<OwnedNFT[]>([]); // NFTs owned by the connected address
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

  // Find the ERC6551 address from the selected NFT
  // Check if the ERC6551 address is deployed via bytecode
  const handleAddress = async (tokenContract: string, tokenId: string) => {
    try {
      let tba = "";
      // Instantiate the TokenboundClient
      if (walletClient && chain) {
        const tokenbound = new TokenboundClient({
          //@ts-ignore
          walletClient,
          chainId: chain?.id,
        });
        // Get the ERC6551 address
        tba = tokenbound.getAccount({
          tokenContract,
          tokenId,
        });
      }
      setBuddy(tba); // Set the ERC721 address
    } catch (err: any) {
      setErrorMsg("An error occured while getting the address");
    }
  };

  /**
   * @dev Check if the ERC721 address is deployed
   * @returns deployed boolean
   */
  useEffect(() => {
    async function fetchBytecode() {
      try {
        const bytecode = await providerClient.getBytecode({
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
              />

              <button
                type="button"
                onClick={() => {
                  setSelectedNft(index);
                  openModal();
                  handleAddress(nft.contract.address, nft.tokenId);
                }}
                className="btn-sm btn-neutral rounded-md"
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
                                  <span className="indicator-item badge badge-neutral">
                                    {buddy.slice(0, 4)}...
                                    {buddy.slice(buddy.length - 4)}
                                  </span>
                                )}
                                <Image
                                  width={280}
                                  height={280}
                                  src={nft.media[0]?.gateway}
                                  alt={nft.title}
                                />
                              </div>
                              <a
                                href={`https://goerli.etherscan.io/address/${buddy}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <button
                                  className="absolute bottom-3 left-3 btn btn-circle bg-white bg-opacity-40 text-black btn-outline tooltip items-center grid"
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
                            </div>
                          </div>
                          <div className="col-span-1 space-y-2">
                            {!deployed ? (
                              <DeployAccount
                                tokenContract={nft.contract.address}
                                tokenId={nft.tokenId}
                                buddy={buddy as Address}
                              />
                            ) : (
                              <p className="text-sm">
                                This Buddy Is Deployed
                                <br />
                                Transaction support coming soon.
                              </p>
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
