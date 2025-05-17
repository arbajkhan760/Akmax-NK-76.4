
export interface ReelUser {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface ReelAudio {
  title: string;
  artist?: string;
  isOriginal: boolean;
  url?: string; // Optional URL to the audio source
}

// Base interface for items in the Reels feed
interface BaseReelItem {
    id: string;
    type: 'organic' | 'ad';
}

// Interface for regular user-generated Reels
export interface OrganicReel extends BaseReelItem {
  type: 'organic';
  videoUrl: string; // URL to the actual video file
  thumbnailUrl?: string; // Optional: URL for a preview image
  user: ReelUser;
  description?: string;
  likes: number;
  comments: number;
  shares: number;
  audio: ReelAudio;
  tags?: string[];
}

// Interface for Advertisements in the Reels feed
export interface AdReel extends BaseReelItem {
   type: 'ad';
   videoUrl: string; // URL to the ad video file
   thumbnailUrl?: string; // Optional preview image
   advertiser: ReelUser; // Info about the advertiser
   headline?: string; // Optional: Main ad text/caption
   ctaText: string; // e.g., "Install Now", "Shop Now", "Learn More", "Watch More"
   ctaLink: string; // The destination URL for the CTA
   duration?: number; // Video duration (up to 60s recommended)
   // Ad interactions might be tracked differently, but include for potential UI display
   likes?: number; // Optional: Ad metrics if available/relevant for UI (e.g., display if > threshold)
   comments?: number; // Optional: Ad metrics
   shares?: number; // Optional: Ad metrics
   audio?: ReelAudio; // Ads might use specific or licensed audio, or be muted
   // Add other ad-specific fields: tracking pixels, campaign ID etc.
}

// Union type for any item appearing in the Reels feed
export type ReelFeedItem = OrganicReel | AdReel;

// Type guard to check if a feed item is an Ad
export function isAdReel(item: ReelFeedItem): item is AdReel {
  return item.type === 'ad';
}
