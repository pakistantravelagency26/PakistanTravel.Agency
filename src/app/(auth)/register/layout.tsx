import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Traveler Registration",
  description: "Create an account to book verified guided tour packages across northern Pakistan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
