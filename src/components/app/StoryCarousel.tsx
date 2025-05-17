
'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from 'lucide-react';
import StoryViewer from './StoryViewer'; // Import the StoryViewer
import type { UserStory, StoryUser, AdStorySegment, ContentStorySegment } from '@/types/story'; // Import the detailed story type

// Mock data for stories using the new structure, including Ad Segments
const mockUserStories: UserStory[] = [
  {
    user: { id: 'alex_doe', username: 'alex_doe', avatarUrl: 'https://picsum.photos/id/101/50' },
    segments: [
      { id: 's1a', type: 'image', mediaUrl: 'https://picsum.photos/seed/alex_story1/1080/1920', duration: 5, timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
      // Example Ad Segment (Image)
      {
          id: 's1ad1',
          type: 'ad_image',
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          advertiser: { id: 'brand_a', username: 'CoolBrandA', avatarUrl: 'https://picsum.photos/seed/brand_a/40' },
          mediaUrl: 'https://picsum.photos/seed/ad_story_1/1080/1920',
          headline: 'Get 20% Off Today!',
          ctaText: 'Shop Now',
          ctaLink: 'https://example-advertiser.com/sale',
          duration: 10, // 10 seconds display time
      } as AdStorySegment,
      { id: 's1b', type: 'image', mediaUrl: 'https://picsum.photos/seed/alex_story2/1080/1920', duration: 5, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    ],
    hasNewStory: true,
    lastUpdatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
   {
    user: { id: 'sarah_j', username: 'sarah_j', avatarUrl: 'https://picsum.photos/id/102/50' },
    segments: [
      { id: 's2a', type: 'image', mediaUrl: 'https://picsum.photos/seed/sarah_story1/1080/1920', duration: 7, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ],
    hasNewStory: true,
    lastUpdatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    user: { id: 'mike_ross', username: 'mike_ross', avatarUrl: 'https://picsum.photos/id/103/50' },
    segments: [
        { id: 's3a', type: 'image', mediaUrl: 'https://picsum.photos/seed/mike_story1/1080/1920', duration: 5, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
         // Example Ad Segment (Video)
         {
            id: 's3ad1',
            type: 'ad_video',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            advertiser: { id: 'brand_b', username: 'TechGadgets', avatarUrl: 'https://picsum.photos/seed/brand_b/40' },
            mediaUrl: 'https://example.com/ad_video_story.mp4', // Placeholder video URL
            headline: 'The Future is Here!',
            ctaText: 'Learn More',
            ctaLink: 'https://example-tech.com/new-gadget',
            // Duration will be determined by video length or capped at 15s
         } as AdStorySegment,
    ],
    hasNewStory: false,
    lastUpdatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Use ad timestamp if it's latest
   },
    {
    user: { id: 'coder_cat', username: 'coder_cat', avatarUrl: 'https://picsum.photos/id/104/50' },
    segments: [
      { id: 's4a', type: 'image', mediaUrl: 'https://picsum.photos/seed/coder_story1/1080/1920', duration: 5, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: 's4b', type: 'image', mediaUrl: 'https://picsum.photos/seed/coder_story2/1080/1920', duration: 5, timestamp: new Date(Date.now() - 59 * 60 * 1000).toISOString() },
      { id: 's4c', type: 'image', mediaUrl: 'https://picsum.photos/seed/coder_story3/1080/1920', duration: 5, timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString() },
    ],
    hasNewStory: true,
    lastUpdatedAt: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
  },
  // Add more mock stories as needed
];

// Mock current user's data (assuming they have no story yet)
const mockCurrentUser: StoryUser = {
    id: 'current_user',
    username: 'Your Story',
    avatarUrl: 'https://picsum.photos/seed/myavatar/50' // Replace with actual avatar if available
};


const StoryCarousel: FC = () => {
  const router = useRouter(); // Initialize router
  const [stories, setStories] = useState<UserStory[]>(mockUserStories); // Use the detailed type
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
    // Mark story as read (update state - in real app, update backend)
    // This is simplified - need proper logic to mark only unseen segments as read
    const updatedStories = stories.map((story, i) =>
      i === index ? { ...story, hasNewStory: false } : story
    );
    setStories(updatedStories);
     // TODO: Mark story as viewed in backend/state management
  };

  const handleMyStoryClick = () => {
      router.push('/camera'); // Navigate to camera page to create a story
  }

   // Sort stories: New stories first, then by last update time (most recent first)
   const sortedStories = [...stories].sort((a, b) => {
    if (a.hasNewStory && !b.hasNewStory) return -1;
    if (!a.hasNewStory && b.hasNewStory) return 1;
    return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
  });

  return (
    <>
      <ScrollArea className="w-full whitespace-nowrap border-b py-3 bg-background">
        <div className="flex w-max space-x-4 px-4">
          {/* Current User Story Placeholder */}
          <div
            key="my-story"
            className="flex flex-col items-center gap-1.5 cursor-pointer w-16 flex-shrink-0"
            onClick={handleMyStoryClick}
            role="button"
            tabIndex={0}
            aria-label="Add to your story"
          >
            <Avatar className="h-14 w-14 border-2 border-dashed border-muted-foreground p-0.5 relative">
               <AvatarImage src={mockCurrentUser.avatarUrl} alt={mockCurrentUser.username} className="rounded-full" data-ai-hint="user avatar"/>
               <AvatarFallback className="text-xl bg-muted rounded-full">
                {mockCurrentUser.username?.charAt(0).toUpperCase() || '+'}
               </AvatarFallback>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-0.5 leading-none border-2 border-background">
                 <Plus className="h-2.5 w-2.5" />
              </div>
            </Avatar>
            <span className="text-xs font-medium text-center truncate w-full">{mockCurrentUser.username}</span>
          </div>

          {/* Friend Stories */}
          {sortedStories.map((storyData, index) => (
            <div
              key={storyData.user.id}
              className="flex flex-col items-center gap-1.5 cursor-pointer w-16 flex-shrink-0"
              // Adjust index based on current sorting if needed, or pass user ID
              onClick={() => handleStoryClick(stories.findIndex(s => s.user.id === storyData.user.id))}
              role="button"
              tabIndex={0}
              aria-label={`View ${storyData.user.username}'s story`}
            >
              <Avatar className={`h-14 w-14 border-2 ${storyData.hasNewStory ? 'border-pink-500' : 'border-muted-foreground/30'} p-0.5`}>
                <AvatarImage src={storyData.user.avatarUrl} alt={storyData.user.username} className="rounded-full" data-ai-hint="friend avatar"/>
                <AvatarFallback className="text-xl bg-muted rounded-full">
                  {storyData.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-center truncate w-full">{storyData.user.username}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {showStoryViewer && (
        <StoryViewer
          stories={stories} // Pass original unsorted (or sorted if preferred for viewer order)
          startIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </>
  );
};

export default StoryCarousel;
