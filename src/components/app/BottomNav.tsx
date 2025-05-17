"use client"

import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Clapperboard, Store, BookOpenText, Compass } from 'lucide-react'; 
import { cn } from '@/lib/utils';

interface BottomNavProps {}

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/reels', label: 'Reels', icon: Clapperboard },
  { href: '/explore', label: 'Explore', icon: Compass }, 
  { href: '/store', label: 'Store', icon: Store },
  { href: '/blog', label: 'Blog', icon: BookOpenText },
  { href: '/profile', label: 'Profile', icon: User },
];

const BottomNav: FC<BottomNavProps> = ({}) => {
  const pathname = usePathname();

  const checkIsActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-[4.5rem] items-center justify-around">
        {navItems.map((item) => {
          const isActive = checkIsActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-1 rounded-md transition-colors flex-1 min-w-0', // Adjusted padding
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" /> {/* Slightly smaller icon for more items */}
              <span className="text-[0.65rem] font-medium truncate">{item.label}</span> {/* Smaller text */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
