import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Clapperboard, User, Settings, BarChartHorizontalBig } from 'lucide-react'; // Added BarChartHorizontalBig
import Image from 'next/image';
import Link from 'next/link';
import HighlightCarousel from '@/components/app/HighlightCarousel'; 

const userProfile = {
  id: 'current_user', 
  username: "ak_group_76_official",
  name: "AK Group 76",
  bio: "Official account for AK Group 76. Innovating the future.",
  avatarUrl: "https://picsum.photos/id/76/150",
  postsCount: 125,
  followersCount: "1.2M",
  followingCount: 150,
  isVerified: true,
};

const userPosts = Array.from({ length: 12 }).map((_, i) => ({
  id: `post-${i + 1}`,
  imageUrl: `https://picsum.photos/seed/post${i + 1}/300`,
  type: i % 3 === 0 ? 'reel' : 'image', 
}));

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl py-6 px-0 sm:px-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10 px-4 mb-6">
        <Avatar className="w-20 h-20 sm:w-32 sm:h-32 text-lg border">
          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} data-ai-hint="logo design"/>
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
            <Button size="sm" asChild>
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/settings">
                 <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                 <span className="hidden sm:inline">Settings</span>
                 <span className="sm:hidden">Settings</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/profile/analytics">
                 <BarChartHorizontalBig className="h-4 w-4 mr-1 sm:mr-2" />
                 <span className="hidden sm:inline">Analytics</span>
                 <span className="sm:hidden">Analytics</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

       <div className="px-4 mb-6">
         <HighlightCarousel userId={userProfile.id} />
       </div>

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
                    alt="User post"
                    fill 
                    sizes="(max-width: 640px) 33vw, 300px" 
                    style={{ objectFit: 'cover' }} 
                    data-ai-hint="user content social"
                    className="cursor-pointer"
                  />
                </div>
             ))}
           </div>
        </TabsContent>
        <TabsContent value="reels">
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
             {userPosts.filter(p => p.type === 'reel').map(post => (
                <div key={post.id} className="relative aspect-[9/16] bg-muted">
                   <Image
                    src={post.imageUrl} 
                    alt="User reel"
                    fill 
                    sizes="(max-width: 640px) 33vw, 300px" 
                    style={{ objectFit: 'cover' }} 
                    data-ai-hint="user content video"
                    className="cursor-pointer"
                  />
                  <div className="absolute bottom-1 left-1 text-white bg-black/50 rounded p-0.5">
                    <Clapperboard className="h-3 w-3 inline-block mr-1"/>
                    <span className="text-xs">1.2k</span> 
                  </div>
                </div>
             ))}
           </div>
        </TabsContent>
         <TabsContent value="tagged">
          <div className="text-center py-10 text-muted-foreground">
            No tagged posts yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
