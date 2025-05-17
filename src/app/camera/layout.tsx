
import type { ReactNode } from 'react';

export default function CameraLayout({ children }: { children: ReactNode }) {
  // This layout removes the main app header and footer specifically for the camera page
  // to provide a full-screen experience.
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
