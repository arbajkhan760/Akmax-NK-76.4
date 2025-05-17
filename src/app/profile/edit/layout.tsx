import type { ReactNode } from 'react';

export default function EditProfileLayout({ children }: { children: ReactNode }) {
  // Layout for the edit profile section
  return (
      <div className="container mx-auto max-w-2xl py-6">
        {children}
      </div>
  );
}