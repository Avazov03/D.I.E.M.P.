import { Card } from "@/components/ui/card";
import type { Metadata } from "next";
import FullLogo from "@/app/(dashboard-layout)/layout/shared/logo/full-logo";
import { LoginForm } from "./form";

export const metadata: Metadata = {
  title: "Kirish",
  description: "D.I.E.M.P. namuna seansi.",
};

const BoxedLogin = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-accent  px-4">
        <Card className="w-full max-w-md border-none shadow-lg p-6">
          {/* Logo */}
          <div className="mx-auto  w-fit">
            <FullLogo showName />
          </div>

          <LoginForm />
        </Card>
      </div>
    </>
  );
};

export default BoxedLogin;
