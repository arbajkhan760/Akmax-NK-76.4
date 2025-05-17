'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Circle } from 'lucide-react';
import StoryViewer from './StoryViewer'; // Import the StoryViewer for viewing highlights
import type { Highlight, ArchivedStory } from '@/services/highlightsService'; // Import highlight types
import { getHighlights } from '@/services/highlightsService'; // Import service function
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

interface HighlightCarouselProps {
    userId: string; // ID of the user whose highlights to display
}

// Example of how HighlightViewer might be invoked (simplified)
// This assumes StoryViewer can be adapted or a dedicated HighlightViewer exists
const openHighlightViewer = (highlights: Highlight[], startIndex: number) => {
    console.log("Opening highlight viewer for:", highlights[startIndex].title, "at index", startIndex);
    // TODO: Implement actual viewer logic, potentially reusing/adapting StoryViewer
    // Need to pass the *segments* of the selected highlight to the viewer.
    // Example: <StoryViewer stories={[{ user:..., segments: highlights[startIndex].segments }]} startIndex={0} onClose={...} />
};

const HighlightCarousel: FC<HighlightCarouselProps> = ({ userId }) => {
    const router = useRouter(); // Initialize router
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showHighlightViewer, setShowHighlightViewer] = useState(false);
    const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);

    useEffect(() => {
        const loadHighlights = async () => {
            setIsLoading(true);
            try {
                const fetchedHighlights = await getHighlights(userId);
                setHighlights(fetchedHighlights);
            } catch (error) {
                console.error("Failed to load highlights:", error);
                // Optionally show toast
            } finally {
                setIsLoading(false);
            }
        };
        loadHighlights();
    }, [userId]);

    const handleHighlightClick = (index: number) => {
        setSelectedHighlightIndex(index);
        setShowHighlightViewer(true); // Trigger viewer opening
        // In a real app, you might fetch the full segments for the selected highlight here if not already loaded
    };

    const handleCreateHighlight = () => {
        console.log("Navigate to story archive to select stories for highlight.");
        // Navigate to the story archive page where users can select stories
        router.push('/profile/archive/stories');
        // The archive page should ideally have logic to handle selection for highlights.
        // For now, it just navigates there.
    };

    if (isLoading) {
        // Skeleton Loader
        return (
             <ScrollArea className="w-full whitespace-nowrap">
                 <div className="flex w-max space-x-4 py-1">
                     {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 w-16 flex-shrink-0">
                            <Avatar className="h-14 w-14 border-2 border-muted bg-muted rounded-full animate-pulse"></Avatar>
                            <div className="h-2 w-10 bg-muted rounded animate-pulse"></div>
                        </div>
                     ))}
                 </div>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
        );
    }

     if (highlights.length === 0) {
        // Optionally show a "Create Highlight" placeholder if user is viewing their own profile
        // For now, just return null if no highlights exist
        // Always show the 'New' button for the current user
        if (userId === 'current_user') { // Assuming 'current_user' is the logged-in user's ID
             return (
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex w-max space-x-4 py-1">
                         <div
                            key="new-highlight"
                            className="flex flex-col items-center gap-1.5 cursor-pointer w-16 flex-shrink-0"
                            onClick={handleCreateHighlight}
                            role="button"
                            tabIndex={0}
                            aria-label="Create new highlight"
                            >
                            <Avatar className="h-14 w-14 border-2 border-dashed border-muted-foreground p-0.5 flex items-center justify-center bg-muted">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </Avatar>
                            <span className="text-xs font-medium text-center truncate w-full">New</span>
                        </div>
                    </div>
                     <ScrollBar orientation="horizontal" className="invisible" />
                </ScrollArea>
             );
        }
        return null;
    }

    return (
        <>
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 py-1">
                    {/* Existing Highlights */}
                    {highlights.map((highlight, index) => (
                        <div
                            key={highlight.id}
                            className="flex flex-col items-center gap-1.5 cursor-pointer w-16 flex-shrink-0"
                            onClick={() => handleHighlightClick(index)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View highlight: ${highlight.title}`}
                        >
                            <Avatar className="h-14 w-14 border-2 border-muted-foreground/50 p-0.5">
                                {/* Use cover image of the first segment as thumbnail */}
                                {highlight.coverSegmentId && highlight.segments?.find(s => s.id === highlight.coverSegmentId)?.mediaUrl ? (
                                     <AvatarImage src={highlight.segments.find(s => s.id === highlight.coverSegmentId)?.mediaUrl} alt={highlight.title} className="rounded-full object-cover" data-ai-hint="highlight cover"/>
                                ) : highlight.segments?.[0]?.mediaUrl ? (
                                     <AvatarImage src={highlight.segments[0].mediaUrl} alt={highlight.title} className="rounded-full object-cover" data-ai-hint="highlight cover"/>
                                ) : null}
                                <AvatarFallback className="text-xl bg-muted rounded-full">
                                    {highlight.title.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-center truncate w-full">{highlight.title}</span>
                        </div>
                    ))}
                     {/* "New" Highlight Button (Show if it's the user's own profile) */}
                     {userId === 'current_user' && ( // Assuming 'current_user' is the logged-in user's ID
                        <div
                            key="new-highlight"
                            className="flex flex-col items-center gap-1.5 cursor-pointer w-16 flex-shrink-0"
                            onClick={handleCreateHighlight}
                            role="button"
                            tabIndex={0}
                            aria-label="Create new highlight"
                            >
                            <Avatar className="h-14 w-14 border-2 border-dashed border-muted-foreground p-0.5 flex items-center justify-center bg-muted">
                                <Plus className="h-6 w-6 text-muted-foreground" />
                            </Avatar>
                            <span className="text-xs font-medium text-center truncate w-full">New</span>
                        </div>
                     )}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>

            {/* Highlight Viewer */}
             {showHighlightViewer && highlights[selectedHighlightIndex]?.segments && (
                // Adapt StoryViewer or use a dedicated HighlightViewer
                // We need to transform Highlight segments into the structure StoryViewer expects
                 <StoryViewer
                    stories={[{
                        // Use highlight title/dummy user info for the viewer header,
                        // but maybe fetch actual user details if needed elsewhere
                        user: { id: userId, username: highlights[selectedHighlightIndex].title, avatarUrl: '' },
                        segments: highlights[selectedHighlightIndex].segments!.map(s => ({ // Map ArchivedStory to StorySegment
                            id: s.id,
                            type: s.type === 'video' ? 'video' : 'image', // Map type correctly
                            mediaUrl: s.mediaUrl,
                            duration: s.duration || 5, // Default duration if needed
                            timestamp: s.timestamp,
                            // Add other relevant fields if StoryViewer expects them
                        })),
                        // These fields from UserStory are not directly applicable to a single viewed highlight
                        hasNewStory: false,
                        lastUpdatedAt: highlights[selectedHighlightIndex].segments![0]?.timestamp || new Date().toISOString(),
                    }]}
                    startIndex={0} // Start from the beginning of the selected highlight
                    onClose={() => setShowHighlightViewer(false)}
                />
             )}
        </>
    );
};

export default HighlightCarousel;
