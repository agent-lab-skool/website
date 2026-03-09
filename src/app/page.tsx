import { redirect } from "next/navigation";
import { SKOOL_URL } from "@/lib/constants/links";

export default function Home() {
  redirect(SKOOL_URL);
}
