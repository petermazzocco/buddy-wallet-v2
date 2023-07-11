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
  const [account, setAccount] = useState("");
  const [to, setTo] = useState("");
  const [value, setValue] = useState(0);
  const [data, setData] = useState("");
  // Execute a call on the Tokenbound contract
  async function executeCall() {
    try {
      setLoading(true);
      if (walletClient && chain) {
        const tokenboundClient = new TokenboundClient({
          //@ts-ignore
          walletClient,
          chainId: chain?.id,
        });

        const tx = await tokenboundClient.executeCall({
          account: buddy,
          to: to,
          value: BigInt(value),
          data: "",
        });
        setHash(tx);
        console.log(tx);
        setLoading(false);
        setSuccess("Transaction sent successfully!");
      }
    } catch (err: any) {
      console.log(err?.message);
      setError("An error occured.");
    }
  }
  return (
    <div>
      <form className="grid justify-center space-y-2">
        <input
          className="input input-bordered"
          placeholder="To Address"
          type="text"
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Amount"
          type="number"
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button className="btn btn-primary" onClick={executeCall} type="button">
          Transact
        </button>
        {hash && <p className="text-xs">{hash}</p>}
      </form>

      {success && <SuccessToast message={success} />}
      {error && <ErrorToast message={error} />}
    </div>
  );
}
