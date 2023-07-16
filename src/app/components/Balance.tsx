"use client";

import { useState } from "react";
import type { Address } from "wagmi";
import { useAccount, useBalance } from "wagmi";

export function Balance() {
  return (
    <>
      <div>
        <AccountBalance />
      </div>
      <br />
      <div>
        <FindBalance />
      </div>
    </>
  );
}

export function AccountBalance() {
  const { address } = useAccount();
  const { data } = useBalance({
    address,
    watch: true,
  });

  return (
    <span className="text-xs text-neutral">
      Balance: {data?.formatted.slice(0, 6)} ETH
    </span>
  );
}

export function FindBalance() {
  const [address, setAddress] = useState("");
  const { data, isLoading, refetch } = useBalance({
    address: address as Address,
  });

  const [value, setValue] = useState("");

  return (
    <div>
      Find balance:{" "}
      <input
        onChange={(e) => setValue(e.target.value)}
        placeholder="wallet address"
        value={value}
      />
      <button
        onClick={() => (value === address ? refetch() : setAddress(value))}
      >
        {isLoading ? "fetching..." : "fetch"}
      </button>
      <div>{data?.formatted}</div>
    </div>
  );
}
