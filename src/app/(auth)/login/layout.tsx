import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traveler Sign In | Account Access",
  description: "Sign in to view your bookings, check-in vouchers, and northern Pakistan travel itinerary.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
