export default function FAQ() {
  return (
    <main className="min-h-screen my-24">
      <div className=" text-center ">
        <h1 className="text-6xl font-bold">Buddy Wallet</h1>
        <h2 className="pb-4 font-normal text-lg">Have some questions?</h2>
      </div>
      <div className="mx-10 space-y-4">
        <div
          tabIndex={0}
          className="collapse collapse-plus border-2 border-base-300  rounded-box"
        >
          <div className="collapse-title text-xl font-medium">
            <h2>What is Buddy Wallet?</h2>
          </div>
          <div className="collapse-content">
            <p>
              Buddy Wallet is a ERC6551 friendly wallet that allows you to view
              and transact with any ERC 721 you own! Connect your wallet, view
              the available NFTs, and start transacting with them!
            </p>
          </div>
        </div>
        <div
          tabIndex={1}
          className="collapse collapse-plus border-2 border-base-300  rounded-box"
        >
          <div className="collapse-title text-xl font-medium">
            <h2>What is ERC6551?</h2>
          </div>
          <div className="collapse-content">
            <p>
              ERC6551 is an EIP created by Tokenbound, the team behind ERC721
              and CryptoKitties. ERC6551 is an extension of the ERC721 standard
              that allows for any ERC721 asset to own assets of their own. This
              means that you can have a NFT that owns another NFT, tokens, and
              much much more! The possibilities are endless! We suggest reading
              the EIP if you want more information.
            </p>
          </div>
        </div>
        <div
          tabIndex={2}
          className="collapse collapse-plus border-2 border-base-300  rounded-box"
        >
          <div className="collapse-title text-xl font-medium">
            <h2>Can you sell a Buddy Wallet?</h2>
          </div>
          <div className="collapse-content">
            <p>
              When you sell the ERC721 NFT that owns the Buddy Wallet, you are
              also selling every attached asset to the Buddy. So be very careful
              when selling, as it can be irreversible. With that said, the team
              who created the 6551 EIP is working on a way to allow for the
              transfer of ownership of a Buddy Wallet while retaining assets, if
              needed.
            </p>
          </div>
        </div>
        <div
          tabIndex={3}
          className="collapse collapse-plus border-2 border-base-300  rounded-box"
        >
          <div className="collapse-title text-xl font-medium">
            <h2>What are EIPs?</h2>
          </div>
          <div className="collapse-content">
            <p>
              EIPs are Ethereum Improvement Proposals. They are a way for the
              Ethereum community to propose changes to the Ethereum protocol.
              EIPs are the equivalent of Bitcoin&apos;s BIPs or RFCs. EIPs are a
              key part of the Ethereum community and ecosystem, and are the
              primary mechanism for proposing new features, collecting community
              input on an issue, and for documenting the design decisions behind
              Ethereum.
            </p>
          </div>
        </div>
        <div
          tabIndex={4}
          className="collapse collapse-plus border-2 border-base-300  rounded-box"
        >
          <div className="collapse-title text-xl font-medium">
            <h2>What kind of transactions are supported from Buddy Wallet?</h2>
          </div>
          <div className="collapse-content">
            <p>
              Right now, we support the transfer of ERC721 NFT&apos;s to a Buddy
              Wallet and viewing and copying the address of your Buddy Wallet.
              We plan to add more functionality in the future as the EIP is
              developed further, like transacting on the Buddy&apos;s behalf,
              being able to sell Buddy&apos;s with the attached assets, being
              able to remove assets attached to a Buddy, and more!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
