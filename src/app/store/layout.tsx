
import type { ReactNode } from 'react';

export default function StoreLayout({ children }: { children: ReactNode }) {
  // Layout for the store section
  return (
      <div className="container mx-auto max-w-7xl py-6">
        {children}
      </div>
  );
}
