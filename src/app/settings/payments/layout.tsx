
import type { ReactNode } from 'react';

export default function SettingsPaymentLayout({ children }: { children: ReactNode }) {
  // Layout for the specific payment/withdrawal settings section
  return (
      <div className="container mx-auto max-w-4xl py-6">
        {children}
      </div>
  );
}
