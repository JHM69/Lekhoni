"use client";
import Link from "next/link";
import UserSigninForm from "@/components/forms/user-signin-form";
import { motion } from "framer-motion";
import GoogleSignInButton from "@/components/google-auth-button";
import { useToast } from "@/components/ui/use-toast";

const FloatingShape = ({ className }: { className?: string }) => (
  <motion.div
    className={`absolute w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-xl ${className}`}
    animate={{
      y: [0, 20, 0],
      rotate: [0, 10, -10, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const FogLayer = ({ className }: { className?: string }) => (
  <motion.div
    className={`absolute inset-0 pointer-events-none ${className}`}
    animate={{
      x: [0, -400, 0],
      opacity: [0.5, 0.3, 0.5],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    }}
    style={{
      background: "url('/fog.png')",
      backgroundSize: "cover",
    }}
  />
);

export default function AuthenticationPage() {
  const { toast } = useToast();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-shadcn-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-shadcn-dark/90 via-shadcn/90 to-shadcn-dark/90 backdrop-blur-[100px]" />
        <FogLayer className="opacity-30" />
        <FogLayer className="opacity-20 scale-150" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-shadcn-dark/80" />
      </div>

      {/* Floating Shapes */}
      <FloatingShape className="top-20 left-20" />
      <FloatingShape className="bottom-20 right-20" />
      <FloatingShape className="top-1/2 right-32" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <div className="bg-shadcn-dark/50 backdrop-blur-xl p-8 rounded-3xl border border-primary/10 shadow-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-galada text-primary mb-3">লেখনীতে স্বাগতম</h1>
            <p className="text-shadcn-muted">আপনার অ্যাকাউন্টে লগ ইন করুন</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <UserSigninForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-shadcn-muted mb-4">
              অথবা
            </p>
            <GoogleSignInButton />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 text-sm text-shadcn-muted"
          >
            একাউন্ট নেই?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              সাইন আপ করুন
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
