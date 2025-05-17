import type { ReactNode } from 'react';

export default function TagsLayout({ children }: { children: ReactNode }) {
  // Layout for tag-specific pages
  // Could include tag-specific headers or sidebars later
  return <>{children}</>;
}