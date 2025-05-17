
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  // This layout removes the main app header and footer for auth pages
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
