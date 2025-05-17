
import type { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  // This layout is minimal for now, but could include profile-specific sidebars or headers later.
  return <>{children}</>;
}
