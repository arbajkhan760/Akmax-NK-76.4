
import type { ReactNode } from 'react';

export default function ArchiveLayout({ children }: { children: ReactNode }) {
  // Layout for archive pages (e.g., Story Archive)
  return (
      <div className="container mx-auto max-w-4xl py-6">
        {children}
      </div>
  );
}
