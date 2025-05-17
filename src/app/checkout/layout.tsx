
import type { ReactNode } from 'react';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  // Layout for the checkout process
  // Consider removing header/footer for a focused checkout experience
  return (
      <div className="min-h-screen bg-secondary/30"> {/* Slightly different background */}
        {children}
      </div>
  );
}
