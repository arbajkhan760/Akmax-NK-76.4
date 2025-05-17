'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import type { UserNote } from '@/types/notes';
import { Trash2, Send, Smile, Music2, Search, Loader2 } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea

const MAX_NOTE_LENGTH = 60;

// Mock Music Data
interface MockSong {
    title: string;
    artist: string;
}
const mockMusicResults: MockSong[] = [
    { title: "Blinding Lights", artist: "The Weeknd"},
    { title: "Levitating", artist: "Dua Lipa"},
    { title: "Stay", artist: "The Kid LAROI, Justin Bieber"},
    { title: "Good 4 U", artist: "Olivia Rodrigo"},
    { title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar, Giveon"},
    { title: "Chill Lo-fi Beat", artist: "Study Vibes"},
    { title: "Upbeat Pop Anthem", artist: "Summer Hits"},
];


interface AddNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserNote?: UserNote | null;
  onSave: (content: string, emoji?: string, songTitle?: string, songArtist?: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const AddNoteDialog: FC<AddNoteDialogProps> = ({
  isOpen,
  onOpenChange,
  currentUserNote,
  onSave,
  onDelete,
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Music Search State
  const [musicSearchTerm, setMusicSearchTerm] = useState('');
  const [musicSearchResults, setMusicSearchResults] = useState<MockSong[]>([]);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);


  useEffect(() => {
    if (isOpen) { // Reset/populate form when dialog opens
        if (currentUserNote) {
          setContent(currentUserNote.content);
          setEmoji(currentUserNote.emoji || '');
          setSongTitle(currentUserNote.songTitle || '');
          setSongArtist(currentUserNote.songArtist || '');
          setCharCount(currentUserNote.content.length);
        } else {
          setContent('');
          setEmoji('');
          setSongTitle('');
          setSongArtist('');
          setCharCount(0);
        }
        // Reset music search state as well
        setMusicSearchTerm('');
        setMusicSearchResults([]);
        setIsSearchingMusic(false);
    }
  }, [currentUserNote, isOpen]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_NOTE_LENGTH) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmoji = e.target.value;
    // Allow up to 2 chars for complex emojis like flags, or typical single char emojis
    if (newEmoji.length <= 2) {
        setEmoji(newEmoji);
    } else {
        // If user tries to type more, take the first 2 (or 1 if it's a single emoji)
        // This is a simple take, a proper emoji picker would be better.
        setEmoji(newEmoji.slice(0,2));
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
        toast({ variant: "destructive", title: "Cannot share empty note", description: "Please write something for your note." });
        return;
    }
    await onSave(content, emoji.trim() || undefined, songTitle.trim() || undefined, songArtist.trim() || undefined);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      onOpenChange(false);
    }
  };

  const handleSearchMusic = async () => {
    if (!musicSearchTerm.trim()) {
        setMusicSearchResults([]);
        return;
    }
    setIsSearchingMusic(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    // Filter mock results based on search term (simple substring match)
    const lowerSearchTerm = musicSearchTerm.toLowerCase();
    const results = mockMusicResults.filter(
        song => song.title.toLowerCase().includes(lowerSearchTerm) || song.artist.toLowerCase().includes(lowerSearchTerm)
    );
    setMusicSearchResults(results);
    setIsSearchingMusic(false);
  }

  const handleSelectSong = (song: MockSong) => {
    setSongTitle(song.title);
    setSongArtist(song.artist);
    setMusicSearchTerm(''); // Clear search term after selection
    setMusicSearchResults([]); // Clear results
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{currentUserNote ? 'Edit Note' : 'Leave a Note'}</DialogTitle>
          <DialogDescription>
            Share a quick thought with your friends. It will disappear after 24 hours.
          </DialogDescription>
        </DialogHeader>
        {/* Make content scrollable */}
        <ScrollArea className="flex-1 overflow-y-auto -mx-6 px-6">
            <div className="py-4 space-y-4">
              {/* Note Content */}
              <div className="space-y-1">
                <Label htmlFor="note-content">Your Note</Label>
                <Textarea
                  id="note-content"
                  value={content}
                  onChange={handleContentChange}
                  placeholder="What's on your mind?"
                  maxLength={MAX_NOTE_LENGTH}
                  className="resize-none"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {charCount}/{MAX_NOTE_LENGTH}
                </div>
              </div>

              {/* Emoji Input */}
              <div className="space-y-1">
                <Label htmlFor="note-emoji">Emoji (Optional)</Label>
                <div className="flex items-center gap-2">
                   <Smile className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                        id="note-emoji"
                        value={emoji}
                        onChange={handleEmojiChange}
                        placeholder="😊"
                        className="w-20"
                    />
                    {/* TODO: Proper Emoji Picker integration */}
                </div>
              </div>

              {/* Song Input & Search */}
               <div className="space-y-2">
                <Label>Share a Song (Optional)</Label>
                {/* Display selected song */}
                {(songTitle || songArtist) && (
                    <div className="flex items-center gap-2 text-sm border rounded-md p-2 bg-muted/50">
                         <Music2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                         <div className="flex-1 truncate">
                            <p className="font-medium truncate">{songTitle || "Unknown Title"}</p>
                            {songArtist && <p className="text-xs text-muted-foreground truncate">{songArtist}</p>}
                         </div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => {setSongTitle(''); setSongArtist('');}}>
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Remove song</span>
                         </Button>
                    </div>
                )}
                {/* Music Search */}
                <div className="flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <Input
                        id="music-search"
                        value={musicSearchTerm}
                        onChange={(e) => setMusicSearchTerm(e.target.value)}
                        placeholder="Search for music..."
                        className="text-sm flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={handleSearchMusic} disabled={isSearchingMusic}>
                         {isSearchingMusic ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                        <span className="sr-only">Search Music</span>
                    </Button>
                </div>
                 {/* Search Results */}
                 {musicSearchResults.length > 0 && !isSearchingMusic && (
                    <div className="border rounded-md mt-2 max-h-32 overflow-y-auto">
                        {musicSearchResults.map((song, index) => (
                            <Button
                                key={`${song.title}-${index}`}
                                variant="ghost"
                                className="w-full justify-start h-auto py-2 px-3 text-left text-sm"
                                onClick={() => handleSelectSong(song)}
                            >
                                <div>
                                    <p className="font-medium">{song.title}</p>
                                    <p className="text-xs text-muted-foreground">{song.artist}</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                 )}
                 {isSearchingMusic && (
                    <div className="text-center text-muted-foreground text-sm py-4">Searching...</div>
                 )}
                 {!isSearchingMusic && musicSearchTerm && musicSearchResults.length === 0 && (
                     <p className="text-xs text-muted-foreground pl-7">No results found for "{musicSearchTerm}".</p>
                 )}
              </div>
            </div>
        </ScrollArea>
        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between items-center pt-4 border-t">
          <div className="w-full sm:w-auto">
          {currentUserNote && onDelete && (
            <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Note
            </Button>
          )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1 sm:flex-initial">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit} disabled={!content.trim()} className="flex-1 sm:flex-initial">
              <Send className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;