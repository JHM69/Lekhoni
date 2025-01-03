"use client";
import React from "react";
import { ScrollText, ChevronRight, PenTool, Users, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

const CloudBackground = () => (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-shadcn-dark/90 via-shadcn/90 to-shadcn-dark/90 backdrop-blur-[100px]" />
    <FogLayer className="opacity-30" />
    <FogLayer className="opacity-20 scale-150" />
    <div className="absolute inset-0 bg-gradient-radial from-transparent to-shadcn-dark/80" />
  </div>
);

const TextTransition = () => {
  const [isEnglish, setIsEnglish] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsEnglish(prev => !prev);
    }, 4000); // Switch every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[160px] md:h-[180px]">
      <AnimatePresence mode="wait">
        {isEnglish ? (
          <motion.h1
            key="english"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-galada text-5xl md:text-6xl font-extrabold text-primary leading-tight absolute w-full"
          >
            Tomar Golpo, <br />
            <span className="text-shadcn-accent">
              Tomar Vashay
            </span>
          </motion.h1>
        ) : (
          <motion.h1
            key="bangla"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="font-galada text-5xl md:text-6xl font-extrabold text-primary leading-tight absolute w-full"
          >
            তোমার গল্প, <br />
            তোমার ভাষায়
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatsCard = ({ number, label }: { number: string; label: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-primary/5 backdrop-blur-lg p-6 rounded-2xl border border-primary/10"
  >
    <motion.h3
      initial={{ scale: 0.5 }}
      whileInView={{ scale: 1 }}
      className="text-4xl font-bold text-primary mb-2"
    >
      {number}
    </motion.h3>
    <p className="text-shadcn-muted">{label}</p>
  </motion.div>
);

export default function Homepage() {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CloudBackground />
      
      <div className="relative z-10">
        {/* Decorative Elements */}
        <FloatingShape className="top-20 left-20" />
        <FloatingShape className="top-40 right-32" />
        <FloatingShape className="bottom-20 left-1/3" />
        
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center space-y-8">
              <TextTransition />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-shadcn-muted max-w-2xl mx-auto"
              >
                লেখনীতে তোমার গল্প শেয়ার করো, অন্যদের গল্প পড়ো, এবং বাংলা সাহিত্যের
                সমৃদ্ধ কমিউনিটির অংশ হও।
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center gap-4"
              >
                <button
                  className="bg-primary/80 backdrop-blur-md text-primary-foreground px-8 py-3 rounded-2xl font-medium hover:bg-primary transition-all flex items-center gap-2 shadow-lg"
                  onClick={() => router.push('/stories')}
                >
                  <ScrollText className="w-5 h-5" />
                  গল্প পড়তে শুরু করো
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-shadcn-dark/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid md:grid-cols-3 gap-12"
            >
              {[
                {
                  icon: <PenTool className="w-8 h-8 text-primary" />,
                  title: "লেখো স্বাধীনভাবে",
                  description: "তোমার গল্প, তোমার স্টাইলে। কোনো বাধা নেই।",
                },
                {
                  icon: <Users className="w-8 h-8 text-primary" />,
                  title: "সক্রিয় কমিউনিটি",
                  description: "পাঠক-লেখকদের সাথে যোগ দাও, মতামত শেয়ার করো।",
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-primary" />,
                  title: "পড়ো যেকোনো সময়",
                  description: "হাজারো গল্প তোমার হাতের মুঠোয়।",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center space-y-4 p-6 rounded-2xl bg-shadcn-dark/50 backdrop-blur-md border border-primary/10"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="bg-shadcn-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="font-galada text-xl font-bold text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-shadcn-muted">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-32 relative">
          <FloatingShape className="top-20 right-40" />
          <FloatingShape className="bottom-20 left-20" />
          
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-galada text-primary mb-4">কেন লেখনী বেছে নেবে?</h2>
              <p className="text-shadcn-muted max-w-2xl mx-auto">
                লেখনী শুধু একটি প্ল্যাটফর্ম নয়, এটি একটি সম্প্রদায় যেখানে প্রতিটি লেখক তার নিজস্ব গল্প শেয়ার করতে পারে
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {[
                  {
                    title: "সহজ ইন্টারফেস",
                    description: "সহজ এবং পরিচ্ছন্ন ইউজার ইন্টারফেস, যা ব্যবহার করা সহজ",
                  },
                  {
                    title: "স্মার্ট এডিটর",
                    description: "আধুনিক এডিটর যা তোমার লেখার অভিজ্ঞতাকে করে তোলে আরও সহজ",
                  },
                  {
                    title: "রিভিউ সিস্টেম",
                    description: "পাঠকদের কাছ থেকে পাও মূল্যবান মতামত",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="bg-shadcn-dark/30 backdrop-blur-md p-6 rounded-2xl border border-primary/10"
                  >
                    <h3 className="text-xl font-galada text-primary mb-2">{item.title}</h3>
                    <p className="text-shadcn-muted">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Image
                  src="/likhon_home_girl.png"
                  alt="Writing Illustration"
                  width={500}
                  height={500}
                  className="mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="py-20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatsCard number="১০০০+" label="নিবন্ধিত লেখক" />
              <StatsCard number="৫০০০+" label="প্রকাশিত গল্প" />
              <StatsCard number="২৫০০০+" label="সক্রিয় পাঠক" />
              <StatsCard number="১০০০০০+" label="মাসিক ভিউ" />
            </div>
          </div>
        </div>

        {/* Join Community Section */}
        <div className="py-32 relative">
          <FloatingShape className="top-40 left-32" />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-4xl font-galada text-primary">
                আজই যোগ দাও লেখনীর পরিবারে
              </h2>
              <p className="text-xl text-shadcn-muted">
                হাজার হাজার লেখক ও পাঠকের সাথে যুক্ত হও, শেয়ার করো তোমার লেখা
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-medium hover:bg-primary/90 transition-all flex items-center gap-2 mx-auto"
                  onClick={() => router.push('/signup')}
                >
                  নিবন্ধন করো
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pb-20 text-center">
          <p className="text-shadcn-muted">
            Made with ❤️ by কোয়ান্টাম গাইজ 
          </p>
        </div>
      </div>
    </div>
  );
}
