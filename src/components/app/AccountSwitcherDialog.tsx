
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, LogIn, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccountSwitcherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for available accounts
const mockAccounts = [
  { id: 'user123', username: 'ak_group_76_official', avatarUrl: 'https://picsum.photos/id/76/40', name: 'AK Group 76 (Current)' },
  { id: 'user456', username: 'john_doe_personal', avatarUrl: 'https://picsum.photos/id/101/40', name: 'John Doe' },
  { id: 'user789', username: 'creative_studio_xyz', avatarUrl: 'https://picsum.photos/id/105/40', name: 'Creative Studio' },
];
// Mock current user ID
const MOCK_CURRENT_USER_ID = 'user123';


const AccountSwitcherDialog: React.FC<AccountSwitcherDialogProps> = ({ isOpen, onOpenChange }) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSwitchAccount = (accountId: string, accountName: string) => {
    // In a real app, this would involve API calls to change session/token
    console.log(`Switching to account: ${accountName} (ID: ${accountId})`);
    toast({
      title: 'Account Switched (Simulated)',
      description: `You are now logged in as ${accountName}.`,
    });
    // For demo, just close the dialog. A real app might refresh the page or redirect.
    onOpenChange(false);
    // Potentially update some global state or trigger a page reload
    // window.location.reload(); // Or router.refresh() if you want to re-run server components
  };

  const handleAddAccount = () => {
    onOpenChange(false); // Close dialog
    router.push('/login'); // Navigate to login page
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Account</DialogTitle>
          <DialogDescription>
            Select an account to switch to, or add a new one.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {mockAccounts.map((account) => (
            <Button
              key={account.id}
              variant={account.id === MOCK_CURRENT_USER_ID ? "secondary" : "ghost"}
              className="w-full justify-start h-auto py-2 px-3"
              onClick={() => handleSwitchAccount(account.id, account.name)}
              disabled={account.id === MOCK_CURRENT_USER_ID}
            >
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={account.avatarUrl} alt={account.username} data-ai-hint="user avatar" />
                <AvatarFallback>
                  {account.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{account.name}</span>
                <span className="text-xs text-muted-foreground">@{account.username}</span>
              </div>
              {account.id === MOCK_CURRENT_USER_ID && (
                <UserCircle className="ml-auto h-4 w-4 text-primary" />
              )}
            </Button>
          ))}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleAddAccount}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Account
          </Button>
           <DialogClose asChild>
             <Button type="button" variant="secondary" className="w-full sm:w-auto">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSwitcherDialog;

