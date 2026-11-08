import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Traveler Registration",
  description: "Create an account to book verified tours, hotel rooms, and 4x4 mountain vehicles in northern Pakistan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
