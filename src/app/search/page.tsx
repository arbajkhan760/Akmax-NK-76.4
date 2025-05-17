
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import PostCard from '@/components/app/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, User, Hash, Image as ImageIcon, Video, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

// --- TODO: Replace Mocks with API calls ---

interface UserResult {
  id: string;
  username: string;
  avatarUrl: string;
  fullName?: string;
  bio?: string;
  isVerified?: boolean;
}

interface TagResult {
  name: string;
  postCount: number;
}

interface PostResult {
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
}

const mockUsers: UserResult[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `user-search-${i + 1}`,
  username: `found_user_${i + 1}`,
  avatarUrl: `https://picsum.photos/id/${60 + i}/100`,
  fullName: `Found User ${i + 1}`,
  bio: `This is the bio of found_user_${i + 1}.`,
  isVerified: i % 2 === 0,
}));

const mockTags: TagResult[] = Array.from({ length: 8 }).map((_, i) => ({
  name: `searched_tag_${i + 1}`,
  postCount: Math.floor(Math.random() * 1000) + 50,
}));

const mockPosts: PostResult[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `search-post-${i + 1}`,
  type: i % 3 === 0 ? 'video' : 'image',
  mediaUrl: i % 3 === 0 ? `https://example.com/search_video${i + 1}.mp4` : `https://picsum.photos/seed/searchpost${i + 1}/600`,
  thumbnailUrl: i % 3 === 0 ? `https://picsum.photos/seed/searchpost${i + 1}/600` : undefined,
  user: {
    username: `poster_${i + 1}`,
    avatarUrl: `https://picsum.photos/id/${70 + i}/50`,
  },
  caption: `Search result post number ${i + 1}. #foundit`,
  likes: Math.floor(Math.random() * 200),
  comments: Math.floor(Math.random() * 30),
  shares: Math.floor(Math.random() * 10),
}));


const fetchSearchResults = async (query: string, type?: string | null) => {
  console.log(`Searching for: "${query}" with type: ${type}`);
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

  // Filter mock data based on query (simple substring match)
  const lowerQuery = query.toLowerCase();
  let users = mockUsers.filter(u => u.username.toLowerCase().includes(lowerQuery) || u.fullName?.toLowerCase().includes(lowerQuery));
  let tags = mockTags.filter(t => t.name.toLowerCase().includes(lowerQuery));
  let posts = mockPosts.filter(p => p.caption?.toLowerCase().includes(lowerQuery) || p.user.username.toLowerCase().includes(lowerQuery));

  if (type === 'people') return { users, tags: [], posts: [] };
  if (type === 'tags') return { users: [], tags, posts: [] };
  if (type === 'posts') return { users: [], tags: [], posts }; // Could further filter by image/video if needed

  return { users, tags, posts }; // Default 'all'
};


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type'); // e.g., 'people', 'tags'

  const [searchQuery, setSearchQuery] = useState(query);
  const [activeTab, setActiveTab] = useState(type || 'all');
  const [results, setResults] = useState<{ users: UserResult[]; tags: TagResult[]; posts: PostResult[] }>({ users: [], tags: [], posts: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSearchQuery(query); // Sync input with URL query
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults({ users: [], tags: [], posts: [] });
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const data = await fetchSearchResults(searchQuery, activeTab === 'all' ? null : activeTab);
      setResults(data);
      setIsLoading(false);
    };
    performSearch();
  }, [searchQuery, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update URL to reflect new search term, keeps current tab
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('q', searchQuery);
    if (activeTab !== 'all') newParams.set('type', activeTab); else newParams.delete('type');
    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    // useEffect will pick up change in searchQuery and re-fetch
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AKmax..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg h-12"
          />
        </div>
      </form>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="people"><Users className="h-4 w-4 mr-1 sm:mr-2 inline-block" /> People</TabsTrigger>
          <TabsTrigger value="tags"><Hash className="h-4 w-4 mr-1 sm:mr-2 inline-block" />Tags</TabsTrigger>
          <TabsTrigger value="posts" className="hidden sm:inline-flex"><ImageIcon className="h-4 w-4 mr-1 sm:mr-2 inline-block" /> Posts</TabsTrigger>
          <TabsTrigger value="videos" className="hidden sm:inline-flex"><Video className="h-4 w-4 mr-1 sm:mr-2 inline-block" /> Videos</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {results.users.length === 0 && results.tags.length === 0 && results.posts.length === 0 && !isLoading && searchQuery ? (
                <p className="text-center text-muted-foreground py-10">No results found for "{searchQuery}".</p>
              ) : null}

              {results.users.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">People</h2>
                  <div className="space-y-3">
                    {results.users.map(user => <UserCard key={user.id} user={user} />)}
                  </div>
                </section>
              )}
              {results.tags.length > 0 && (
                 <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {results.tags.map(tag => <TagBadge key={tag.name} tag={tag} />)}
                  </div>
                </section>
              )}
              {results.posts.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-3">Posts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.posts.map(post => <PostCard key={post.id} post={post} />)}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="people">
              {results.users.length > 0 ? (
                <div className="space-y-3">
                  {results.users.map(user => <UserCard key={user.id} user={user} />)}
                </div>
              ) : <p className="text-center text-muted-foreground py-10">No people found for "{searchQuery}".</p>}
            </TabsContent>

            <TabsContent value="tags">
              {results.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {results.tags.map(tag => <TagBadge key={tag.name} tag={tag} />)}
                </div>
              ) : <p className="text-center text-muted-foreground py-10">No tags found for "{searchQuery}".</p>}
            </TabsContent>
            
            <TabsContent value="posts">
              {results.posts.filter(p=>p.type === 'image').length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.posts.filter(p=>p.type === 'image').map(post => <PostCard key={post.id} post={post} />)}
                </div>
              ) : <p className="text-center text-muted-foreground py-10">No image posts found for "{searchQuery}".</p>}
            </TabsContent>

             <TabsContent value="videos">
              {results.posts.filter(p=>p.type === 'video').length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.posts.filter(p=>p.type === 'video').map(post => <PostCard key={post.id} post={post} />)}
                </div>
              ) : <p className="text-center text-muted-foreground py-10">No videos found for "{searchQuery}".</p>}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}


const UserCard: React.FC<{ user: UserResult }> = ({ user }) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatarUrl} alt={user.username} data-ai-hint="profile avatar" />
        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">{user.username}</Link>
        {user.fullName && <p className="text-sm text-muted-foreground">{user.fullName}</p>}
        {user.bio && <p className="text-xs text-muted-foreground line-clamp-1">{user.bio}</p>}
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href={`/profile/${user.username}`}>View Profile</Link>
      </Button>
    </CardContent>
  </Card>
);

const TagBadge: React.FC<{ tag: TagResult }> = ({ tag }) => (
  <Link href={`/tags/${encodeURIComponent(tag.name)}`}>
    <Button variant="secondary" className="h-auto py-1 px-3">
      <Hash className="h-3 w-3 mr-1" />
      <span className="font-medium">{tag.name}</span>
      <span className="ml-1.5 text-xs text-muted-foreground">({tag.postCount})</span>
    </Button>
  </Link>
);
