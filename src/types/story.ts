
export interface StoryUser {
  id: string;
  username: string;
  avatarUrl: string;
}

// Base segment interface
interface BaseStorySegment {
  id: string;
  type: 'image' | 'video' | 'ad_image' | 'ad_video' | 'ad_carousel'; // Add ad types
  timestamp: string; // ISO Date string when the segment was created
}

// Interface for regular user content segments
export interface ContentStorySegment extends BaseStorySegment {
  type: 'image' | 'video';
  mediaUrl: string; // URL for the image or video file
  duration?: number; // Duration in seconds (for videos or image display time), defaults applied in viewer
  link?: string; // Optional link associated with the story segment ("See More" type link)
  // Add other potential fields: text overlays, stickers, polls etc.
}

// Interface for Advertisements in stories
export interface AdStorySegment extends BaseStorySegment {
   type: 'ad_image' | 'ad_video' | 'ad_carousel';
   advertiser: StoryUser; // Info about the advertiser
   headline?: string; // Optional headline text for the ad
   mediaUrl: string; // Single media URL for image/video ads
   carouselItems?: { id: string, mediaUrl: string, link?: string }[]; // For carousel ads
   ctaText: string; // e.g., "Shop Now", "Learn More", "Download", "Swipe Up"
   ctaLink: string; // The destination URL for the CTA
   duration?: number; // Optional: Duration for video/image display (max 15s recommended). Defaults applied in viewer.
   // Add other ad-specific fields: tracking pixels, etc.
}

// Union type for any story segment
export type StorySegment = ContentStorySegment | AdStorySegment;

export interface UserStory {
  user: StoryUser; // The user who posted the story (for organic) or represents the user viewing ads
  segments: StorySegment[]; // Array of individual story parts (images/videos/ads)
  hasNewStory: boolean; // Flag for the carousel ring indication
  lastUpdatedAt: string; // ISO Date string of the latest segment's timestamp, for sorting
}

// Type guard to check if a segment is an Ad
export function isAdSegment(segment: StorySegment): segment is AdStorySegment {
  return segment.type === 'ad_image' || segment.type === 'ad_video' || segment.type === 'ad_carousel';
}
