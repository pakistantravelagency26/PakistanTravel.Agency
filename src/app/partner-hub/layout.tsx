import type { Metadata } from "next";
import PartnerHubShell from "./PartnerHubShell";

export const metadata: Metadata = {
  title: "Partner Extranet | Vendor Management Hub",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PartnerHubLayout({ children }: { children: React.ReactNode }) {
  return <PartnerHubShell>{children}</PartnerHubShell>;
}
