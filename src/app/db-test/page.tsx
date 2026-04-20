import { redirect } from "next/navigation";

export default function LegacyDbTestRedirect() {
  redirect("/admin");
}
