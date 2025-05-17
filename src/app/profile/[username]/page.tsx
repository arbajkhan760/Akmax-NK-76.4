
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Clapperboard, User, Settings, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// HighlightCarousel might be tricky if it expects current_user context, disable or adapt
// import HighlightCarousel from '@/components/app/HighlightCarousel';

// MOCK: Function to fetch user profile data by username
// In a real app, this would be an API call.
const fetchUserProfileByUsername = async (username: string) => {
  console.log(`Fetching profile for username: ${username}`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

  // Mock data - find a user from a predefined list or return a generic one
  const mockUsers = [
    { id: 'alex_doe', username: "alex_doe", name: "Alex Doe", bio: "Exploring the world, one photo at a time.", avatarUrl: "https://picsum.photos/id/101/150", postsCount: 110, followersCount: "1.1K", followingCount: 120, isVerified: false },
    { id: 'sarah_j', username: "sarah_j", name: "Sarah Jones", bio: "Creative soul. Designer & Artist.", avatarUrl: "https://picsum.photos/id/102/150", postsCount: 250, followersCount: "2.5K", followingCount: 300, isVerified: true },
    { id: 'mike_ross', username: "mike_ross", name: "Mike Ross", bio: "Tech enthusiast and coffee lover.", avatarUrl: "https://picsum.photos/id/103/150", postsCount: 50, followersCount: "500", followingCount: 80, isVerified: false },
    { id: 'coder_cat', username: "coder_cat", name: "Coder Cat", bio: "Meowtivating an aspiring developer.", avatarUrl: "https://picsum.photos/id/104/150", postsCount: 75, followersCount: "800", followingCount: 90, isVerified: true },
    { id: 'design_guru', username: "design_guru", name: "Design Guru", bio: "Creating beautiful things.", avatarUrl: "https://picsum.photos/id/105/150", postsCount: 120, followersCount: "1.5K", followingCount: 150, isVerified: false },
    // Add current_user's data to ensure it can also be viewed via this dynamic page if needed
    // though /profile should handle it. But for consistency if linked as /profile/ak_group_76_official
     { id: 'ak_group_76_official', username: "ak_group_76_official", name: "AK Group 76", bio: "Official account for AK Group 76. Innovating the future.", avatarUrl: "https://picsum.photos/id/76/150", postsCount: 125, followersCount: "1.2M", followingCount: 150, isVerified: true },
     // Add mock users from chat list for linking from there
     { id: 'new_user_A', username: "new_user_A", name: "New User A", bio: "Just joined AK Reels!", avatarUrl: "https://picsum.photos/id/110/150", postsCount: 5, followersCount: "10", followingCount: 2, isVerified: false },
     { id: 'another_person_B', username: "another_person_B", name: "Another Person B", bio: "Exploring new connections.", avatarUrl: "https://picsum.photos/id/111/150", postsCount: 12, followersCount: "50", followingCount: 25, isVerified: false },
     { id: 'stranger_C', username: "stranger_C", name: "Stranger C", bio: "Mysterious user.", avatarUrl: "https://picsum.photos/id/112/150", postsCount: 1, followersCount: "5", followingCount: 1, isVerified: false },

  ];

  const foundUser = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (foundUser) return foundUser;

  // Fallback generic user if not found in mock list
  return {
    id: username, // use passed username as ID
    username: username,
    name: username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Generate name
    bio: `This is the profile of ${username}. Welcome to AK Reels!`,
    avatarUrl: `https://picsum.photos/seed/${username}/150`, // Seeded avatar
    postsCount: Math.floor(Math.random() * 200),
    followersCount: `${(Math.random() * 5).toFixed(1)}K`,
    followingCount: Math.floor(Math.random() * 500),
    isVerified: Math.random() > 0.7,
  };
};

// Mock posts for the viewed user
const generateUserPosts = (username: string) => Array.from({ length: 9 }).map((_, i) => ({
  id: `post-${username}-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/${username}-post${i + 1}/300`,
  type: i % 4 === 0 ? 'reel' : 'image',
}));


interface UserProfilePageProps {
  params: { username: string };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = params;
  const userProfile = await fetchUserProfileByUsername(username);
  const userPosts = generateUserPosts(username); // Generate posts for this user

  if (!userProfile) {
    // Handle user not found, though mock fetch always returns something
    return <div className="container mx-auto max-w-4xl py-6 text-center">User not found.</div>;
  }

  // TODO: Check if this profile is the current logged-in user.
  // For now, assume it's always viewing *another* user.
  const MOCK_LOGGED_IN_USERNAME = "ak_group_76_official"; // Example
  const isCurrentUserProfile = userProfile.username === MOCK_LOGGED_IN_USERNAME;

  return (
    <div className="container mx-auto max-w-4xl py-6 px-0 sm:px-4">
       <Button variant="outline" size="sm" asChild className="mb-4 ml-4 sm:ml-0">
           <Link href="/"> {/* Or use router.back() if preferred and client component */}
             <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
           </Link>
        </Button>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 px-4 mb-6">
        <Avatar className="w-20 h-20 sm:w-32 sm:h-32 text-lg border">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} data-ai-hint="user avatar profile"/>
          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-3 items-center sm:items-start">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{userProfile.username}</h1>
            {userProfile.isVerified && (
              <span className="text-blue-500" title="Verified">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.007a.75.75 0 1 0-1.06-1.06l-3.72 3.72-1.72-1.72a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l4.25-4.25Z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <div className="flex space-x-6 text-sm">
            <div><span className="font-semibold">{userProfile.postsCount}</span> posts</div>
            <div><span className="font-semibold">{userProfile.followersCount}</span> followers</div>
            <div><span className="font-semibold">{userProfile.followingCount}</span> following</div>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm">{userProfile.name}</p>
            <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
          </div>
          <div className="flex gap-2 mt-2">
            {isCurrentUserProfile ? (
              <>
                <Button size="sm" asChild>
                  <Link href="/profile/edit">Edit Profile</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/settings"><Settings className="h-4 w-4 mr-1 sm:mr-2"/> Settings</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="sm">Follow</Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/messages/${userProfile.username}`}>Message</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Highlights section for viewed user - might need adaptation or different component if HighlightCarousel is too specific to current user */}
      {/* <div className="px-4 mb-6">
         <HighlightCarousel userId={userProfile.id} />
      </div> */}
      <p className="text-center text-muted-foreground text-sm px-4 mb-6">Highlights for {userProfile.username} coming soon.</p>


      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3 border-t border-b rounded-none">
          <TabsTrigger value="posts"><Grid3X3 className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Posts</span></TabsTrigger>
          <TabsTrigger value="reels"><Clapperboard className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Reels</span></TabsTrigger>
          <TabsTrigger value="tagged"><User className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Tagged</span></TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
           <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
             {userPosts.filter(p => p.type === 'image').map(post => (
                <div key={post.id} className="relative aspect-square bg-muted">
                  <Image
                    src={post.imageUrl}
                    alt={`${userProfile.username}'s post`}
                    fill
                    sizes="(max-width: 640px) 33vw, 300px"
                    style={{ objectFit: 'cover' }}
                    data-ai-hint="user generated content"
                    className="cursor-pointer"
                  />
                </div>
             ))}
           </div>
           {userPosts.filter(p => p.type === 'image').length === 0 && <p className="text-center py-10 text-muted-foreground">No posts yet.</p>}
        </TabsContent>
        <TabsContent value="reels">
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
             {userPosts.filter(p => p.type === 'reel').map(post => (
                <div key={post.id} className="relative aspect-[9/16] bg-muted">
                   <Image
                    src={post.imageUrl} // Using imageUrl as placeholder, real reels would have video
                    alt={`${userProfile.username}'s reel`}
                    fill
                    sizes="(max-width: 640px) 33vw, 300px"
                    style={{ objectFit: 'cover' }}
                    data-ai-hint="user reel video"
                    className="cursor-pointer"
                  />
                  <div className="absolute bottom-1 left-1 text-white bg-black/50 rounded p-0.5">
                    <Clapperboard className="h-3 w-3 inline-block mr-1"/>
                    <span className="text-xs">{Math.floor(Math.random() * 5 + 1)}.{Math.floor(Math.random()*9)}k</span>
                  </div>
                </div>
             ))}
           </div>
           {userPosts.filter(p => p.type === 'reel').length === 0 && <p className="text-center py-10 text-muted-foreground">No reels yet.</p>}
        </TabsContent>
         <TabsContent value="tagged">
          <div className="text-center py-10 text-muted-foreground">
            No posts tagging {userProfile.username} yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
