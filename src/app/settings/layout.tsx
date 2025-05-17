
import type { ReactNode } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  // Basic layout for settings, could include specific headers/sidebars later
  return (
      <div className="container mx-auto max-w-4xl py-6">
        {children}
      </div>
  );
}
