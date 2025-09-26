import { Button } from "@repo/ui/button";
import Link from "next/link";
import Logo from "../components/Logo";

export default function Page() {
  return (
    <div>
      <span>brain-cache landing page</span>
      <Logo size="lg" />
      <Link href={"/signin"}>
        <Button text="Enter" variant="secondary" size="md" />
      </Link>
    </div>
  );
}
