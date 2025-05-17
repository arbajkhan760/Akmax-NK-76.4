
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Archive, Trash2, Loader2, Image as ImageIcon, Video } from 'lucide-react'; // Added specific icons
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getArchivedPosts, deleteAllArchivedPosts, type ArchivedPost } from '@/services/postArchiveService'; // Import post archive service

// Mock user ID, replace with actual auth logic
const MOCK_USER_ID = 'current_user';

export default function PostArchivePage() {
    const { toast } = useToast();
    const [archivedPosts, setArchivedPosts] = useState<ArchivedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadArchive = async () => {
            setIsLoading(true);
            try {
                const posts = await getArchivedPosts(MOCK_USER_ID);
                setArchivedPosts(posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())); // Sort newest first
            } catch (error) {
                console.error("Failed to load post archive:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load archived posts.' });
            } finally {
                setIsLoading(false);
            }
        };
        loadArchive();
    }, [toast]);

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            await deleteAllArchivedPosts(MOCK_USER_ID);
            setArchivedPosts([]);
            toast({ title: 'Post Archive Cleared', description: 'All archived posts have been deleted.' });
        } catch (error) {
            console.error("Failed to delete post archive:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete archived posts.' });
        } finally {
            setIsDeleting(false);
        }
    };

    // TODO: Implement unarchive functionality if needed
    const handleUnarchivePost = (postId: string) => {
        console.log("Unarchive post:", postId);
        toast({ title: "Unarchive Feature", description: "Unarchiving posts is not yet implemented."});
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Archive className="h-6 w-6" /> Posts Archive
                </h1>
                 <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Settings
                    </Link>
                 </Button>
            </div>

            <Card>
                 <CardHeader className="flex-row justify-between items-center">
                    <div>
                        <CardTitle>Your Saved Posts</CardTitle>
                        <CardDescription>Posts you've shared can be archived here.</CardDescription>
                        {/* TODO: Add link to settings to enable auto-archiving */}
                    </div>
                    {archivedPosts.length > 0 && (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                 <Button variant="destructive-outline" size="sm" disabled={isDeleting}>
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    {isDeleting ? 'Deleting...' : 'Delete All'}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all
                                        your archived posts.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Yes, delete all
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                 </CardHeader>
                 <CardContent>
                     {isLoading ? (
                        <div className="text-center py-10 text-muted-foreground">Loading posts archive...</div>
                     ) : archivedPosts.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-1"> {/* Consistent with profile grid */}
                            {archivedPosts.map((post) => (
                                <div key={post.id} className="relative aspect-square bg-muted group cursor-pointer" onClick={() => handleUnarchivePost(post.id)}>
                                    <Image
                                        src={post.thumbnailUrl || post.mediaUrl} // Use thumbnail for videos if available
                                        alt={`Archived post from ${new Date(post.timestamp).toLocaleDateString()}`}
                                        fill
                                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 33vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                        className="transition-opacity group-hover:opacity-75"
                                        data-ai-hint="archive post content"
                                    />
                                    {post.type === 'video' && (
                                        <Video className="absolute top-1 right-1 h-4 w-4 text-white drop-shadow-md" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <span className="text-white font-semibold text-sm">Unarchive</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                     ) : (
                        <Alert className="text-center">
                             <Archive className="h-4 w-4" />
                             <AlertTitle>Posts Archive Empty</AlertTitle>
                             <AlertDescription>
                                You haven't archived any posts yet. You can archive posts from their options menu.
                             </AlertDescription>
                         </Alert>
                     )}
                 </CardContent>
            </Card>
        </div>
    );
}

