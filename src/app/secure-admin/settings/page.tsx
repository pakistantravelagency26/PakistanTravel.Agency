import { redirect } from "next/navigation";

export default function AdminSettingsIndexPage() {
  redirect("/secure-admin/settings/email");
}
