import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { usePendingBotMessages } from '@/hooks/usePendingBotMessages';
import { useTutorial } from '@/hooks/useTutorial';
import TutorialOverlay from '@/components/tutorial/TutorialOverlay';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tutorial = useTutorial();
  
  // Listen for pending bot messages from webhooks (Cal.com etc.) and send them
  usePendingBotMessages();

  // Auto-start tutorial on first visit
  useEffect(() => {
    if (!tutorial.isCompleted()) {
      const timer = setTimeout(() => tutorial.start(), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-50 bg-card border-b border-border flex items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-bold text-sm">ד״ר ליאת אדרי</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)} 
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onStartTutorial={tutorial.start}
      />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "pt-14 md:pt-0", // top padding for mobile header
        collapsed ? "md:mr-16" : "md:mr-60",
        "mr-0" // no margin on mobile
      )}>
        <div className="p-3 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <TutorialOverlay
        isOpen={tutorial.isOpen}
        step={tutorial.step}
        currentStep={tutorial.currentStep}
        totalSteps={tutorial.totalSteps}
        isPracticing={tutorial.isPracticing}
        onNext={tutorial.next}
        onPrev={tutorial.prev}
        onClose={tutorial.close}
        onPractice={tutorial.startPractice}
        onEndPractice={tutorial.endPractice}
      />
    </div>
  );
}