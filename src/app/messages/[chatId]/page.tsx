'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Send, Paperclip, Mic, Smile, Phone, Video, MoreVertical, Info, BellOff, UserX, Trash2, Search, Heart
} from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isYesterday, formatDistanceToNowStrict } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface Message {
  id: string;
  senderId: string; 
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'file'; 
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  reactions?: { emoji: string, userId: string, count: number }[]; // Updated reaction type
  replyTo?: string; 
  mediaUrl?: string; 
  fileName?: string; 
  fileSize?: string; 
}

interface ChatParticipant {
  id: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen?: Date;
}

interface ChatDetails {
  id: string;
  participants: ChatParticipant[];
  messages: Message[];
  isMuted?: boolean;
}

const mockUsers: Record<string, ChatParticipant> = {
  'alex_doe': { id: 'alex_doe', username: 'alex_doe', avatarUrl: 'https://picsum.photos/id/101/50', isOnline: true },
  'sarah_j': { id: 'sarah_j', username: 'sarah_j', avatarUrl: 'https://picsum.photos/id/102/50', isOnline: false, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  'mike_ross': { id: 'mike_ross', username: 'mike_ross', avatarUrl: 'https://picsum.photos/id/103/50', isOnline: false, lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) }, 
  'coder_cat': { id: 'coder_cat', username: 'coder_cat', avatarUrl: 'https://picsum.photos/id/104/50', isOnline: true },
  'design_guru': { id: 'design_guru', username: 'design_guru', avatarUrl: 'https://picsum.photos/id/105/50', isOnline: false, lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000)},
  'travel_bug': { id: 'travel_bug', username: 'travel_bug', avatarUrl: 'https://picsum.photos/id/106/50', isOnline: true},
  'food_lover': { id: 'food_lover', username: 'food_lover', avatarUrl: 'https://picsum.photos/id/107/50', isOnline: false, lastSeen: new Date(Date.now() - 5 * 60 * 1000)},
  'music_maniac': { id: 'music_maniac', username: 'music_maniac', avatarUrl: 'https://picsum.photos/id/108/50', isOnline: false, lastSeen: new Date(Date.now() - 10 * 60 * 60 * 1000)},
};

const generateMockMessages = (chatId: string, participantId: string): Message[] => {
  const messages: Message[] = [];
  const now = Date.now();
  for (let i = 0; i < 20; i++) {
    const sender = i % 3 === 0 ? 'me' : participantId;
    messages.push({
      id: `msg-${chatId}-${i}`,
      senderId: sender,
      content: `This is message ${i + 1} in chat with ${chatId} from ${sender}. Lorem ipsum dolor sit amet.`,
      contentType: 'text',
      timestamp: new Date(now - (20 - i) * 5 * 60 * 1000), 
      status: sender === 'me' ? (i > 15 ? 'delivered' : 'read') : 'read',
      reactions: i % 5 === 0 && i > 0 ? [{ emoji: '❤️', userId: sender === 'me' ? participantId : 'me', count: Math.floor(Math.random() * 5) + 1 }] : undefined,
    });
  }
   messages.push({
    id: `msg-${chatId}-img`,
    senderId: participantId,
    content: '',
    contentType: 'image',
    mediaUrl: 'https://picsum.photos/seed/chatimage/300/200',
    timestamp: new Date(now - 10 * 60 * 1000),
    status: 'read'
  });
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};


const fetchChatDetails = async (chatId: string): Promise<ChatDetails | null> => {
  console.log(`Fetching chat details for: ${chatId}`);
  await new Promise(resolve => setTimeout(resolve, 300));

  const participant = mockUsers[chatId];
  if (!participant) return null;

  return {
    id: chatId, 
    participants: [
      { id: 'me', username: 'current_user', avatarUrl: 'https://picsum.photos/id/200/50', isOnline: true }, 
      participant,
    ],
    messages: generateMockMessages(chatId, participant.id),
    isMuted: chatId === 'mike_ross', 
  };
};


export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId as string;
  const { toast } = useToast();

  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatId) {
      const loadChat = async () => {
        setIsLoading(true);
        const data = await fetchChatDetails(chatId);
        setChatDetails(data);
        setIsLoading(false);
      };
      loadChat();
    }
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatDetails?.messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatDetails) return;

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: 'me',
      content: newMessage,
      contentType: 'text',
      timestamp: new Date(),
      status: 'sent',
    };

    setChatDetails(prev => prev ? ({
      ...prev,
      messages: [...prev.messages, optimisticMessage],
    }) : null);
    setNewMessage('');

    console.log(`Sending message: ${optimisticMessage.content} to chat ${chatId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleMessageReaction = (messageId: string, emoji: string) => {
    // Mock reaction: update UI and log
    setChatDetails(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: prev.messages.map(msg => {
          if (msg.id === messageId) {
            const existingReactionIndex = msg.reactions?.findIndex(r => r.emoji === emoji && r.userId === 'me');
            let newReactions = [...(msg.reactions || [])];
            if (existingReactionIndex !== undefined && existingReactionIndex > -1) {
              // User already reacted with this emoji, remove it or decrease count
              newReactions.splice(existingReactionIndex, 1); // Simple removal for demo
            } else {
              // Add new reaction
              newReactions.push({ emoji, userId: 'me', count: 1 }); // Count can be more complex
            }
            return { ...msg, reactions: newReactions };
          }
          return msg;
        }),
      };
    });
    toast({ title: `Reacted with ${emoji} (Simulated)`});
    // TODO: Implement backend call for reactions
  };

  const formatMessageTimestamp = (timestamp: Date) => {
    if (isToday(timestamp)) return format(timestamp, 'p'); 
    if (isYesterday(timestamp)) return `Yesterday ${format(timestamp, 'p')}`;
    return format(timestamp, 'MMM d, p'); 
  };
  
  const getParticipant = (participantId: string) => chatDetails?.participants.find(p => p.id === participantId);

  const otherParticipant = chatDetails?.participants.find(p => p.id !== 'me');

  if (isLoading) {
    return <div className="flex flex-col h-full items-center justify-center text-muted-foreground">Loading chat...</div>;
  }

  if (!chatDetails || !otherParticipant) {
    return <div className="flex flex-col h-full items-center justify-center text-destructive">Chat not found.</div>;
  }

  const handleViewProfile = () => router.push(`/profile/${otherParticipant.id}`);
  const handleMuteNotifications = () => {
    setChatDetails(prev => prev ? ({...prev, isMuted: !prev.isMuted}) : null);
    toast({ title: chatDetails.isMuted ? "Unmuted Chat" : "Muted Chat", description: `Notifications for ${otherParticipant.username} are now ${chatDetails.isMuted ? 'ON' : 'OFF'}.`});
  }
  const handleBlockUser = () => toast({ variant: "destructive", title: "Blocked User", description: `${otherParticipant.username} has been blocked.` }); 
  const handleDeleteChat = () => toast({ variant: "destructive", title: "Chat Deleted", description: `Chat with ${otherParticipant.username} has been deleted.` }); 
  const handleSearchInChat = () => toast({ title: "Search In Chat", description: "Search functionality coming soon." });
  const handleReportChat = () => toast({ title: "Report Submitted", description: `The chat with ${otherParticipant.username} has been reported.` });

  const handleVoiceCall = () => {
    if (!otherParticipant) return;
    console.log(`Initiating voice call with ${otherParticipant.username}`);
    toast({
      title: 'Voice Call Started',
      description: `Calling ${otherParticipant.username}... (Simulated)`,
    });
  };

  const handleVideoCall = () => {
    if (!otherParticipant) return;
    console.log(`Initiating video call with ${otherParticipant.username}`);
    toast({
      title: 'Video Call Started',
      description: `Calling ${otherParticipant.username}... (Simulated)`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30">
      <header className="flex items-center p-3 border-b bg-background shadow-sm">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href={`/profile/${otherParticipant.id}`} className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={otherParticipant.avatarUrl} alt={otherParticipant.username} />
              <AvatarFallback>{otherParticipant.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            {otherParticipant.isOnline && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-sm truncate">{otherParticipant.username}</h2>
            <p className="text-xs text-muted-foreground">
              {otherParticipant.isOnline ? 'Online' : otherParticipant.lastSeen ? `Last seen ${formatDistanceToNowStrict(otherParticipant.lastSeen, {addSuffix: true})}`: 'Offline'}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleVoiceCall} aria-label="Start Voice Call">
            <Phone className="h-5 w-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleVideoCall} aria-label="Start Video Call">
            <Video className="h-5 w-5 text-primary" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewProfile}><UserX className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSearchInChat}><Search className="mr-2 h-4 w-4" /> Search in Chat</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMuteNotifications}>
                <BellOff className={cn("mr-2 h-4 w-4", chatDetails.isMuted && "text-yellow-500")} />
                {chatDetails.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReportChat} className="text-orange-600 focus:text-orange-700 focus:bg-orange-500/10">
                 Report Chat/User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <UserX className="mr-2 h-4 w-4" /> Block User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeleteChat} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {chatDetails.messages.map((msg) => {
          const sender = getParticipant(msg.senderId);
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex group ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
              <div className={`max-w-[70%] p-0 relative`}>
                {!isMe && sender && (
                   <p className="text-xs text-muted-foreground mb-0.5 ml-2">{sender.username}</p>
                )}
                <div className={`py-2 px-3 rounded-xl shadow ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background text-foreground rounded-bl-none'}`}>
                  {msg.contentType === 'text' && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                  {msg.contentType === 'image' && msg.mediaUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={msg.mediaUrl} alt="Sent image" className="rounded-md max-w-xs max-h-60 object-cover" data-ai-hint="chat image" />
                  )}
                   <p className="text-xs mt-1 opacity-70 text-right">
                    {formatMessageTimestamp(msg.timestamp)}
                    {isMe && (
                      <span className="ml-1">
                        {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : ''}
                      </span>
                    )}
                  </p>
                </div>
                {/* Reactions Display (Mock) */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`absolute -bottom-2 ${isMe ? 'right-1' : 'left-1'} flex gap-0.5`}>
                    {msg.reactions.slice(0,3).map((reaction, idx) => (
                      <span key={idx} className="text-xs bg-muted/70 backdrop-blur-sm p-0.5 px-1 rounded-full shadow">
                        {reaction.emoji} {reaction.count > 1 ? reaction.count : ''}
                      </span>
                    ))}
                  </div>
                )}
                 {/* Placeholder for hover reaction button */}
                <Button variant="ghost" size="icon" 
                        className="absolute top-1/2 -translate-y-1/2 -right-8 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleMessageReaction(msg.id, '❤️')}>
                  <Heart className="h-3 w-3 text-muted-foreground"/>
                </Button>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <footer className="p-3 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Button variant="ghost" size="icon" type="button"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-10"
            autoComplete="off"
          />
          {newMessage.trim() ? (
            <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="h-5 w-5 text-primary-foreground" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" type="button"><Mic className="h-5 w-5 text-muted-foreground" /></Button>
            </>
          )}
        </form>
      </footer>
    </div>
  );
}
