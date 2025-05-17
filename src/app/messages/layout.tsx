
'use client'; // Add this directive

import type { ReactNode } from 'react';

export default function MessagesLayout({ children }: { children: ReactNode }) {
  // This layout ensures that the content area within messages pages
  // can take up available height, especially for the chat screen.
  // The global Header and BottomNav will still be visible unless
  // specifically handled by child pages or a more complex layout strategy.
  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-var(--header-height)-var(--bottom-nav-height,0px))] md:h-[calc(100vh-var(--header-height))]">
      {/* 
        Approximate heights:
        Header: h-14 (56px)
        BottomNav: h-[4.5rem] (72px) for mobile
        So, on mobile: 100vh - 56px - 72px
        On desktop: 100vh - 56px
        Using CSS variables for more robustness if actual heights change.
      */}
      <style jsx global>{`
        :root {
          --header-height: 3.5rem; /* 56px */
        }
        @media (max-width: 767px) { /* md breakpoint */
          :root {
            --bottom-nav-height: 4.5rem; /* 72px */
          }
        }
      `}</style>
      {children}
    </div>
  );
}

