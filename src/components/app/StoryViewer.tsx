'use client';

import type { FC } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Send, Smile, ExternalLink, Link as LinkIcon, Heart, Share2 as ShareIcon } from 'lucide-react'; 
import type { UserStory, StorySegment } from '@/types/story'; 
import { isAdSegment, AdStorySegment } from '@/types/story'; 
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { Input } from '../ui/input';
import SponsoredLabel from './SponsoredLabel'; 
import AdCtaButton from './AdCtaButton'; 
import { useToast } from '@/hooks/use-toast'; 

interface StoryViewerProps {
  stories: UserStory[]; 
  startIndex: number;
  onClose: () => void;
}

const STORY_IMAGE_DURATION_MS = 5000; 
const AD_IMAGE_DURATION_MS = 10000; 
const AD_VIDEO_MAX_DURATION_MS = 15000; 

const AdPlaceholder: FC<{ segment: AdStorySegment }> = ({ segment }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-white p-4">
    <p className="text-lg font-semibold">Google AdMob - Ad Placeholder</p>
    <p className="text-sm text-gray-400 mt-1">Ad Type: {segment.type.replace('ad_', '')}</p>
    {segment.headline && <p className="mt-2 text-center text-base">{segment.headline}</p>}
    <div className="mt-4">
      <AdCtaButton
        ctaText={segment.ctaText}
        ctaLink={segment.ctaLink}
        variant="secondary"
        className="bg-white/90 text-black hover:bg-white"
      />
    </div>
    <SponsoredLabel className="absolute bottom-16 left-1/2 -translate-x-1/2 !text-white/70" />
  </div>
);


const StoryViewer: FC<StoryViewerProps> = ({ stories, startIndex, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(startIndex);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast(); 

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
  const safeStories = stories || [];
  const currentUserStory = safeStories[currentUserIndex];
  const currentSegment = currentUserStory?.segments[currentSegmentIndex];
  const isCurrentSegmentAd = currentSegment && isAdSegment(currentSegment); 

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0; 
      
      if (videoRef.current.pause) {
        videoRef.current.pause();
      }
    }
  }, []);

  const nextSegment = useCallback(() => {
    resetTimer();
    if (currentUserStory && currentSegmentIndex < currentUserStory.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    } else {
      
      if (currentUserIndex < safeStories.length - 1) {
        setCurrentUserIndex(prev => prev + 1);
        setCurrentSegmentIndex(0);
      } else {
        onClose(); 
      }
    }
  }, [currentUserIndex, currentSegmentIndex, currentUserStory, safeStories.length, onClose, resetTimer]);

  const prevSegment = useCallback(() => {
    resetTimer();
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
    } else {
      
      if (currentUserIndex > 0) {
        const prevUserIndex = currentUserIndex - 1;
        setCurrentUserIndex(prevUserIndex);
        
        setCurrentSegmentIndex(safeStories[prevUserIndex].segments.length - 1);
      }
      
    }
  }, [currentUserIndex, currentSegmentIndex, safeStories, resetTimer]);


   const calculateDuration = (segment: StorySegment): number => {
        if (isAdSegment(segment)) {
            if (segment.type === 'ad_video') {
                
                return videoRef.current?.duration ? Math.min(videoRef.current.duration * 1000, AD_VIDEO_MAX_DURATION_MS) : AD_VIDEO_MAX_DURATION_MS;
            } else { 
                return segment.duration ? Math.min(segment.duration * 1000, AD_IMAGE_DURATION_MS) : AD_IMAGE_DURATION_MS;
            }
        } else { 
            if (segment.type === 'video') {
                return videoRef.current?.duration ? videoRef.current.duration * 1000 : STORY_IMAGE_DURATION_MS; 
            } else { 
                return segment.duration ? segment.duration * 1000 : STORY_IMAGE_DURATION_MS;
            }
        }
    };

  const startTimer = useCallback((duration: number) => {
    if (isPaused || duration <= 0) return; 
    resetTimer();
    const startTime = Date.now();
    const effectiveDuration = duration; 

    progressIntervalRef.current = setInterval(() => {
      if (isPaused) return;
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / effectiveDuration) * 100);
      setProgress(currentProgress);
    }, 50);

    timerRef.current = setTimeout(() => {
      if (isPaused) return;
      nextSegment();
    }, effectiveDuration);

  }, [isPaused, resetTimer, nextSegment]);

  const handleVideoTimeUpdate = useCallback(() => {
     if (videoRef.current && !isPaused && videoRef.current.duration > 0 && currentSegment) { 
        const segmentDuration = calculateDuration(currentSegment); 
        const currentProgress = Math.min(100, (videoRef.current.currentTime / (segmentDuration / 1000)) * 100);
        setProgress(currentProgress);
     }
  }, [isPaused, currentSegment, calculateDuration]);

   const handleVideoLoadedData = useCallback(() => {
     if (videoRef.current && !isPaused) {
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
     }
   }, [isPaused]);

  const handleVideoEnded = useCallback(() => {
      
      if (!isPaused) {
         
         setProgress(100);
         
         setTimeout(() => {
             if(!isPaused) nextSegment();
         }, 100);
      }
  }, [isPaused, nextSegment]);


  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const wasPaused = prev;
      const isNowPaused = !wasPaused;
      const segment = currentSegment; 

      if (!segment) return isNowPaused;

      if (segment.type === 'video' || segment.type === 'ad_video') {
        if (videoRef.current) {
          if (isNowPaused) {
            videoRef.current.pause();
            
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
          } else {
            videoRef.current.play().catch(e => console.error("Error resuming video:", e));
            
          }
        }
      } else if (segment.type === 'image' || segment.type === 'ad_image' || segment.type === 'ad_carousel') {
        if (isNowPaused) {
          
          if (timerRef.current) clearTimeout(timerRef.current);
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        } else {
          
          const duration = calculateDuration(segment);
          const remainingTime = duration * (1 - progress / 100);
          startTimer(remainingTime);
        }
      }
      return isNowPaused;
    });
  }, [currentSegment, progress, startTimer, calculateDuration]);

  
    useEffect(() => {
        if (!currentSegment || isPaused) {
            resetTimer(); 
            return;
        }

        resetTimer(); 

        if (currentSegment.type === 'video' || currentSegment.type === 'ad_video') {
            
             if (videoRef.current) {
                videoRef.current.load(); 
                videoRef.current.play().catch(e => console.error("Error auto-playing new video segment:", e));
            }
        } else {
            
            const duration = calculateDuration(currentSegment);
            startTimer(duration);
        }

        return () => resetTimer(); 
    }, [currentSegment, isPaused, resetTimer, startTimer, calculateDuration]);


  if (!currentUserStory || !currentSegment) {
    
    
    if (safeStories.length > 0) onClose(); 
    return null;
  }

  
  const displayUser = isCurrentSegmentAd ? currentSegment.advertiser : currentUserStory.user;

  const handleStoryShare = async () => {
    if (typeof window === 'undefined' || !currentSegment) return;

    let shareText = `Check out this story from ${displayUser.username} on AKmax!`;
    let shareUrl = `${window.location.origin}/story/${currentUserStory.user.id}/${currentSegment.id}`; // Example URL structure

    if (isCurrentSegmentAd) {
        shareText = (currentSegment as AdStorySegment).headline || `Check out this ad from ${displayUser.username}!`;
        shareUrl = (currentSegment as AdStorySegment).ctaLink;
    }

    const shareData = {
        title: `Story by ${displayUser.username}`,
        text: shareText,
        url: shareUrl,
    };

    try {
        if (typeof navigator !== 'undefined' && navigator.share && window.isSecureContext) {
            await navigator.share(shareData);
            toast({ title: "Story Shared!" });
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(shareData.url);
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
                try { await navigator.clipboard.writeText(shareData.url); toast({ title: "Link Copied!", description: "Sharing failed, but link copied." }); }
                catch (copyError) { toast({ variant: "destructive", title: "Copy Failed" }); }
            }
         } else if (error.name === 'AbortError') {
             toast({ variant: "destructive", title: "Sharing Cancelled" });
         } else {
             toast({ variant: "destructive", title: "Sharing Failed" });
         }
    }
  };


  return (
    
    <div key={`${currentUserIndex}-${currentSegmentIndex}`} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-sm" onClick={togglePause} >
       
       <div className="relative w-full h-full max-w-md max-h-[95svh] aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()} >

          {/* Progress Bars */}
          <div className="absolute top-2 left-2 right-2 z-20 flex gap-1 px-1">
            {currentUserStory.segments.map((_, index) => (
              <div key={`${currentUserStory.user.id}-segment-progress-${index}`} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${index === currentSegmentIndex ? progress : (index < currentSegmentIndex ? 100 : 0)}%` }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-5 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 
                 {isCurrentSegmentAd ? (
                    
                    <a href={(currentSegment as AdStorySegment).ctaLink} target="_blank" rel="noopener noreferrer" onClick={(e)=> e.stopPropagation()} aria-label={`View ${displayUser.username}'s page`}>
                        <Avatar className="h-8 w-8 border-2 border-white/50">
                            <AvatarImage src={displayUser.avatarUrl} alt={displayUser.username} data-ai-hint="advertiser logo"/>
                            <AvatarFallback>{displayUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </a>
                 ) : (
                     <Link href={`/profile/${displayUser.username}`} onClick={(e)=> e.stopPropagation()} aria-label={`View ${displayUser.username}'s profile`}>
                        <Avatar className="h-8 w-8 border-2 border-white/50">
                            <AvatarImage src={displayUser.avatarUrl} alt={displayUser.username} data-ai-hint="user avatar"/>
                            <AvatarFallback>{displayUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                     </Link>
                 )}
                <div className="text-white text-sm">
                     {isCurrentSegmentAd ? (
                        <a href={(currentSegment as AdStorySegment).ctaLink} target="_blank" rel="noopener noreferrer" onClick={(e)=> e.stopPropagation()}>
                             <span className="font-semibold hover:underline">{displayUser.username}</span>
                         </a>
                     ) : (
                        <Link href={`/profile/${displayUser.username}`} onClick={(e)=> e.stopPropagation()}>
                            <span className="font-semibold hover:underline">{displayUser.username}</span>
                        </Link>
                     )}
                    {isCurrentSegmentAd ? (
                        <SponsoredLabel className="ml-2 !text-white/80 !text-xs" />
                    ) : (
                        <span className="ml-2 text-xs opacity-80">
                            {formatDistanceToNowStrict(new Date(currentSegment.timestamp), { addSuffix: true })}
                        </span>
                    )}
                </div>
              </div>
             {/* Controls: Pause/Play & Close */}
              <div className="flex items-center gap-1">
                 <button onClick={(e) => { e.stopPropagation(); togglePause(); }} className="text-white/80 p-1 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full" aria-label={isPaused ? 'Play Story' : 'Pause Story'}>
                   {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                 <Button variant="ghost" size="icon" className="text-white hover:bg-black/50 h-8 w-8 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full" onClick={(e) => {e.stopPropagation(); onClose();}} aria-label="Close stories">
                   <X className="h-5 w-5" />
                 </Button>
              </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 z-10 flex items-center justify-center" >
            {isCurrentSegmentAd ? (
              <AdPlaceholder segment={currentSegment as AdStorySegment} />
            ) : (currentSegment.type === 'image') ? (
              <Image
                src={currentSegment.mediaUrl}
                alt="Story segment"
                fill
                style={{ objectFit: 'cover' }}
                priority={currentSegmentIndex === 0} 
                data-ai-hint="story content image"
              />
            ) : (currentSegment.type === 'video') ? (
              <video
                 ref={videoRef}
                 key={currentSegment.mediaUrl} 
                 className="w-full h-full object-cover"
                 playsInline 
                 muted 
                 onLoadedData={handleVideoLoadedData}
                 onTimeUpdate={handleVideoTimeUpdate}
                 onEnded={handleVideoEnded}
                 preload="auto"
              >
                 <source src={currentSegment.mediaUrl} type="video/mp4" /> 
                 Your browser does not support the video tag.
              </video>
            ) : null}
          </div>

          {/* Navigation Areas */}
           <div className="absolute inset-y-0 left-0 w-1/3 z-30 cursor-pointer" onClick={(e) => { e.stopPropagation(); prevSegment(); }} aria-label="Previous story segment" />
           <div className="absolute inset-y-0 right-0 w-1/3 z-30 cursor-pointer" onClick={(e) => { e.stopPropagation(); nextSegment(); }} aria-label="Next story segment"/>


          {/* Footer - Reply Input or Ad CTA */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {isCurrentSegmentAd ? (
                    <AdCtaButton 
                        ctaText={(currentSegment as AdStorySegment).ctaText}
                        ctaLink={(currentSegment as AdStorySegment).ctaLink}
                        className="w-full bg-white/90 text-black font-semibold hover:bg-white"
                        size="lg"
                        icon="external"
                    />

              ) : (
                  <>
                    
                    <Input placeholder="Send message..." className="bg-black/30 border-white/30 text-white placeholder:text-gray-300 h-9 text-sm flex-1 focus:ring-white/50" aria-label="Send message" />
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80 focus:outline-none" aria-label="React with heart"> <Heart className="h-6 w-6" /></Button>
                    <Button variant="ghost" size="icon" className="text-white hover:text-white/80 focus:outline-none" onClick={handleStoryShare} aria-label="Share Story"> <ShareIcon className="h-6 w-6" /></Button>
                  </>
              )}
          </div>
       </div>
    </div>
  );
};

export default StoryViewer;
