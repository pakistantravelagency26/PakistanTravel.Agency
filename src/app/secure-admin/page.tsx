import { redirect } from "next/navigation";

export default function SecureAdminIndexPage() {
  redirect("/secure-admin/vendors");
}
