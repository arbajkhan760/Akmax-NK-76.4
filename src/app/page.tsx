import React from 'react'; // Added React import for Fragment
import PostCard from '@/components/app/PostCard';
import StoryCarousel from '@/components/app/StoryCarousel';

// Mock data for standard posts (images/videos) for the Home feed.
const mockPosts = Array.from({ length: 10 }).map((_, i) => ({
  id: `post-${i + 1}`,
  type: i % 3 === 0 ? 'video' : 'image' as 'image' | 'video', 
  mediaUrl: i % 3 === 0 ? `https://example.com/video${i + 1}.mp4` : `https://picsum.photos/seed/post${i + 1}/600`,
  thumbnailUrl: i % 3 === 0 ? `https://picsum.photos/seed/post${i + 1}/600` : undefined,
  user: {
    username: `user_${i + 1}`,
    avatarUrl: `https://picsum.photos/id/${20 + i}/50`,
  },
  caption: `This is standard post number ${i + 1}. Enjoy! #samplepost #akgroup`,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 50),
}));

const AdPlaceholderFeed: React.FC = () => (
  <div className="w-full h-60 flex flex-col items-center justify-center border rounded-lg my-4 bg-muted/30 text-muted-foreground shadow-sm">
    <p className="font-semibold text-lg">Ad Placeholder</p>
    <p className="text-sm">Google AdMob - Feed Ad</p>
  </div>
);

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <StoryCarousel />
      <div className="w-full max-w-xl mx-auto space-y-6 py-4 sm:py-6">
        {mockPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            <PostCard post={post} />
            {/* Insert ad placeholder after every 3 posts (index 2, 5, 8...) */}
            {(index + 1) % 3 === 0 && <AdPlaceholderFeed />}
          </React.Fragment>
        ))}
        <div className="text-center text-muted-foreground py-4">Loading more posts...</div>
      </div>
    </div>
  );
}
