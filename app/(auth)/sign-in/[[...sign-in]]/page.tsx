import { SignIn } from "@clerk/nextjs";
import { TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#0B0E11] font-sans">
      {/* Left Pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 py-10 lg:px-16 justify-between relative overflow-y-auto">
        
        <div className="flex justify-between items-center w-full mb-12">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-lg bg-[#f0b90b] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-black" strokeWidth={2.5}/>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Trade</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign in</h1>
            <p className="text-[#8A8F98]">Please enter your details to sign in.</p>
          </div>

          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoPlacement: "none",
                showOptionalFields: false,
              },
              variables: {
                colorBackground: "#0B0E11",
                colorInputBackground: "transparent",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#8A8F98",
                colorPrimary: "#f0b90b",
                colorDanger: "#ef4444",
                borderRadius: "0.5rem",
                fontFamily: "inherit",
              },
              elements: {
                card: "bg-transparent shadow-none p-0 w-full rounded-none self-center m-0",
                header: "hidden", 
                footer: "hidden", 
                formFieldLabel: "text-white text-sm font-medium mb-1.5 pl-[1px]",
                formFieldInput:
                  "bg-[#1A1D21] border border-white/10 text-white rounded-xl focus:border-[#f0b90b] focus:ring-0 px-4 py-3",
                formButtonPrimary:
                  "bg-[#f0b90b] hover:bg-[#f0b90b]/90 text-black font-bold rounded-xl px-4 py-3.5 transition-all text-base",
                socialButtonsBlockButton:
                  "bg-transparent border border-white/20 text-white hover:bg-white/5 transition-colors rounded-xl py-3.5 mt-4",
                socialButtonsBlockButtonText: "text-white font-semibold",
                dividerLine: "bg-white/10",
                dividerText: "text-[#8A8F98] text-xs",
                footerActionText: "text-[#8A8F98]",
                footerActionLink: "text-[#f0b90b] hover:text-[#f0b90b]/80 font-medium",
                formFieldAction: "text-[#f0b90b] hover:text-[#f0b90b]/80", 
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-[#f0b90b]",
                formResendCodeLink: "text-[#f0b90b]",
                alertText: "text-red-400",
                otpCodeFieldInput: "bg-[#1A1D21] border border-white/20 text-white !rounded-lg focus:border-[#f0b90b] focus:ring-0",
              },
            }}
          />
          
          <div className="mt-6 text-center text-sm text-[#8A8F98]">
            Don't have an account? <Link href="/sign-up" className="text-[#f0b90b] font-semibold hover:underline">Sign up</Link>
          </div>
        </div>

        <div className="mt-12 text-[#8A8F98] text-xs flex justify-between">
          <span>© Trade 2026</span>
          <a href="mailto:help@trade.com" className="hover:text-white transition-colors">help@trade.com</a>
        </div>
      </div>

      {/* Right Pane - Feature/Image */}
      <div className="hidden lg:flex w-1/2 bg-[#1A1D21] relative flex-col justify-end p-16">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img 
            src="/Signin_sidedrop.jpg" 
            alt="Trading Dashboard" 
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent"></div>
        </div>

        {/* Doodle Arrow */}
        <svg 
          viewBox="0 0 200 100" 
          fill="none" 
          stroke="#f0b90b" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="absolute left-0 top-[60%] -translate-x-[60%] -translate-y-1/2 w-48 h-24 pointer-events-none z-50 hidden xl:block opacity-90 drop-shadow-md"
        >
          <path d="M 180,80 C 140,90 110,60 130,40 C 150,20 160,70 100,70 C 60,70 30,50 10,40" />
          <path d="M 20,25 L 10,40 L 25,55" />
        </svg>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Start turning your trades into gains.
          </h2>
          <p className="text-[#8A8F98] text-lg mb-10 leading-relaxed">
            Create a free account and get full access to AI market signals and technical indicators.</p>
        </div>
      </div>
    </div>
  );
}
