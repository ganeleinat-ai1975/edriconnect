import React from 'react';
import { cn } from '@/lib/utils';

export default function TutorialProgress({ current, total }) {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="space-y-2">
      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === current ? "bg-primary scale-125" : i < current ? "bg-primary/60" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}