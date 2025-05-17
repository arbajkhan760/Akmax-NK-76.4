/**
 * Represents an available advertising plan.
 */
export interface AdPlan {
  id: string; // e.g., 'onetime', 'daily', 'weekly', 'monthly', 'premium_monthly', 'yearly', 'premium_yearly'
  name: string; // e.g., 'One-Time Ad', 'Daily Plan'
  description: string;
  price: number; // Price in INR
  durationDays: number; // Validity duration in days
  adsAllowed: number | null; // Max number of ads allowed (null for unlimited)
  isPremium?: boolean; // Flag for premium plans
  features: string[]; // List of included features/benefits
}

/**
 * Represents the advertising status of a user.
 */
export interface UserAdStatus {
  userId: string;
  activePlanId: string | null; // ID of the currently active plan, or null if none
  planName?: string; // Name of the active plan
  planExpiryDate: string | null; // ISO Date string when the current plan expires, or null
  adsRemaining: number | null; // Ads remaining in the current cycle (null for unlimited or inactive)
  isVerified: boolean; // Indicates if the user's payment/UTR was verified for the current plan
}

/**
 * Represents the result of submitting a UTR code for verification.
 */
export interface UtrVerificationResult {
  success: boolean;
  expiryDate?: string | null; // Expiry date if activation is successful
  adsRemaining?: number | null; // Ads remaining if activation is successful
  error?: string; // Error message if activation fails
}

// --- TODO: Define Ad Creative and Campaign types ---

export type AdFormat = 'image' | 'video' | 'carousel' | 'story_image' | 'story_video' | 'reels_video';
export type AdPlacement = 'feed' | 'stories' | 'reels' | 'explore';
export type AdCTA = 'shop_now' | 'learn_more' | 'download' | 'contact_us' | 'watch_more' | 'install_now'; // Expanded CTAs

export interface AdTargeting {
    ageRange?: [number, number];
    genders?: ('male' | 'female' | 'other')[];
    locations?: string[]; // e.g., ['city:Mumbai', 'country:India']
    interests?: string[]; // e.g., ['technology', 'fashion']
    behaviors?: string[]; // e.g., ['online_shoppers']
    customAudiences?: string[]; // IDs of custom audiences
}

export interface AdCreative {
    id: string;
    format: AdFormat;
    mediaUrl: string; // URL for image/video
    carouselItems?: { mediaUrl: string, headline?: string, link: string }[]; // For carousel
    headline?: string;
    primaryText?: string;
    description?: string;
    cta: AdCTA;
    destinationUrl: string;
}

export interface AdCampaign {
    id: string;
    userId: string; // User who created the campaign
    name: string;
    status: 'active' | 'paused' | 'pending_verification' | 'rejected' | 'completed' | 'draft';
    objective: string; // e.g., 'reach', 'traffic', 'conversions'
    planId: string; // Associated AdPlan ID
    startDate: string; // ISO Date
    endDate?: string | null; // ISO Date or null for ongoing
    budget?: number; // Optional: lifetime or daily budget limit
    creatives: AdCreative[];
    targeting: AdTargeting;
    placements: AdPlacement[];
    createdAt: string;
    updatedAt: string;
    // Analytics summary can be added here or fetched separately
    analytics?: AdAnalyticsSummary;
}

export interface AdAnalyticsSummary {
    impressions: number;
    reach: number;
    clicks: number;
    ctr: number; // Click-Through Rate (%)
    conversions?: number; // Optional
    engagement?: number; // Likes, comments, shares
    spend?: number; // Optional amount spent
}
