"use client";

import { useState, useEffect } from "react";
import { opAlchemy } from "../../utils/constants";
import {
  OwnedNft,
  AssetTransfersResponse,
  AssetTransfersResult,
  AssetTransfersCategory,
  OwnedToken,
} from "alchemy-sdk";
import { Address } from "wagmi";
import ErrorToast from "../ErrorToast";
import Image from "next/image";
import { usePagination } from "@mantine/hooks";
import Link from "next/link";
import { formatEther } from "viem";
import { useSearchParams } from "next/navigation";
import { polyProviderClient } from "../../utils/constants";
import AddAssets from "../AddAssets";

type Props = {
  buddy: Address;
};

export default function Wallet({ buddy }: Props) {
  const [nfts, setNfts] = useState<OwnedNft[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("NFTs");
  const [tokens, setTokens] = useState<OwnedToken[]>([]);
  const [transactions, setTransactions] = useState<AssetTransfersResult[]>([]);
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const alt = searchParams.get("alt");
  const name = searchParams.get("name");
  const [deployed, setDeployed] = useState(false);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  /**
   * @dev Checks if the account is already deployed
   * @notice This is a workaround because Tokenbound does not handle state if the account is already deployed
   */
  useEffect(() => {
    const getBytecode = async () => {
      try {
        // If no buddy is available then return
        if (!buddy) return;

        // Get the bytecode of the buddy
        if (buddy) {
          const bytecode = await polyProviderClient.getBytecode({
            address: buddy,
          });

          // If the bytecode is undefined then the account is not deployed
          if (bytecode === undefined) {
            setDeployed(false);

            // If the bytecode is not undefined then the account is deployed
          } else if (bytecode !== undefined) {
            setDeployed(true);
          }
        }
      } catch (err: any) {
        console.log(err?.message);
      }
    };

    getBytecode();
  }, [buddy]);

  /**
   * Get the NFTs from the Buddy address
   */
  useEffect(() => {
    async function getNftsFromBuddy() {
      try {
        let nftArray = [] as OwnedNft[];
        const nftsIterable = opAlchemy.nft.getNftsForOwnerIterator(
          buddy as Address
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
    getNftsFromBuddy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buddy]);

  /**
   * Get the tokens from the Buddy address
   */
  useEffect(() => {
    async function getTokensFromBuddy() {
      try {
        let tokenArray = [] as OwnedToken[];
        const allTokens = await opAlchemy.core.getTokensForOwner(
          buddy as Address
        );
        for await (const token of allTokens.tokens) {
          tokenArray.push(token as OwnedToken);
        }
        setTokens(tokenArray);
      } catch (err: any) {
        setErrorMsg("An error occurred while fetching tokens");
        console.log(err?.message);
      }
    }

    getTokensFromBuddy();
  }, [buddy]);

  /**
   * Get all transactions from the buddy address
   * @returns transactions
   */

  useEffect(() => {
    async function getTransactionsFromBuddy() {
      try {
        let allTransactions: AssetTransfersResponse =
          await opAlchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: buddy as Address,
            excludeZeroValue: true,
            category: [
              AssetTransfersCategory.EXTERNAL,
              AssetTransfersCategory.ERC721,
              AssetTransfersCategory.ERC1155,
              AssetTransfersCategory.INTERNAL,
              AssetTransfersCategory.ERC20,
            ],
          });
        setTransactions(allTransactions?.transfers);
      } catch (err: any) {
        setErrorMsg("An error occurred while fetching transactions");
        console.log(err?.message);
      }
    }
    getTransactionsFromBuddy();
  }, [buddy]);

  /**
   * Pagination logic for collectibles
   */
  const NFTS_PER_PAGE = 6;
  const totalNFTs = nfts ? nfts.length : 0;
  const totalPages = Math.ceil(totalNFTs / NFTS_PER_PAGE);
  const [visibleNFTs, setVisibleNFTs] = useState(nfts.slice(0, NFTS_PER_PAGE));
  const pagination = usePagination({
    total: totalPages,
    initialPage: 1,
    onChange(page) {
      const start = (page - 1) * NFTS_PER_PAGE;
      const end = start + NFTS_PER_PAGE;
      setVisibleNFTs(nfts.slice(start, end));
    },
  });
  // Set the visible NFTs when the nfts array changes
  useEffect(() => {
    if (nfts.length > 0) {
      setVisibleNFTs(nfts.slice(0, NFTS_PER_PAGE));
    }
  }, [nfts]);

  /**
   * Pagination logic for tokens
   */
  const TOKENS_PER_PAGE = 8;
  const totalTokens = tokens ? tokens.length : 0;
  const totalTokenPages = Math.ceil(totalTokens / TOKENS_PER_PAGE);
  const [visibleTokens, setVisibleTokens] = useState(
    tokens.slice(0, TOKENS_PER_PAGE)
  );
  const tokenPagination = usePagination({
    total: totalTokenPages,
    initialPage: 1,
    onChange(page) {
      const start = (page - 1) * TOKENS_PER_PAGE;
      const end = start + TOKENS_PER_PAGE;
      setVisibleTokens(tokens.slice(start, end));
    },
  });
  // Set the visible tokens when the tokens array changes
  useEffect(() => {
    if (tokens.length > 0) {
      setVisibleTokens(tokens.slice(0, TOKENS_PER_PAGE));
    }
  }, [tokens]);

  return (
    <>
      {deployed ? (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 mx-8 md:mx-12">
          <div className="xs:col-span-1 md:col-span-2">
            <div className="md:flex md:flex-row flex-col">
              <div className="w-full">
                <h2 className="text-2xl">{name}</h2>
                <div className="grid p-4">
                  <Image
                    src={src || ""}
                    alt={alt || ""}
                    width={480}
                    height={480}
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="w-full p-4 rounded-md">
                <div className="tabs">
                  <h2
                    className={`md:text-2xl text-lg tab ${
                      activeTab === "NFTs"
                        ? "bg-neutral text-white rounded-md"
                        : ""
                    }`}
                    onClick={() => handleTabClick("NFTs")}
                  >
                    COLLECTIBLES
                  </h2>
                  <h2
                    className={`md:text-2xl text-lg tab ${
                      activeTab === "COINS"
                        ? "bg-neutral text-white rounded-md"
                        : ""
                    }`}
                    onClick={() => handleTabClick("COINS")}
                  >
                    COINS
                  </h2>
                </div>
                <div
                  id="nfts"
                  style={{ display: activeTab === "NFTs" ? "block" : "none" }}
                >
                  <div className="flex flex-row justify-between pt-4">
                    <span className="text-xs text-neutral">
                      Available [{nfts?.length}]:
                    </span>
                    {/* <Connected>
                      <AddAssets />
                    </Connected> */}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {visibleNFTs?.map((nft: any, index: number) => (
                      <div key={index}>
                        <Image
                          src={nft.media[0]?.gateway}
                          width={200}
                          height={200}
                          alt="Image"
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  {visibleNFTs?.length > 0 && visibleNFTs?.length > 6 && (
                    <div className="btn-group flex justify-center items-center mt-2 gap-4">
                      <button
                        className="btn btn-ghost"
                        onClick={pagination.previous}
                      >
                        «
                      </button>
                      <h2>{pagination.active}</h2>
                      <button
                        className="btn btn-ghost"
                        onClick={pagination.next}
                      >
                        »
                      </button>
                    </div>
                  )}
                </div>
                <div
                  id="coins"
                  style={{ display: activeTab === "COINS" ? "block" : "none" }}
                >
                  <div className="flex flex-row justify-between pt-4">
                    <span className="text-xs text-neutral">
                      Available [{tokens?.length}]:
                    </span>
                    {/* <Connected>
                      <AddAssets />
                    </Connected> */}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>COIN</th>
                          <th>AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleTokens.map((token: any, index: number) => (
                          <tr key={index}>
                            <td></td>
                            <td>{token?.symbol}</td>
                            <td>{token?.balance}</td>
                          </tr>
                        ))}
                      </tbody>
                      {visibleTokens?.length > 0 &&
                        visibleTokens?.length > 8 && (
                          <div className="btn-group flex justify-center items-center mt-2 gap-4">
                            <button
                              className="btn btn-ghost"
                              onClick={tokenPagination.previous}
                            >
                              «
                            </button>
                            <h2>{tokenPagination.active}</h2>
                            <button
                              className="btn btn-ghost"
                              onClick={tokenPagination.next}
                            >
                              »
                            </button>
                          </div>
                        )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="w-full ">
              <h2 className="text-2xl">Recent Activity</h2>
              <span className="text-xs text-neutral">
                View All Recent Activity
              </span>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Transcation Hash</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    {transactions?.length > 0 ? (
                      transactions?.map((transaction: any, index: number) => (
                        <tr key={index}>
                          <th></th>

                          <td className="truncate text-ellipsis">
                            <Link
                              href={`https://etherscan.io/tx/${transaction?.hash}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {transaction?.hash.slice(0, 3)}...
                              {transaction?.hash.slice(-10)}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`https://etherscan.io/address/${transaction?.from}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {transaction?.from.slice(0, 3)}...
                              {transaction?.from.slice(-10)}
                            </Link>
                          </td>
                          <td>
                            <Link
                              href={`https://etherscan.io/address/${transaction?.to}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {transaction?.to.slice(0, 3)}...
                              {transaction?.to.slice(-10)}
                            </Link>
                          </td>
                          <td>
                            {Number(formatEther(transaction?.value)).toFixed(5)}{" "}
                            ETH
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <th></th>
                        <td>No Transactions Yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {errorMsg && <ErrorToast message={errorMsg} />}
        </div>
      ) : (
        <div className="grid justify-center items-center text-center">
          <h2 className="text-3xl">This Buddy Isn't Deployed Yet!</h2>
          <h2 className="text-xl">
            Please navigate back and deploy the account.
          </h2>
        </div>
      )}
    </>
  );
}
