import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TutorialCard from './TutorialCard';
import PracticeButton from './PracticeButton';

export default function TutorialOverlay({ isOpen, step, currentStep, totalSteps, isPracticing, onNext, onPrev, onClose, onPractice, onEndPractice }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightRect, setHighlightRect] = useState(null);

  // Navigate to the step's page
  useEffect(() => {
    if (!isOpen || isPracticing || !step?.navigateTo) return;
    if (location.pathname !== step.navigateTo) {
      navigate(step.navigateTo);
    }
  }, [isOpen, isPracticing, step, location.pathname, navigate]);

  // Find highlighted element
  const updateRect = useCallback(() => {
    if (!isOpen || isPracticing || !step?.highlightSelector) {
      setHighlightRect(null);
      return;
    }
    // Small delay to wait for page render after navigation
    const timer = setTimeout(() => {
      const el = document.querySelector(step.highlightSelector);
      if (el) {
        const rect = el.getBoundingClientRect();
        const padding = 8;
        setHighlightRect({
          x: rect.x - padding,
          y: rect.y - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        });
      } else {
        setHighlightRect(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [isOpen, isPracticing, step]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [updateRect]);

  // Practice mode: only show the floating return button
  if (isPracticing) {
    return (
      <AnimatePresence>
        <PracticeButton onReturn={onEndPractice} />
      </AnimatePresence>
    );
  }

  if (!isOpen) return null;

  const isCenter = step.position === 'center' || !highlightRect;

  // Calculate card position near the highlighted element
  const getCardStyle = () => {
    if (isCenter || !highlightRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
      };
    }

    const margin = 16;
    const cardWidth = 400;
    const cardHeight = 380;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer bottom, then top, then right, then left
    const spaceBelow = vh - (highlightRect.y + highlightRect.height);
    const spaceAbove = highlightRect.y;
    const spaceLeft = highlightRect.x;
    const spaceRight = vw - (highlightRect.x + highlightRect.width);

    let top, left;

    if (spaceBelow > cardHeight + margin) {
      top = highlightRect.y + highlightRect.height + margin;
      left = Math.max(margin, Math.min(highlightRect.x, vw - cardWidth - margin));
    } else if (spaceAbove > cardHeight + margin) {
      top = highlightRect.y - cardHeight - margin;
      left = Math.max(margin, Math.min(highlightRect.x, vw - cardWidth - margin));
    } else if (spaceRight > cardWidth + margin) {
      top = Math.max(margin, Math.min(highlightRect.y, vh - cardHeight - margin));
      left = highlightRect.x + highlightRect.width + margin;
    } else {
      top = Math.max(margin, Math.min(highlightRect.y, vh - cardHeight - margin));
      left = Math.max(margin, highlightRect.x - cardWidth - margin);
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10001,
    };
  };

  return (
    <>
      {/* SVG Mask Overlay */}
      <div className="fixed inset-0 z-[10000]" style={{ pointerEvents: 'none' }}>
        <svg width="100%" height="100%" style={{ pointerEvents: 'auto' }}>
          <defs>
            <mask id="tutorial-mask">
              <rect width="100%" height="100%" fill="white" />
              {highlightRect && (
                <rect
                  x={highlightRect.x}
                  y={highlightRect.y}
                  width={highlightRect.width}
                  height={highlightRect.height}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.7)"
            mask="url(#tutorial-mask)"
          />
        </svg>

        {/* Glow around highlighted area */}
        {highlightRect && (
          <div
            className="absolute rounded-xl pointer-events-none"
            style={{
              top: highlightRect.y - 2,
              left: highlightRect.x - 2,
              width: highlightRect.width + 4,
              height: highlightRect.height + 4,
              boxShadow: '0 0 0 3px hsl(var(--primary) / 0.5), 0 0 20px 4px hsl(var(--primary) / 0.25)',
              borderRadius: '14px',
            }}
          />
        )}
      </div>

      {/* Tutorial Card */}
      <div style={getCardStyle()}>
        <AnimatePresence mode="wait">
          <TutorialCard
            step={step}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={onNext}
            onPrev={onPrev}
            onClose={onClose}
            onPractice={step.canPractice ? onPractice : undefined}
          />
        </AnimatePresence>
      </div>
    </>
  );
}