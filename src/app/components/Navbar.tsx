import Link from "next/link";
import Image from "next/image";
import logo from "../public/img/logo.png";
import { ConnectKitButton } from "./ConnectKitButton";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between p-6">
      <div className="flex-1">
        <Link href="/">
          <Image width={50} height={50} src={logo} alt="logo" />
        </Link>
      </div>
      <div className="flex-none">
        <ConnectKitButton />
      </div>
    </div>
  );
}
