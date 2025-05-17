'use client';

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, BookOpen, Headphones, Share2, MessageSquare, Heart, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Story, BlogPageProps } from '@/types/blog';
import { getStoryById, getCommentCount } from '@/services/blog';
import AudioPlayer from '@/components/app/AudioPlayer';
import CommentSheet from '@/components/app/CommentSheet';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdPlaceholderInline: FC = () => (
  <div className="my-6 p-4 border rounded-md bg-muted/30 text-center text-muted-foreground">
    <p className="font-semibold">Ad Placeholder</p>
    <p className="text-xs">Google AdMob - Native/Banner Ad</p>
  </div>
);

const StoryPage: NextPage<BlogPageProps> = ({ params }) => {
  const [storyId, setStoryId] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (params?.storyId) {
      setStoryId(params.storyId as string);
    }
  }, [params]);

  useEffect(() => {
    if (storyId) {
      const fetchStoryData = async () => {
        setIsLoading(true);
        try {
          const [fetchedStory, fetchedCommentCount] = await Promise.all([
             getStoryById(storyId),
             getCommentCount(storyId)
          ]);

          setStory(fetchedStory);
          setCommentCount(fetchedCommentCount);

          setLikeCount(fetchedStory ? Math.floor((fetchedStory.viewCount || 0) / 10) : 0);
        } catch (error) {
          console.error("Failed to fetch content:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load content." });
        }
        setIsLoading(false);
      };
      fetchStoryData();
    } else {
      setIsLoading(false);
    }
  }, [storyId, toast]);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      console.log(`Unliked story ${story?.id}`);
    } else {
      setLikeCount(prev => prev + 1);
      console.log(`Liked story ${story?.id}`);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
    setIsCommentSheetOpen(true);
  };

  const onCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

 const handleShare = async () => {
    if (!story || typeof window === 'undefined') return;
    const shareData = {
      title: story.title,
      text: `Check out this ${story.contentType === 'article' ? 'article' : 'story'} on AKmax: "${story.title}"`,
      url: window.location.href,
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share && window.isSecureContext) {
        await navigator.share(shareData);
        console.log(`Shared story ${story.id}`);
        toast({ title: "Content Shared!" });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        console.log(`Copied story link ${story.id}`);
        toast({ title: "Link Copied!", description: "Web Share API not available or not in a secure context. Story link copied to clipboard." });
      } else {
        toast({ title: "Sharing Not Supported", description: "Your browser does not support the Web Share API or clipboard operations." });
      }
    } catch (error: any) {
      console.error('Error sharing story:', error);
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
                console.log(`Copied story link ${story.id} as fallback.`);
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
        toast({ variant: "destructive", title: "Sharing Failed", description: "Could not share the content. Please try again." });
      }
    }
  };


  if (isLoading) {
    return <div className="container mx-auto max-w-3xl py-10 text-center">Loading content...</div>;
  }

  if (!story) {
    return <div className="container mx-auto max-w-3xl py-10 text-center text-destructive">Content not found.</div>;
  }

  const isArticle = story.contentType === 'article';
  const isStoryBook = story.contentType === 'story_book';
  const ContentIcon = isArticle ? Newspaper : BookOpen;
  const contentTypeLabel = isArticle ? 'Article' : 'Story';

  let backLink = "/blog";
  let backText = "Back to Blog";
  if (isStoryBook && story.seriesId) {
      backLink = `/blog/series/${story.seriesId}`;
      backText = "Back to Series";
  }
  
  // Split content for ad insertion (example: mid-article)
  const contentParts = story.content.split('\n\n'); // Split by double newline
  const midPoint = Math.floor(contentParts.length / 2);

  return (
    <>
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Link>
        </Button>

        <article className="space-y-6">
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
              <ContentIcon className="h-4 w-4"/> {contentTypeLabel}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{story.title}</h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <Link href={`/profile/${story.author.username}`} className="flex items-center gap-2 hover:text-primary">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={story.author.avatarUrl} alt={story.author.username} data-ai-hint="author avatar" />
                  <AvatarFallback>{story.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{story.author.username}</span>
              </Link>
              <span>·</span>
              <span>Published on {format(new Date(story.createdAt), 'MMMM d, yyyy')}</span>
              {isStoryBook && story.seriesId && story.episodeNumber && (
                  <>
                    <span>·</span>
                    <span>Episode {story.episodeNumber}</span>
                  </>
              )}
            </div>
          </header>

          {story.coverImageUrl && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
              <Image
                src={story.coverImageUrl}
                alt={`Cover image for ${story.title}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 768px) 100vw, 800px"
                data-ai-hint="story cover art"
              />
            </div>
          )}

          {story.audioUrl && (
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-3 flex items-center"><Headphones className="mr-2 h-5 w-5 text-primary"/> Listen to this {contentTypeLabel.toLowerCase()}</h2>
              <AudioPlayer src={story.audioUrl} title={story.title} />
            </div>
          )}

          {/* Render content with ad placeholders */}
          <div className="prose prose-lg dark:prose-invert max-w-none break-words">
            {contentParts.slice(0, midPoint).map((part, index) => (
              <p key={`part1-${index}`} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />') }} />
            ))}
            
            {isArticle && <AdPlaceholderInline />} 

            {contentParts.slice(midPoint).map((part, index) => (
              <p key={`part2-${index}`} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />') }} />
            ))}
          </div>
          
          {isArticle && <AdPlaceholderInline />} 

          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {story.tags.map(tag => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} legacyBehavior>
                  <a className="text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1 rounded-md">
                    #{tag}
                  </a>
                </Link>
              ))}
            </div>
          )}

          <footer className="pt-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleLike}>
                      <Heart className={cn("mr-1 h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
                      {likeCount.toLocaleString()} {likeCount === 1 ? 'Like' : 'Likes'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleComment}>
                      <MessageSquare className="mr-1 h-4 w-4" /> {commentCount} Comment{commentCount !== 1 ? 's' : ''}
                  </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
          </footer>

        </article>
      </div>

      <CommentSheet
        isOpen={isCommentSheetOpen}
        onOpenChange={setIsCommentSheetOpen}
        contentId={story.id}
        contentType={story.contentType === 'article' ? 'article' : 'story'}
        onCommentAdded={onCommentAdded}
      />
    </>
  );
};

export default StoryPage;
