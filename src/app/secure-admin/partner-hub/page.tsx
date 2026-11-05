import { redirect } from "next/navigation";

export default function AdminPartnerHubRedirect() {
  redirect("/secure-admin/vendors");
}
