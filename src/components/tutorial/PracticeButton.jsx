import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PracticeButton({ onReturn }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-6 z-[10001]"
    >
      <Button
        onClick={onReturn}
        className="gap-2 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-3 text-sm font-medium"
        size="lg"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה למדריך
      </Button>
    </motion.div>
  );
}