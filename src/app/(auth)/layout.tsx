import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Access | PakistanTravel.Agency",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
