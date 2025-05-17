
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Archive, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { getArchivedStories, deleteAllArchivedStories, type ArchivedStory } from '@/services/storyArchiveService';
import { addStoryToHighlight, type Highlight } from '@/services/highlightsService'; // Assuming highlight functions exist

// Mock user ID, replace with actual auth logic
const MOCK_USER_ID = 'current_user';

export default function StoryArchivePage() {
    const { toast } = useToast();
    const [archivedStories, setArchivedStories] = useState<ArchivedStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedStory, setSelectedStory] = useState<ArchivedStory | null>(null); // For adding to highlight

    useEffect(() => {
        const loadArchive = async () => {
            setIsLoading(true);
            try {
                const stories = await getArchivedStories(MOCK_USER_ID);
                setArchivedStories(stories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())); // Sort newest first
            } catch (error) {
                console.error("Failed to load story archive:", error);
                toast({ variant: 'destructive', title: 'Error', description: 'Could not load archived stories.' });
            } finally {
                setIsLoading(false);
            }
        };
        loadArchive();
    }, [toast]);

    const handleDeleteAll = async () => {
        setIsDeleting(true);
        try {
            await deleteAllArchivedStories(MOCK_USER_ID);
            setArchivedStories([]);
            toast({ title: 'Archive Cleared', description: 'All archived stories have been deleted.' });
        } catch (error) {
            console.error("Failed to delete archive:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete archived stories.' });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddToHighlight = async (highlightId: string = 'default_highlight') => {
        if (!selectedStory) return;
        try {
             // In a real app, fetch/manage highlights properly
            const mockHighlight: Highlight = { id: highlightId, title: 'My Highlights', segmentIds: [], coverSegmentId: '' };
            await addStoryToHighlight(MOCK_USER_ID, mockHighlight.id, selectedStory);
            toast({ title: 'Added to Highlight', description: `Story added to "${mockHighlight.title}".` });
            setSelectedStory(null); // Close dialog implicitly
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: 'Could not add story to highlight.' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Archive className="h-6 w-6" /> Story Archive
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
                        <CardTitle>Your Saved Stories</CardTitle>
                        <CardDescription>Stories you've shared are saved here automatically.</CardDescription>
                    </div>
                    {archivedStories.length > 0 && (
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
                                        your archived stories.
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
                        <div className="text-center py-10 text-muted-foreground">Loading archive...</div>
                     ) : archivedStories.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                            {archivedStories.map((story) => (
                                <Card key={story.id} className="overflow-hidden group relative aspect-[9/16] cursor-pointer" onClick={() => setSelectedStory(story)}>
                                    <Image
                                        src={story.mediaUrl} // Assuming all are images for simplicity now
                                        alt={`Archived story from ${new Date(story.timestamp).toLocaleDateString()}`}
                                        fill
                                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                                        style={{ objectFit: 'cover' }}
                                        className="transition-transform group-hover:scale-105"
                                        data-ai-hint="archive story photo"
                                    />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                        <span className="text-white text-[10px] font-medium">
                                            {new Date(story.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                     ) : (
                        <Alert className="text-center">
                             <Archive className="h-4 w-4" />
                             <AlertTitle>Archive Empty</AlertTitle>
                             <AlertDescription>
                                You haven't shared any stories yet, or your archive is empty. Stories you share will appear here.
                             </AlertDescription>
                         </Alert>
                     )}
                 </CardContent>
            </Card>

             {/* --- Add to Highlight Dialog (Example) --- */}
             {/* In a real app, this would likely be a Sheet with highlight selection/creation */}
             <AlertDialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
                 <AlertDialogContent>
                     <AlertDialogHeader>
                         <AlertDialogTitle>Add to Highlight</AlertDialogTitle>
                         <AlertDialogDescription>
                             Add this story to your profile highlights. Create a new highlight or add to an existing one.
                         </AlertDialogDescription>
                     </AlertDialogHeader>
                     {/* TODO: Add UI to select/create highlights */}
                     <div className="py-4 text-center text-muted-foreground text-sm">
                         (Highlight selection UI placeholder)
                     </div>
                     <AlertDialogFooter>
                         <AlertDialogCancel onClick={() => setSelectedStory(null)}>Cancel</AlertDialogCancel>
                         {/* Example: Add to a default highlight */}
                         <AlertDialogAction onClick={() => handleAddToHighlight()}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add to Highlights
                         </AlertDialogAction>
                     </AlertDialogFooter>
                 </AlertDialogContent>
             </AlertDialog>

        </div>
    );
}
