import React from 'react';

// You can move these to a separate components/ui/background.tsx file
const GradientBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20" />
  </div>
);

const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 dark:bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
    <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-200 dark:bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
    <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-200 dark:bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
  </div>
);

// Main ThemeLayout component
const ThemeLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <GradientBackground />
      <FloatingOrbs />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ThemeLayout;