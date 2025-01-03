'use client';

import { MessageCircle, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-popup"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.85, 
              y: 20,
              transition: { duration: 0.2 }
            }}
            className="mb-4"
          >
            <Card className="w-[300px] shadow-lg">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <motion.h3 
                      className="font-semibold"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      Chat with AI
                    </motion.h3>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/chat-bot">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="h-[300px] p-4 overflow-y-auto">
                  <motion.div 
                    className="flex flex-col space-y-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-muted p-2 rounded-lg max-w-[80%]">
                      Hello! How can I help you today?
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <motion.div 
                    className="flex gap-2 w-full"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardFooter>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          onClick={() => setIsOpen(prev => !prev)}
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
