import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import TutorialProgress from './TutorialProgress';

export default function TutorialCard({ step, currentStep, totalSteps, onNext, onPrev, onClose, onPractice }) {
  const Icon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-md w-full"
      style={{ direction: 'rtl' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Icon className={`w-5 h-5 ${step.iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">שלב {currentStep + 1} מתוך {totalSteps}</p>
            <h3 className="font-bold text-foreground">{step.title}</h3>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-muted-foreground">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{step.content}</p>
        {step.tip && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-800">💡 {step.tip}</p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mb-4">
        <TutorialProgress current={currentStep} total={totalSteps} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {step.canPractice && (
          <Button variant="outline" size="sm" onClick={onPractice} className="gap-1.5 text-xs">
            <Dumbbell className="w-3.5 h-3.5" />
            {step.practiceLabel || 'תרגלי עכשיו'}
          </Button>
        )}

        <div className="flex-1" />

        {!isFirst && (
          <Button variant="ghost" size="sm" onClick={onPrev} className="gap-1">
            <ChevronRight className="w-4 h-4" />
            הקודם
          </Button>
        )}

        <Button size="sm" onClick={onNext} className="gap-1">
          {isLast ? 'סיום' : 'הבא'}
          {!isLast && <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>
    </motion.div>
  );
}