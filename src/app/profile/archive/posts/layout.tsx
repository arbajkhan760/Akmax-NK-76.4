
import type { ReactNode } from 'react';

export default function PostArchiveLayout({ children }: { children: ReactNode }) {
  // Layout for the post archive page
  // Reuses the container styling from the shared archive layout
  return (
      <div className="container mx-auto max-w-4xl py-6">
        {children}
      </div>
  );
}
