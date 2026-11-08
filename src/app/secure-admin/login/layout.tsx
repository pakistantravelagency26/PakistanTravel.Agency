import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Login | Super Admin",
  description: "Administrative access portal for PakistanTravel.Agency staff.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
