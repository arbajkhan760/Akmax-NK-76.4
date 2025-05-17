
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns'; // Added import

// --- TODO: Replace with Real Data & API Calls ---

interface MessageRequest {
  id: string; // User ID of the requester
  username: string;
  avatarUrl: string;
  requestMessage?: string; // Optional: First message snippet
  timestamp: Date;
}

const mockMessageRequests: MessageRequest[] = [
  { id: 'new_user_A', username: 'new_user_A', avatarUrl: 'https://picsum.photos/id/110/50', requestMessage: 'Hey, can we connect?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { id: 'another_person_B', username: 'another_person_B', avatarUrl: 'https://picsum.photos/id/111/50', requestMessage: 'Loved your profile!', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 'stranger_C', username: 'stranger_C', avatarUrl: 'https://picsum.photos/id/112/50', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
];


export default function MessageRequestsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MessageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching requests
    setIsLoading(true);
    setTimeout(() => {
      setRequests(mockMessageRequests);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleAccept = async (requestId: string) => {
    // --- TODO: API call to accept request ---
    console.log(`Accepting request from ${requestId}`);
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast({ title: "Request Accepted", description: "You can now message this user."});
    // Optionally, navigate to the newly created chat: router.push(`/messages/${requestId}`);
  };

  const handleDecline = async (requestId: string) => {
    // --- TODO: API call to decline/delete request ---
    console.log(`Declining request from ${requestId}`);
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast({ title: "Request Declined"});
  };

  const handleBlock = async (requestId: string) => {
     // --- TODO: API call to block user and decline request ---
    console.log(`Blocking user and declining request from ${requestId}`);
    setRequests(prev => prev.filter(req => req.id !== requestId));
    toast({ variant: "destructive", title: "User Blocked", description: "This user can no longer contact you."});
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center p-3 border-b shadow-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Message Requests</h1>
      </header>

      {/* Requests List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading requests...</div>
        ) : requests.length > 0 ? (
          <div className="divide-y">
            {requests.map((req) => (
              <div key={req.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={req.avatarUrl} alt={req.username} data-ai-hint="profile avatar" />
                    <AvatarFallback>{req.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Link href={`/profile/${req.id}`} className="font-semibold hover:underline">{req.username}</Link>
                    {req.requestMessage && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{req.requestMessage}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(req.timestamp, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 justify-end">
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleBlock(req.id)}>Block</Button>
                    <Button size="sm" variant="outline" onClick={() => handleDecline(req.id)}>Decline</Button>
                    <Button size="sm" onClick={() => handleAccept(req.id)}>Accept</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No new message requests.
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t text-xs text-muted-foreground text-center">
          These messages are from people you don&apos;t follow. They won&apos;t know you&apos;ve seen their request until you accept it.
      </div>
    </div>
  );
}
