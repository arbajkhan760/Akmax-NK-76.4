
import ReelCard from '@/components/app/ReelCard';
import type { ReelFeedItem, OrganicReel, AdReel } from '@/types/reel'; // Import types

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock data generation for Reels feed, including Ads with random intervals
const generateMockReelFeed = (count: number): ReelFeedItem[] => {
  const feed: ReelFeedItem[] = [];
  let organicReelsSinceLastAd = 0;
  let nextAdThreshold = getRandomInt(2, 5); // Show ad after 2, 3, 4, or 5 organic reels

  for (let i = 0; i < count; i++) {
    // Condition to insert an ad:
    // - Not the very first item (feed.length > 0)
    // - Enough organic reels have passed since the last ad
    if (feed.length > 0 && organicReelsSinceLastAd >= nextAdThreshold) {
       const ad: AdReel = {
            id: `ad-reel-${i}`, // Use loop index for unique ad ID
            type: 'ad',
            videoUrl: `https://example.com/ad_video_reel_${i}.mp4`,
            thumbnailUrl: `https://picsum.photos/seed/adreel${i}/400/700`,
            advertiser: {
                id: `advertiser_${i}`,
                username: `AwesomeBrand${String.fromCharCode(65 + (i % 5))}`,
                avatarUrl: `https://picsum.photos/seed/brand${i}/50`,
            },
            headline: `Level up your style! ✨ Check out our new collection ${i}.`,
            ctaText: i % 2 === 0 ? "Shop Now" : "Learn More",
            ctaLink: `https://example-awesome-brand.com/shop?ad_id=${i}`,
            duration: 45 + (i % 15),
            audio: { title: "Upbeat Commercial Track", isOriginal: false },
            likes: Math.floor(Math.random() * 100),
            comments: Math.floor(Math.random() * 20),
            shares: Math.floor(Math.random() * 10),
       };
       feed.push(ad);
       organicReelsSinceLastAd = 0; // Reset counter
       nextAdThreshold = getRandomInt(2, 5); // Set new random threshold
    } else {
      // Organic Reel
       const organic: OrganicReel = {
          id: `reel-${i + 1}`,
          type: 'organic',
          videoUrl: `https://example.com/reel${i + 1}.mp4`,
          thumbnailUrl: `https://picsum.photos/seed/reel${i + 1}/400/700`,
          user: {
            id: `user_reel_${i + 1}`,
            username: `creator_${i + 1}`,
            avatarUrl: `https://picsum.photos/id/${50 + i}/50`,
          },
          description: `Amazing reel content #${i + 1}! Watch till the end! 🔥 #shorts #reels #akmax`,
          likes: Math.floor(Math.random() * 5000),
          comments: Math.floor(Math.random() * 500),
          shares: Math.floor(Math.random() * 100),
          audio: {
            title: i % 3 === 0 ? `Trending Sound ${i}` : `Original Audio - creator_${i + 1}`,
            isOriginal: i % 3 !== 0,
            artist: i % 3 === 0 ? `Popular Artist ${i % 2}` : undefined,
          },
          tags: [['viral', 'funny', 'tutorial', 'dance', 'travel'][i % 5] || 'cool'],
       };
       feed.push(organic);
       organicReelsSinceLastAd++;
    }
  }
  return feed;
};

const mockReelFeed = generateMockReelFeed(15); // Generate 15 items (including ads with random frequency)

export default function ReelsPage() {
  // This page displays a feed of short vertical videos (Reels) and Ads.
  // Uses a full-screen, vertical scrolling container.
  return (
    <div className="h-screen w-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hide bg-black">
       {/* Feed scrolls vertically, each ReelCard takes full screen height */}
      {mockReelFeed.map((item) => (
          <ReelCard key={item.id} item={item} /> // Pass the whole item (OrganicReel or AdReel)
      ))}
      {/* Add loading indicator or end message if needed */}
      <div className="h-screen snap-start flex items-center justify-center text-muted-foreground bg-gradient-to-b from-black to-gray-900">End of reels for now!</div>
    </div>
  );
}

