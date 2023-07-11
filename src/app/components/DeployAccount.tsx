// import { TokenboundClient } from "@tokenbound/sdk";
import { useWalletClient, useNetwork } from "wagmi";
import type { Address } from "viem";
import { useState } from "react";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

type Props = {
  tokenContract: Address;
  tokenId: string;
};

export default function DeployAccount({ tokenContract, tokenId }: Props) {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const [buddyAccount, setBuddyAccount] = useState<Address>();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * @dev Deploys a Tokenbound account for the selected NFT
   * @param tokenContract The address of the NFT contract
   * @param tokenId The ID of the NFT
   */
  // async function deployAccount() {
  //   try {
  //     setLoading(true);
  //     // Instantiate the TokenboundClient
  //     if (walletClient && chain) {
  //       const tokenboundClient = new TokenboundClient({
  //         //@ts-ignore
  //         walletClient,
  //         chainId: chain?.id,
  //       });

  //       // Deploy the account
  //       const account = await tokenboundClient.createAccount({
  //         tokenContract,
  //         tokenId,
  //       });
  //       // Set the account
  //       console.log(account);
  //       setBuddyAccount(account);
  //       setSuccess("Account deployed successfully!");
  //       setLoading(false);
  //     }
  //   } catch (err: any) {
  //     console.log(err?.message);
  //     setError("An error occured");
  //     setLoading(false);
  //   }
  // }

  return (
    <>
      {buddyAccount ? (
        <p>Account is deployed!</p>
      ) : (
        <button
          className="btn btn-primary"
          // onClick={deployAccount}
          type="button"
        >
          {loading ? "Deploying..." : "Deploy Account"}
        </button>
      )}
      {!buddyAccount && (
        <p className="text-[0.5rem]">Deploying an account requires gas fees.</p>
      )}
      {success && <SuccessToast message={success} />}
      {error && <ErrorToast message={error} />}
    </>
  );
}
