import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Hub Login | Vendor Portal",
  description: "Sign in to your PakistanTravel.Agency partner extranet to manage listings, departures, and bookings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PartnerLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
