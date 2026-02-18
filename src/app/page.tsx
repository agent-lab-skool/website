import { WHOP_URL } from "@/lib/constants/links";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(WHOP_URL);
}
