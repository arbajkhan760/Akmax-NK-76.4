
import type { ReactNode } from 'react';

export default function ReelsLayout({ children }: { children: ReactNode }) {
  // This layout can be used to provide a different structure for the Reels feed,
  // for example, removing the standard Header for a more immersive experience.
  // For now, it just passes children through, inheriting the root layout structure.
  // To remove the header/footer *only* for Reels, you'd need to adjust RootLayout or
  // implement logic here (e.g., conditionally render Header/BottomNav based on route).
  return (
    <>
      {/* Optionally hide Header/Footer here for a full-screen Reels view */}
      {children}
    </>
  );
}
