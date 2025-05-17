"use client"; 

import type { FC } from 'react';
import React, { useState } from 'react'; 
import Link from 'next/link';
import { Camera, UserCircle, Search, Bell, MessageSquare, Repeat } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import NotificationList from './NotificationList';
import SearchDialog from './SearchDialog';
import AccountSwitcherDialog from './AccountSwitcherDialog'; 
import { useToast } from '@/hooks/use-toast'; 

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const { toast } = useToast(); 

  const handleLogout = () => {
    console.log('Logging out...');
     toast({
      title: "Logged Out",
      description: "You have been successfully logged out from AKmax.",
    });
    
    if (typeof window !== 'undefined') {
       window.location.href = '/login';
    }
  };


  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Ad Placeholder Banner */}
        <div className="w-full bg-muted/50 text-center py-1 text-xs text-muted-foreground border-b">
          Google AdMob - Ad Placeholder (Header Banner)
        </div>
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">AKmax</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchDialogOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <SearchDialog isOpen={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <NotificationList />
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" aria-label="Messages" asChild>
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>

            <Button variant="ghost" size="icon" aria-label="Open Camera" asChild>
              <Link href="/camera">
                <Camera className="h-5 w-5" />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account Actions">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsAccountSwitcherOpen(true)}>
                  <Repeat className="mr-2 h-4 w-4" /> Switch Account
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <AccountSwitcherDialog isOpen={isAccountSwitcherOpen} onOpenChange={setIsAccountSwitcherOpen} />
    </>
  );
};

export default Header;
