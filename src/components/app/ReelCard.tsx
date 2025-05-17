'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Music2, MoreVertical, Play } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import CommentSheet from './CommentSheet';
import type { ReelFeedItem, OrganicReel, AdReel } from '@/types/reel';
import { isAdReel } from '@/types/reel';
import SponsoredLabel from './SponsoredLabel';
import AdCtaButton from './AdCtaButton';
import Link from 'next/link';

interface ReelCardProps {
  item: ReelFeedItem;
}

const AdReelPlaceholder: FC<{ ad: AdReel }> = ({ ad }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white p-6 text-center">
    <p className="text-xl font-semibold mb-2">Google AdMob - Ad Placeholder</p>
    <p className="text-gray-300 mb-1">Advertiser: {ad.advertiser.username}</p>
    {ad.headline && <p className="text-base my-2">{ad.headline}</p>}
    <AdCtaButton
      ctaText={ad.ctaText}
      ctaLink={ad.ctaLink}
      variant="secondary"
      size="lg"
      className="mt-4 bg-white/90 text-black hover:bg-white"
    />
    <SponsoredLabel className="absolute bottom-28 left-1/2 -translate-x-1/2 !text-white/70" />
  </div>
);


const ReelCard: FC<ReelCardProps> = ({ item }) => {
  const { toast } = useToast();
  const isAd = isAdReel(item);

  const initialLikes = isAd ? item.likes ?? 0 : item.likes;
  const initialComments = isAd ? item.comments ?? 0 : item.comments;
  const initialShares = isAd ? item.shares ?? 0 : item.shares;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments);

  const displayUser = isAd ? item.advertiser : item.user;
  const displayAudio = isAd ? item.audio : item.audio;
  const displayDescription = isAd ? item.headline : item.description;

  const handleLike = () => {
    if (isAd) {
        setIsLiked(prev => !prev);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        console.log(`Liked ad ${item.id}`);
        toast({ title: `Ad ${isLiked ? 'unliked' : 'liked'} (Simulated)` });
        return;
    }
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      console.log(`Unliked reel ${item.id}`);
    } else {
      setLikeCount(prev => prev + 1);
      console.log(`Liked reel ${item.id}`);
    }
    setIsLiked(!isLiked);
  };

  const handleComment = () => {
     if (isAd) {
         console.log(`Comment button clicked on ad ${item.id}`);
         toast({ title: "Commenting on ads disabled (Demo)" });
         return;
     }
    setIsCommentSheetOpen(true);
  };

 const handleShare = async () => {
     if (typeof window === 'undefined') return;
     const isAdShare = isAd;
     const shareData = {
      title: `Check this out on AKmax`,
      text: displayDescription || (isAdShare ? `Ad by ${displayUser.username}` : `Reel by ${displayUser.username}`),
      url: isAdShare ? item.ctaLink : `${window.location.origin}/reels/${item.id}`,
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share && window.isSecureContext) {
        await navigator.share(shareData);
        console.log(`Shared ${isAdShare ? 'ad' : 'reel'} ${item.id}`);
        toast({ title: `${isAdShare ? 'Ad' : 'Reel'} Shared!` });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        console.log(`Copied link for ${isAdShare ? 'ad' : 'reel'} ${item.id}`);
        toast({ title: "Link Copied!", description: `${isAdShare ? 'Ad' : 'Reel'} link copied.` });
      } else {
        toast({ title: "Sharing Not Supported", description: "Your browser does not support sharing or copying links." });
      }
    } catch (error: any) {
      console.error(`Error sharing ${isAdShare ? 'ad' : 'reel'}:`, error);
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
        // Attempt to copy to clipboard as a fallback
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(shareData.url);
                console.log(`Copied ${isAdShare ? 'ad' : 'reel'} link ${item.id} as fallback.`);
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
        toast({ variant: "destructive", title: "Sharing Failed" });
      }
    }
  };


  const handleFollow = () => {
    if(isAd) return;
    console.log(`Following ${displayUser.username}`);
    toast({ title: `Followed ${displayUser.username}` });
  };

  const handleAudioClick = () => {
     if (!displayAudio) return;
    console.log(`Clicked audio: ${displayAudio.title}`);
    toast({ title: "Audio Feature", description: `Playing ${displayAudio.title}` });
  };

  const onCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log(`Navigating to profile/page: ${displayUser.username}`);
      if (typeof window !== 'undefined') {
        window.location.href = `/profile/${displayUser.username}`;
      }
  };


  return (
    <>
      <div className="relative h-screen w-full snap-start overflow-hidden bg-black flex items-center justify-center">
        {isAd ? (
            <AdReelPlaceholder ad={item as AdReel} />
        ) : (
            <>
                <Image
                src={item.thumbnailUrl || item.videoUrl}
                alt={`Video by ${displayUser.username}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
                data-ai-hint="reel video content"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 cursor-pointer group">
                    <Play className="h-16 w-16 text-white/50 fill-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="sr-only">Play Video</span>
                </div>
            </>
        )}


        <div className="absolute inset-x-0 bottom-0 z-20 p-4 text-white bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
               <button onClick={handleProfileClick} className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-9 w-9 border border-white/50">
                      <AvatarImage src={displayUser.avatarUrl} alt={displayUser.username} data-ai-hint="user avatar"/>
                      <AvatarFallback>{displayUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                      <span className="font-semibold text-sm hover:underline">{displayUser.username}</span>
                      {isAd && <SponsoredLabel className="!text-white/70 -mt-0.5" />}
                  </div>
               </button>
               {!isAd && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 px-3 py-1 h-auto text-xs border-white/80 text-white bg-transparent hover:bg-white/20"
                        onClick={handleFollow}
                    >
                    Follow
                    </Button>
                )}
            </div>
            {displayDescription && <p className="text-sm line-clamp-2">{displayDescription}</p>}
            {displayAudio && (
                <div
                className="flex items-center gap-2 cursor-pointer hover:underline text-xs mt-1"
                onClick={handleAudioClick}
                >
                    <Music2 className="h-3 w-3" />
                    <span>{displayAudio.title}</span>
                    {!isAd && displayAudio.isOriginal && <span className="text-xs opacity-70">· Original audio</span>}
                </div>
             )}
              {isAd && (
                  <AdCtaButton
                    ctaText={(item as AdReel).ctaText}
                    ctaLink={(item as AdReel).ctaLink}
                    variant="secondary"
                    size="sm"
                    className="mt-2 w-full max-w-xs self-start bg-white/90 text-black hover:bg-white"
                  />
              )}
          </div>
        </div>

        <div className="absolute right-2 bottom-24 md:bottom-16 z-20 flex flex-col items-center gap-4">
          <button onClick={handleLike} className="flex flex-col items-center gap-1 text-white" aria-label={`Like this ${isAd ? 'ad' : 'reel'}`}>
            <Heart className={cn("h-7 w-7 transition-colors", isLiked ? "fill-red-500 text-red-500" : "hover:text-white/80")} />
            <span className="text-xs font-semibold">{likeCount.toLocaleString()}</span>
          </button>
          <button onClick={handleComment} className="flex flex-col items-center gap-1 text-white" disabled={isAd} aria-label="View comments">
            <MessageCircle className={cn("h-7 w-7 transition-colors", isAd ? "text-white/50" : "hover:text-white/80")} />
            <span className="text-xs font-semibold">{commentCount.toLocaleString()}</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1 text-white" aria-label="Share">
            <Share2 className="h-7 w-7 transition-colors hover:text-white/80" />
            <span className="text-xs font-semibold">{initialShares.toLocaleString()}</span>
          </button>
          <button className="text-white" aria-label="More options">
            <MoreVertical className="h-7 w-7 transition-colors hover:text-white/80" />
          </button>
          {displayAudio && (
             <button
                className="mt-2 p-1.5 bg-black/50 rounded-full border border-white/50 hover:bg-black/70 transition-colors"
                onClick={handleAudioClick}
                aria-label={`Audio: ${displayAudio.title}`}
             >
                 <Avatar className="h-5 w-5">
                     <AvatarImage src={displayUser.avatarUrl} alt="Audio source" />
                     <AvatarFallback><Music2 className="h-3 w-3"/></AvatarFallback>
                 </Avatar>
             </button>
          )}
        </div>
      </div>

      {!isAd && (
         <CommentSheet
            isOpen={isCommentSheetOpen}
            onOpenChange={setIsCommentSheetOpen}
            contentId={item.id}
            contentType="reel"
            onCommentAdded={onCommentAdded}
          />
       )}
    </>
  );
};

export default ReelCard;
