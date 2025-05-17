
import type { ReactNode } from 'react';

export default function QrPaymentLayout({ children }: { children: ReactNode }) {
  // This layout removes the main app header and footer for a focused payment screen
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
