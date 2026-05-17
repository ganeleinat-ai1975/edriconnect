import { useState, useCallback } from 'react';
import TUTORIAL_STEPS from '@/lib/tutorialSteps';

const STORAGE_KEY = 'edri_tutorial_v1';

export function useTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPracticing, setIsPracticing] = useState(false);

  const isCompleted = () => localStorage.getItem(STORAGE_KEY) === 'true';

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsPracticing(false);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsPracticing(false);
  }, []);

  const next = useCallback(() => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsOpen(false);
    }
  }, [currentStep]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  const startPractice = useCallback(() => {
    setIsPracticing(true);
  }, []);

  const endPractice = useCallback(() => {
    setIsPracticing(false);
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    setIsPracticing(false);
  }, []);

  return {
    isOpen,
    currentStep,
    isPracticing,
    step: TUTORIAL_STEPS[currentStep],
    totalSteps: TUTORIAL_STEPS.length,
    isCompleted,
    start,
    close,
    next,
    prev,
    startPractice,
    endPractice,
    complete,
  };
}