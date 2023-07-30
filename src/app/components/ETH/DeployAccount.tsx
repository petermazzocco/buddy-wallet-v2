import { useWalletClient, useNetwork } from "wagmi";
import type { Address } from "viem";
import { useState, useEffect } from "react";
import SuccessToast from "../SuccessToast";
import ErrorToast from "../ErrorToast";
import { ethProviderClient } from "../../utils/constants";
import { TokenboundClient } from "@tokenbound/sdk";

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
  const [txHash, setTxHash] = useState<Address>();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();

  /**
   * @dev Checks if the account is already deployed
   * @notice This is a workaround for the fact that the TokenboundClient does not handle state if the account is already deployed
   */
  useEffect(() => {
    const getBytecode = async () => {
      try {
        // Get the bytecode of the buddy
        if (buddy) {
          const bytecode = await ethProviderClient.getBytecode({
            address: buddy,
          });

          // If the bytecode is undefined then the account is not deployed
          if (bytecode === undefined) {
            setDeployed(false);

            // If the bytecode is not undefined then the account is deployed
          } else if (bytecode !== undefined) {
            setDeployed(true);
          }
        } else if (!buddy) {
          return;
        }
      } catch (err: any) {
        console.log(err?.message);
      }
    };

    getBytecode();
  }, [buddy]);

  /**
   * @dev Deploys a Tokenbound (Buddy) account for the selected NFT
   * @param tokenContract The address of the NFT contract
   * @param tokenId The ID of the NFT
   * @param deployed Whether the account is already deployed
   */
  async function deployAccount() {
    try {
      setLoading(true);
      // Check for bytecode to be false (not deployed)
      // Check for walletClient to be true (wallet connected)
      // Check for the right chain ID (1 for mainnet)
      if (walletClient && chain && deployed === false) {
        const tokenboundClient = new TokenboundClient({
          //@ts-ignore
          walletClient,
          chainId: chain?.id,
        });
        // Deploy the account
        const tx = await tokenboundClient.createAccount({
          tokenContract,
          tokenId,
        });

        // Set states (tx hash, success message, loading)
        setTxHash(tx);
        setSuccess("Account deployed successfully!");
        setLoading(false);
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
            className="btn btn-neutral rounded-md text-xl"
            onClick={deployAccount}
            type="button"
          >
            {loading ? "Deploying..." : "Deploy Account"}
          </button>
          <p className="text-[0.5rem] text-gray-400 pt-1">
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
