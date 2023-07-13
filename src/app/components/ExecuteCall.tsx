"use client";

import { Address, useWalletClient } from "wagmi";
import { useState } from "react";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";
import { TokenboundClient } from "@tokenbound/sdk";
import { goerli } from "viem/chains";

type Props = {
  account: Address;
};

export default function ExecuteCall({ account }: Props) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState(0);
  const { data: walletClient } = useWalletClient();

  const tokenboundClient = new TokenboundClient({
    //@ts-ignore
    walletClient,
    chainId: goerli.id,
  });

  // Execute a call on the Tokenbound contract to send tokens
  async function executeCall() {
    try {
      setLoading(true);
      // If the client or buddy address is not available, return
      if (!tokenboundClient || !account) return;

      const tx = await tokenboundClient.executeCall({
        account: account,
        to: to,
        value: BigInt(value.toString()), // Replacement for 0n (preES2020)
        data: "0x",
      });
      setHash(tx);
      setSuccess("Transaction sent successfully!");
      setLoading(false);
    } catch (err: any) {
      console.log(err?.message);
      setError("An error occured.");
    }
  }
  return (
    <div>
      <form className="grid justify-center space-y-2 w-full">
        <input
          className="input input-bordered input-sm"
          placeholder="To Address"
          type="text"
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="input input-bordered input-sm"
          placeholder="Amount"
          type="number"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button
          className="btn btn-neutral btn-sm rounded-md"
          onClick={executeCall}
          type="button"
        >
          {!loading ? "Send" : "Sending..."}
        </button>
        {hash && (
          <p className="text-xs text-left">
            Hash: {hash.slice(0, 2)}...{hash.slice(hash.length - 4)}
          </p>
        )}
      </form>
      {success && <SuccessToast message={success} />}
      {error && <ErrorToast message={error} />}
    </div>
  );
}
