'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, MoreVertical, PlayCircle, Bookmark, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import CommentSheet from './CommentSheet';
import Link from 'next/link';

// Define the structure for a Post
interface Post {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string; // Optional: for video posts
  user: {
    username: string;
    avatarUrl: string;
  };
  caption?: string;
  likes: number;
  comments: number;
  shares: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [isSaved, setIsSaved] = useState(false);


  const handleFollow = () => {
    console.log(`Following ${post.user.username}`);
    toast({ title: `Followed ${post.user.username}` });
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      console.log(`Unliked post ${post.id}`);
    } else {
      setLikeCount(prev => prev + 1);
      console.log(`Liked post ${post.id}`);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setIsCommentSheetOpen(true);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareData = {
      title: `Post by ${post.user.username}`,
      text: post.caption || `Check out this post on AKmax!`,
      url: `${window.location.origin}/post/${post.id}`, 
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share && window.isSecureContext) {
        await navigator.share(shareData);
        console.log(`Shared post ${post.id}`);
        toast({ title: "Post Shared!" });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        console.log(`Copied post link ${post.id}`);
        toast({ title: "Link Copied!", description: "Web Share API not available or not in a secure context. Post link copied to clipboard." });
      } else {
        toast({ title: "Sharing Not Supported", description: "Your browser does not support the Web Share API or clipboard operations." });
      }
    } catch (error: any) {
      console.error('Error sharing post:', error);
      if (error.name === 'NotAllowedError' || error.message?.includes('Permission denied')) {
        let description = "Sharing failed. Please check your browser permissions for this site and ensure you are on a secure (HTTPS) connection.";
        if (typeof window !== 'undefined' && !window.isSecureContext) {
            description = "Sharing failed. This feature requires a secure (HTTPS) connection. Your current connection is not secure.";
        } else if (typeof window !== 'undefined' && window.isSecureContext) {
            description = "Sharing failed. Please ensure your browser has permission to share from this site. You might need to grant this permission in your browser settings.";
        }
        toast({
          variant: "destructive",
          title: "Sharing Problem",
          description: description,
          duration: 7000,
        });
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shareData.url);
                console.log(`Copied post link ${post.id} as fallback.`);
                toast({ title: "Link Copied!", description: "Sharing failed, but link copied to clipboard." });
            } catch (copyError) {
                console.error('Fallback copy to clipboard failed:', copyError);
                toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy the link." });
            }
        }
      } else if (error.name === 'AbortError') {
         toast({ variant: "destructive", title: "Sharing Cancelled", description: "You cancelled the share operation." });
      }
      else {
        toast({ variant: "destructive", title: "Sharing Failed", description: "Could not share the post. Please try again." });
      }
    }
  };


  const onCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  const handleSavePost = () => {
    setIsSaved(!isSaved);
    toast({ title: isSaved ? "Post Unsaved" : "Post Saved", description: isSaved ? "Removed from your saved posts." : "Added to your saved posts." });
  };

  const handleReportPost = () => {
    toast({ title: "Report Submitted", description: "Thank you, we will review this post." });
  };

  const handleBlockUser = () => {
    toast({ variant: "destructive", title: `Blocked ${post.user.username}`, description: "You will no longer see their posts or profile." });
  };

  const handleTagPeople = () => {
    toast({ title: "Tag People", description: "Tagging feature coming soon!"});
  }


  return (
    <>
      <Card className="w-full overflow-hidden border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between p-3 space-x-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link href={`/profile/${post.user.username}`} passHref legacyBehavior>
                <a className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8 border">
                    <AvatarImage src={post.user.avatarUrl} alt={post.user.username} data-ai-hint="user avatar"/>
                    <AvatarFallback>{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm truncate hover:underline">{post.user.username}</span>
                </a>
            </Link>
            <span className="text-muted-foreground mx-1">·</span>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-primary font-semibold"
              onClick={handleFollow}
            >
              Follow
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTagPeople}>
                <UserPlus className="mr-2 h-4 w-4" /> Tag People
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReportPost} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                Report Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                Block {post.user.username}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="p-0 relative aspect-square bg-muted overflow-hidden">
          <Image
            src={post.thumbnailUrl || post.mediaUrl}
            alt={`Post by ${post.user.username}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            data-ai-hint={post.type === 'video' ? 'video content social' : 'image content social'}
            priority
          />
          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer group">
              <PlayCircle className="h-16 w-16 text-white/80 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="sr-only">Play video</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start p-3 space-y-2">
          <div className="flex items-center gap-0.5 w-full">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLike}>
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
              <span className="sr-only">Like ({likeCount})</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleComment}>
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Comment ({commentCount})</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share ({post.shares})</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto -mr-2" onClick={handleSavePost}>
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-foreground text-foreground")} />
              <span className="sr-only">Save Post</span>
            </Button>
          </div>

          {likeCount > 0 && (
            <div className="text-sm font-semibold">
              {likeCount.toLocaleString()} like{likeCount !== 1 ? 's' : ''}
            </div>
          )}

          {post.caption && (
            <div className="text-sm w-full">
              <Link href={`/profile/${post.user.username}`} passHref legacyBehavior>
                 <a className="font-semibold mr-1 hover:underline">{post.user.username}</a>
              </Link>
              <span>{post.caption}</span>
            </div>
          )}

          {commentCount > 0 && (
            <Button variant="link" size="sm" className="text-muted-foreground p-0 h-auto" onClick={handleComment}>
              View all {commentCount} comment{commentCount !== 1 ? 's' : ''}
            </Button>
          )}
        </CardFooter>
      </Card>

      <CommentSheet
        isOpen={isCommentSheetOpen}
        onOpenChange={setIsCommentSheetOpen}
        contentId={post.id}
        contentType="post"
        onCommentAdded={onCommentAdded}
      />
    </>
  );
};

export default PostCard;
