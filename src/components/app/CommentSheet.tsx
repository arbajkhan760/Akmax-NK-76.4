'use client';

import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, MessageCircle, UserCircle, ShieldAlert } from 'lucide-react'; // Added ShieldAlert
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/types/comment'; 
import { getComments, addComment } from '@/services/commentService'; 

interface CommentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string; 
  contentType: 'post' | 'reel' | 'story' | 'article'; 
  onCommentAdded?: () => void; 
}

const MOCK_CURRENT_USER = {
    id: 'user123',
    username: 'current_user',
    avatarUrl: 'https://picsum.photos/seed/me/40',
};

// Simple list of filtered words (expand as needed)
const FILTERED_WORDS = ['badword1', 'inappropriate', 'spammycontent', 'hateword'];


const CommentSheet: FC<CommentSheetProps> = ({
  isOpen,
  onOpenChange,
  contentId,
  contentType,
  onCommentAdded,
}) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentId) {
      const fetchComments = async () => {
        setIsLoading(true);
        try {
          const fetchedComments = await getComments(contentId, contentType);
          setComments(fetchedComments);
           setTimeout(() => {
                if(scrollAreaRef.current?.lastElementChild) {
                   scrollAreaRef.current.lastElementChild.scrollIntoView({behavior: 'smooth'});
                }
            }, 100);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not load comments.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchComments();
    } else {
      setComments([]);
      setNewComment('');
    }
  }, [isOpen, contentId, contentType, toast]);

  const checkFilteredWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return FILTERED_WORDS.some(word => lowerText.includes(word));
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (checkFilteredWords(newComment)) {
      toast({
        variant: 'destructive',
        title: 'Inappropriate Content',
        description: 'Your comment contains words that violate our community guidelines. Please revise.',
        duration: 5000,
      });
      return;
    }

    setIsPosting(true);

    try {
      const addedComment = await addComment(
        contentId,
        contentType,
        newComment,
        MOCK_CURRENT_USER.id,
        MOCK_CURRENT_USER.username,
        MOCK_CURRENT_USER.avatarUrl
      );
      setComments(prev => [...prev, addedComment]);
      setNewComment('');
      toast({ title: 'Comment Posted!' });
        setTimeout(() => {
            if(scrollAreaRef.current?.lastElementChild) {
               scrollAreaRef.current.lastElementChild.scrollIntoView({behavior: 'smooth'});
            }
        }, 100);
      onCommentAdded?.(); 
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not post comment.' });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Comments ({comments.length})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto px-4 py-2">
           <div ref={scrollAreaRef} className="space-y-4">
              {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading comments...</div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.user.avatarUrl} alt={comment.user.username} data-ai-hint="commenter avatar"/>
                       <AvatarFallback>
                         <UserCircle className="h-5 w-5"/>
                       </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold mr-1">{comment.user.username}</span>
                        {comment.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                   <MessageCircle className="mx-auto h-8 w-8 mb-2"/>
                   No comments yet. Be the first!
                </div>
              )}
           </div>
        </ScrollArea>
        <SheetFooter className="p-4 border-t">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-8 w-8">
               <AvatarImage src={MOCK_CURRENT_USER.avatarUrl} alt={MOCK_CURRENT_USER.username} data-ai-hint="current user avatar"/>
               <AvatarFallback><UserCircle className="h-5 w-5"/></AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
              className="flex-1 resize-none min-h-[40px] max-h-[100px] text-sm"
              disabled={isPosting}
            />
            <Button
              size="icon"
              onClick={handlePostComment}
              disabled={!newComment.trim() || isPosting}
            >
              {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Post comment</span>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CommentSheet;
