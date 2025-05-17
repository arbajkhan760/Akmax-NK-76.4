
'use client';

import { useParams } from 'next/navigation';
import PostCard from '@/components/app/PostCard'; // Assuming PostCard can be reused
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Hash } from 'lucide-react';
import { useState, useEffect } from 'react'; // Added import for useState and useEffect

// --- TODO: Fetch Real Tag Data ---
// Replace this mock data fetching logic with a call to your backend API
// using the `tagName` from the route parameters.

interface Post {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  caption?: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[]; // Added tags to post data
}

// Generate mock posts, some containing the requested tag
const fetchPostsByTag = async (tagName: string): Promise<Post[]> => {
    console.log(`Fetching posts for tag: #${tagName}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate mock posts and filter by tag
    const allMockPosts = Array.from({ length: 15 }).map((_, i) => {
         // Add some tags, ensuring the requested tag appears in some posts
         const postTags = ['samplepost', 'akgroup'];
         if (i % 3 === 0) postTags.push('travel');
         if (i % 4 === 0) postTags.push('foodie');
         if (i % 5 === 0) postTags.push('tech');
         if (i % 2 === 0) postTags.push(tagName); // Add the requested tag to even posts

        return ({
            id: `post-tag-${tagName}-${i + 1}`,
            type: i % 3 === 1 ? 'video' : 'image' as 'image' | 'video',
            mediaUrl: i % 3 === 1 ? `https://example.com/video-tag-${i + 1}.mp4` : `https://picsum.photos/seed/${tagName}${i + 1}/600`,
            thumbnailUrl: i % 3 === 1 ? `https://picsum.photos/seed/${tagName}thumb${i + 1}/600` : undefined,
            user: {
                username: `user_${i + 1}`,
                avatarUrl: `https://picsum.photos/id/${30 + i}/50`,
            },
            caption: `Post featuring #${tagName} and other tags. (${i + 1})`,
            likes: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
            tags: postTags,
        });
    });

    // Filter posts that actually contain the tag (case-insensitive)
    return allMockPosts.filter(post =>
        post.tags?.map(t => t.toLowerCase()).includes(tagName.toLowerCase())
    );
};


export default function TagPage() {
  const params = useParams();
  // Decode the tag name from the URL parameter
  const tagName = params?.tagName ? decodeURIComponent(params.tagName as string) : null;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (tagName) {
      const loadPosts = async () => {
        setIsLoading(true);
        const data = await fetchPostsByTag(tagName);
        setPosts(data);
        setIsLoading(false);
      };
      loadPosts();
    } else {
      setIsLoading(false); // No tag name, stop loading
    }
  }, [tagName]);

  if (!tagName) {
     return <div className="text-center py-20 text-destructive">Invalid tag name.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
       <div className="flex items-center mb-6 gap-4">
           <Button variant="ghost" size="icon" asChild>
             <Link href="/"> {/* Or use router.back() if preferred */}
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
             </Link>
           </Button>
           <h1 className="text-3xl font-bold flex items-center">
             <Hash className="h-7 w-7 mr-1 text-primary"/>{tagName}
           </h1>
           {/* TODO: Add follow tag button */}
           <Button size="sm" className="ml-auto">Follow Tag</Button>
       </div>

       {isLoading ? (
         <div className="text-center py-20 text-muted-foreground">Loading posts for #{tagName}...</div>
       ) : posts.length > 0 ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
           {posts.map((post) => (
             // Ensure PostCard can handle these posts if they are different from home feed posts
             <PostCard key={post.id} post={post} />
           ))}
         </div>
       ) : (
         <div className="text-center py-20 text-muted-foreground">
           No posts found for #{tagName} yet.
         </div>
       )}

        {/* Placeholder for infinite scroll loading indicator */}
        {!isLoading && posts.length > 0 && (
            <div className="text-center text-muted-foreground py-8">Loading more...</div>
        )}
    </div>
  );
}
