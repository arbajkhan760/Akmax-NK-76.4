
import type { ReactNode } from 'react';

export default function OrderConfirmationLayout({ children }: { children: ReactNode }) {
  // Layout for the order confirmation page
  return (
      <div className="min-h-screen">
        {children}
      </div>
  );
}
