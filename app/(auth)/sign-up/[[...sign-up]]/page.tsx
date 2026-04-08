import { SignUp } from "@clerk/nextjs";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-white">Trade</span>
        </Link>
      </nav>

      {/* Sign Up Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-white/50">Start trading with AI-powered insights</p>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorBackground: "#1e252e",
              colorInputBackground: "#141b22",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "rgba(255,255,255,0.45)",
              colorPrimary: "#ff80b4",
              colorDanger: "#ef4444",
              colorNeutral: "#ffffff",
              borderRadius: "0.5rem",
              fontFamily: "inherit",
              fontSize: "14px",
            },
            elements: {
              rootBox: "w-full max-w-md mx-auto",
              card: "bg-[#1e252e] border border-white/10 shadow-2xl rounded-2xl p-2",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-white/50",
              socialButtonsBlockButton:
                "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors rounded-lg",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-white/30 text-xs",
              formFieldLabel: "text-white/60 text-sm",
              formFieldInput:
                "bg-[#141b22] border border-white/10 text-white rounded-lg focus:border-[#ff80b4] focus:ring-0",
              formButtonPrimary:
                "bg-[#ff80b4] hover:bg-[#ff6aa5] text-black font-semibold rounded-lg transition-all",
              footer:
                "bg-[#181f27] rounded-b-2xl border-t border-white/5",
              footerAction: "rounded-b-2xl",
              footerActionText: "text-white/40",
              footerActionLink:
                "text-[#ff80b4] hover:text-[#ff6aa5] font-medium",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-[#ff80b4]",
              formResendCodeLink: "text-[#ff80b4]",
              alertText: "text-red-400",
              alertIcon: "text-red-400",
              otpCodeFieldInput:
                "bg-[#141b22] border border-white/10 text-white",
            },
          }}
        />
      </div>
    </div>
  );
}
