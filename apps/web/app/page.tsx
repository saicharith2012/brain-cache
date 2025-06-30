"use client";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div>
      <span>brain-cache landing page</span>
      <div className="border px-2 py-1 cursor-pointer w-fit" onClick={() => redirect("/signin")}>Enter</div>
    </div>
  );
}
