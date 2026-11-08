import TwoFactorEnrollment from "@/components/TwoFactorEnrollment";

export const metadata = {
  title: "Partner 2FA Security Setup | PakistanTravel.Agency",
  robots: "noindex, nofollow",
};

export default function Partner2FASetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <TwoFactorEnrollment
        portalName="Partner Extranet Portal"
        onSuccessRedirect="/partner-hub/dashboard"
      />
    </div>
  );
}
