
import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  // This layout can be customized for the blog section, e.g., different header/footer.
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
