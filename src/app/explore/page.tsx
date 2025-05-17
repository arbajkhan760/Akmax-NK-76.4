// src/app/explore/page.tsx
import { Compass, Image as ImageIcon, Clapperboard, User, Hash } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

// Mock data for trending content
const mockTrendingPosts = Array.from({ length: 12 }).map((_, i) => ({
  id: `trend-post-${i}`,
  type: i % 3 === 0 ? 'video' : 'image',
  thumbnailUrl: `https://picsum.photos/seed/explore${i}/300/300`,
  title: `Trending Content ${i + 1}`,
  user: `user${i+50}`
}));

const mockTrendingTags = ["#summerVibes", "#techInnovation", "#foodGoals", "#travelDiaries", "#fashionForward", "#fitnessJourney"];
const mockSuggestedUsers = Array.from({ length: 4 }).map((_,i) => ({
    id: `suggested_user_${i}`,
    username: `cool_creator_${i}`,
    avatarUrl: `https://picsum.photos/seed/suggested${i}/80`,
    bio: `Creating amazing content about topic ${i+1}`
}));


export default function ExplorePage() {
  return (
    <div className="container mx-auto max-w-5xl py-6 px-2 sm:px-4">
      <div className="flex items-center gap-2 mb-6">
        <Compass className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
      </div>

      {/* Search Bar Placeholder (actual search logic on /search page) */}
      <div className="mb-6">
        <Link href="/search">
            <Button variant="outline" className="w-full text-left text-muted-foreground justify-start">
                <ImageIcon className="mr-2 h-4 w-4"/> Search posts, users, tags...
            </Button>
        </Link>
      </div>

      {/* Sections: For You, Trending Tags, Suggested Users etc. */}
      <div className="space-y-8">
        {/* For You / Trending Posts */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Trending Now</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1 sm:gap-2">
            {mockTrendingPosts.map(post => (
              <Link href={`/post/${post.id}`} key={post.id}> {/* TODO: Change to actual post/reel page */}
                <div className="relative aspect-square bg-muted rounded-md overflow-hidden group cursor-pointer">
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 200px"
                    className="transition-transform group-hover:scale-105"
                    data-ai-hint="trending content media"
                  />
                  {post.type === 'video' && (
                    <Clapperboard className="absolute bottom-1 right-1 h-4 w-4 text-white drop-shadow-md" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-white text-xs font-medium line-clamp-2">{post.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Tags */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Popular Tags</h2>
          <div className="flex flex-wrap gap-2">
            {mockTrendingTags.map(tag => (
              <Link href={`/tags/${encodeURIComponent(tag.substring(1))}`} key={tag}>
                <Button variant="secondary" size="sm" className="h-auto py-1 px-3">
                  <Hash className="h-3 w-3 mr-1" /> {tag.substring(1)}
                </Button>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Suggested Users */}
        <section>
            <h2 className="text-xl font-semibold mb-3">Discover Creators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockSuggestedUsers.map(user => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                            <Link href={`/profile/${user.username}`}>
                                <Image src={user.avatarUrl} alt={user.username} width={48} height={48} className="rounded-full" data-ai-hint="creator avatar"/>
                            </Link>
                            <div className="flex-1">
                                <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">{user.username}</Link>
                                <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>
                            </div>
                            <Button size="sm" variant="outline">Follow</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* TODO: Add other sections like Reels, Videos, Locations etc. */}

      </div>
    </div>
  );
}
