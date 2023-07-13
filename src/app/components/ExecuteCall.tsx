import { TokenboundClient } from "@tokenbound/sdk";
import { useWalletClient, useNetwork, Address } from "wagmi";
import { useState } from "react";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";

type Props = {
  buddy: Address;
};

export default function ExecuteCall({ buddy }: Props) {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState(0);

  // Execute a call on the Tokenbound contract to send tokens
  async function executeCall() {
    try {
      // Handle loading state
      setLoading(true);

      // If the wallet client and chain are available, create a new Tokenbound client
      if (walletClient && chain) {
        const tokenboundClient = new TokenboundClient({
          //@ts-ignore
          walletClient,
          chainId: chain?.id,
        });

        // Execute the call
        const tx = await tokenboundClient.executeCall({
          account: buddy,
          to: to,
          value: BigInt(value),
          data: "",
        });
        // Set the hash and loading state
        setHash(tx);
        console.log(tx);
        setLoading(false);
        setSuccess("Transaction sent successfully!");
      }

      // Handle error state
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
