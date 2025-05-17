'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; 
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Search, Users, Edit, Phone, Video, MessageSquare as MessageSquareIcon } from 'lucide-react'; 
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import type { UserNote } from '@/types/notes';
import {
  getAllNotes,
  saveUserNote,
  deleteUserNote,
  getUserNote,
  getCurrentMockUserId,
  getCurrentMockUserAvatar,
  getCurrentMockUsername,
} from '@/services/notesService';
import NoteItem from '@/components/app/notes/NoteItem';
import AddNoteDialog from '@/components/app/notes/AddNoteDialog';


interface ChatListItem {
  id: string; 
  type: 'direct' | 'group'; 
  name: string; 
  avatarUrl: string;
  lastMessage?: string;
  lastMessageTimestamp?: Date;
  unreadCount?: number;
  isOnline?: boolean; 
  isTyping?: boolean; 
  isMuted?: boolean; 
  isPinned?: boolean; 
}

const mockChatList: ChatListItem[] = [
  { id: 'alex_doe', type: 'direct', name: 'alex_doe', avatarUrl: 'https://picsum.photos/id/101/50', lastMessage: 'Sure, sounds good!', lastMessageTimestamp: new Date(Date.now() - 5 * 60 * 1000), unreadCount: 2, isOnline: true, isPinned: true },
  { id: 'sarah_j', type: 'direct', name: 'sarah_j', avatarUrl: 'https://picsum.photos/id/102/50', lastMessage: 'See you then! 👋', lastMessageTimestamp: new Date(Date.now() - 35 * 60 * 1000), isTyping: true },
  { id: 'mike_ross', type: 'direct', name: 'mike_ross', avatarUrl: 'https://picsum.photos/id/103/50', lastMessage: 'Okay, will do. Thanks for the heads up.', lastMessageTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), isOnline: false, isMuted: true },
  { id: 'coder_cat', type: 'direct', name: 'coder_cat', avatarUrl: 'https://picsum.photos/id/104/50', lastMessage: 'Haha, that\'s hilarious 😂', lastMessageTimestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: 'design_guru', type: 'direct', name: 'design_guru', avatarUrl: 'https://picsum.photos/id/105/50', lastMessage: 'Can you send me the file?', lastMessageTimestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), unreadCount: 1 },
  { id: 'travel_bug', type: 'direct', name: 'travel_bug', avatarUrl: 'https://picsum.photos/id/106/50', lastMessage: 'Just landed in Paris!', lastMessageTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isOnline: true },
  { id: 'food_lover', type: 'direct', name: 'food_lover', avatarUrl: 'https://picsum.photos/id/107/50', lastMessage: 'Image', lastMessageTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, 
  { id: 'music_maniac', type: 'direct', name: 'music_maniac', avatarUrl: 'https://picsum.photos/id/108/50', lastMessage: 'Voice message', lastMessageTimestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }, 
];


export default function MessagesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUserNote, setCurrentUserNote] = useState<UserNote | null>(null);
  const [friendNotes, setFriendNotes] = useState<UserNote[]>([]);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);

  const currentUserId = getCurrentMockUserId();
  const currentUserAvatar = getCurrentMockUserAvatar();
  const currentUsername = getCurrentMockUsername();

  const fetchNotes = async () => {
    setIsNotesLoading(true);
    try {
      const allNotes = await getAllNotes();
      const userNote = allNotes.find(note => note.userId === currentUserId);
      setCurrentUserNote(userNote || null);
      setFriendNotes(allNotes.filter(note => note.userId !== currentUserId));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load notes.' });
    }
    setIsNotesLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setChatList(mockChatList.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || (b.lastMessageTimestamp?.getTime() || 0) - (a.lastMessageTimestamp?.getTime() || 0)));
      setIsLoading(false);
    }, 500);

    fetchNotes();
  }, [toast]); 

  const handleSaveNote = async (content: string, emoji?: string, songTitle?: string, songArtist?: string) => {
    try {
      const savedNote = await saveUserNote(currentUserId, currentUsername, currentUserAvatar, content, emoji, songTitle, songArtist);
      setCurrentUserNote(savedNote);
      toast({ title: 'Note Saved!', description: 'Your note has been updated.' });
      await fetchNotes();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error Saving Note', description: error.message || 'Could not save your note.' });
    }
  };

  const handleDeleteNote = async () => {
    try {
      await deleteUserNote(currentUserId);
      setCurrentUserNote(null);
      toast({ title: 'Note Deleted', description: 'Your note has been removed.' });
      await fetchNotes();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Deleting Note', description: 'Could not delete your note.' });
    }
  };

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    toast({ title: "Create Group", description: "Group chat functionality coming soon!" });
    // TODO: Implement group creation UI/flow
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-primary" onClick={handleCreateGroup}>
              <Users className="h-5 w-5" />
              <span className="sr-only">New Group</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary">
              <Edit className="h-5 w-5" />
              <span className="sr-only">New Message</span>
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats or people..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
         <div className="mt-3 text-right">
            <Link href="/messages/requests" className="text-sm text-primary hover:underline">
              Message Requests (1) 
            </Link>
         </div>
      </div>

      <div className="p-4 border-b">
        <h2 className="text-xs font-semibold text-muted-foreground mb-2">NOTES</h2>
        {isNotesLoading ? (
          <div className="flex space-x-4 h-28 items-center">
            {[...Array(4)].map((_, i) => ( <div key={i} className="flex flex-col items-center gap-1.5 w-20"><Avatar className="h-14 w-14 bg-muted rounded-full animate-pulse" /><div className="h-2 w-12 bg-muted rounded animate-pulse"/></div>))}
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4">
              <NoteItem
                note={currentUserNote || undefined} 
                isCurrentUserPlaceholder={true}
                onClick={() => setIsAddNoteDialogOpen(true)}
                currentUsername={currentUsername}
              />
              {friendNotes.map((note) => (
                <NoteItem
                  key={note.userId}
                  note={note}
                  onClick={() => {
                    let description = `${note.content} ${note.emoji || ''}`;
                     if(note.songTitle) {
                        description += `\n🎵 ${note.songTitle}${note.songArtist ? ` - ${note.songArtist}` : ''}`;
                     }
                    toast({ title: `${note.username}'s Note`, description: description});
                  }}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        )}
      </div>
       <AddNoteDialog
        isOpen={isAddNoteDialogOpen}
        onOpenChange={setIsAddNoteDialogOpen}
        currentUserNote={currentUserNote}
        onSave={handleSaveNote} 
        onDelete={handleDeleteNote}
      />

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">Loading chats...</div>
        ) : filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat) => (
              <Link key={chat.id} href={`/messages/${chat.id}`} legacyBehavior>
                <a className="flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatarUrl} alt={chat.name} data-ai-hint="profile avatar" />
                      <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-semibold truncate ${chat.unreadCount ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {chat.name}
                      </h3>
                      {chat.lastMessageTimestamp && (
                        <p className={`text-xs ${chat.unreadCount ? 'text-primary' : 'text-muted-foreground'}`}>
                          {formatDistanceToNowStrict(chat.lastMessageTimestamp, { addSuffix: false })}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${chat.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {chat.isTyping ? <span className="italic text-primary">Typing...</span> : chat.lastMessage}
                      </p>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs font-semibold rounded-full px-2 py-0.5">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            {searchTerm ? `No results for "${searchTerm}"` : "No chats yet. Start a new conversation!"}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
