
import type { ReactNode } from 'react';

export default function CartLayout({ children }: { children: ReactNode }) {
  // Layout for the cart section
  return (
      <div className="min-h-screen"> {/* Ensure layout takes full height */}
        {children}
      </div>
  );
}
