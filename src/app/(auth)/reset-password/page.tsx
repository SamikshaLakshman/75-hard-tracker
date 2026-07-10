import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <img src="/logo.svg" alt="Forge75" className="mx-auto w-14 h-14 rounded-2xl" />
          <h1 className="text-headline-lg text-accent">Set New Password</h1>
        </div>

        <Suspense fallback={<div className="glass-card rounded-2xl p-6 text-center text-muted-foreground">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
