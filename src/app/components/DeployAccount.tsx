import { useWalletClient, useNetwork } from "wagmi";
import type { Address } from "viem";
import { useState, useEffect } from "react";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import { providerClient, tokenboundClient } from "../utils/constants";

type Props = {
  tokenContract: Address;
  tokenId: string;
  buddy: Address;
};

export default function DeployAccount({
  tokenContract,
  tokenId,
  buddy,
}: Props) {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const [txHash, setTxHash] = useState<Address>();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  /**
   * @dev Checks if the account is already deployed
   * @notice This is a workaround for the fact that the TokenboundClient does not handle state if the account is already deployed
   */
  useEffect(() => {
    const getBytecode = async () => {
      try {
        // If no buddy is available then return
        if (!buddy) return;

        // Get the bytecode of the buddy
        if (buddy) {
          const bytecode = await providerClient.getBytecode({
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
   * @dev Deploys a Tokenbound account for the selected NFT
   * @param tokenContract The address of the NFT contract
   * @param tokenId The ID of the NFT
   */
  async function deployAccount() {
    try {
      setLoading(true);
      // Instantiate the TokenboundClient
      // Check for bytecode to see if the account is already deployed
      if (walletClient && chain && deployed === false) {
        // Deploy the account
        const tx = await tokenboundClient.createAccount({
          tokenContract,
          tokenId,
        });
        // Set the account
        if (typeof tx === "string") {
          setTxHash(tx);
          setSuccess("Account deployed successfully!");
        } else {
          setError("Invalid account address received");
        }
      }
    } catch (err: any) {
      console.log(err?.message);
      setError("An error occured");
      setLoading(false);
    }
  }

  return (
    <>
      {!deployed && (
        <>
          <button
            className="btn-sm btn-neutral rounded-md"
            onClick={deployAccount}
            type="button"
          >
            {loading ? "Deploying..." : "Deploy Account"}
          </button>
          <p className="text-[0.5rem]">
            Deploying an account requires gas fees.
          </p>
          {txHash && (
            <button className="btn-sm btn-neutral rounded-md">
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                Hash: {txHash.slice(0, 2)}...{txHash.slice(txHash.length - 4)}
              </a>
            </button>
          )}
        </>
      )}
      {success && <SuccessToast message={success} />}
      {error && <ErrorToast message={error} />}
    </>
  );
}
