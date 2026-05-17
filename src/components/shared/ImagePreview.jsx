import React, { useState } from 'react';

function isImageUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/.test(lower)) return true;
  if (lower.includes('/images/') || lower.includes('image')) return true;
  return false;
}

export default function ImagePreview({ url, label }) {
  const [error, setError] = useState(false);

  if (!url || !isImageUrl(url) || error) return null;

  return (
    <div className="mt-2 rounded-lg border border-border overflow-hidden bg-muted/30">
      <p className="text-xs text-muted-foreground px-3 pt-2">{label || 'תצוגה מקדימה:'}</p>
      <div className="p-3 flex justify-center">
        <img 
          src={url} 
          alt="תצוגה מקדימה"
          onError={() => setError(true)}
          className="max-h-40 max-w-full rounded-md object-contain"
        />
      </div>
    </div>
  );
}