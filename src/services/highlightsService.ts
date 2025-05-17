
import { getArchivedStories, type ArchivedStory } from './storyArchiveService'; // Import archive service

export interface Highlight {
    id: string;
    userId: string;
    title: string;
    segmentIds: string[]; // IDs of the archived stories in this highlight
    coverSegmentId?: string; // ID of the segment to use as cover
    // Derived property, populated when fetching
    segments?: ArchivedStory[];
}

// --- Mock Data Store ---
// Store highlights per user
const mockHighlightsDb = new Map<string, Highlight[]>();

// Pre-populate with some mock highlights for 'current_user'
mockHighlightsDb.set('current_user', [
    {
        id: 'highlight1',
        userId: 'current_user',
        title: 'Travels',
        segmentIds: ['archived_story_1', 'archived_story_3'], // Example IDs from mock archive
        coverSegmentId: 'archived_story_1',
    },
    {
        id: 'highlight2',
        userId: 'current_user',
        title: 'Food',
        segmentIds: ['archived_story_2'],
        coverSegmentId: 'archived_story_2',
    },
]);


const MOCK_DELAY = 300;

/**
 * Fetches highlights for a given user.
 * Also fetches the actual segment data for each highlight.
 * @param userId The ID of the user whose highlights to fetch.
 * @returns A promise resolving to an array of Highlight objects.
 */
export const getHighlights = async (userId: string): Promise<Highlight[]> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const userHighlights = mockHighlightsDb.get(userId) || [];

    // Fetch the actual archived story data for each highlight
    const archivedStories = await getArchivedStories(userId);
    const archiveMap = new Map(archivedStories.map(story => [story.id, story]));

    const populatedHighlights = userHighlights.map(highlight => ({
        ...highlight,
        segments: highlight.segmentIds
            .map(id => archiveMap.get(id))
            .filter((segment): segment is ArchivedStory => !!segment), // Filter out undefined/missing segments
    }));

    return populatedHighlights;
};

/**
 * Adds an archived story segment to a highlight.
 * @param userId The ID of the user.
 * @param highlightId The ID of the highlight to add to.
 * @param story The archived story segment to add.
 * @returns A promise resolving when the operation is complete.
 */
export const addStoryToHighlight = async (userId: string, highlightId: string, story: ArchivedStory): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const userHighlights = mockHighlightsDb.get(userId) || [];
    const highlightIndex = userHighlights.findIndex(h => h.id === highlightId);

    if (highlightIndex > -1) {
        const highlight = userHighlights[highlightIndex];
        if (!highlight.segmentIds.includes(story.id)) {
            highlight.segmentIds.push(story.id);
            // Optionally set cover if it's the first story added
            if (!highlight.coverSegmentId) {
                highlight.coverSegmentId = story.id;
            }
            // Make sure the segments array is updated if it exists
            if (highlight.segments) {
                highlight.segments.push(story);
            } else {
                 highlight.segments = [story];
            }
        }
    } else {
        // If highlight doesn't exist, create it (or handle error)
        console.warn(`Highlight ${highlightId} not found for user ${userId}. Creating new.`);
         const newHighlight: Highlight = {
             id: highlightId,
             userId: userId,
             title: "My Highlights", // Default title for new highlight
             segmentIds: [story.id],
             coverSegmentId: story.id,
             segments: [story], // Initialize segments array
         };
         userHighlights.push(newHighlight);
         mockHighlightsDb.set(userId, userHighlights);
    }

    console.log(`Added story ${story.id} to highlight ${highlightId} for user ${userId}`);
};

/**
 * Creates a new highlight for a user.
 * @param userId The ID of the user.
 * @param title The title for the new highlight.
 * @param initialStory (Optional) An initial story to add.
 * @returns A promise resolving to the newly created Highlight object.
 */
export const createHighlight = async (userId: string, title: string, initialStory?: ArchivedStory): Promise<Highlight> => {
     await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
     const newHighlight: Highlight = {
         id: `highlight_${Date.now()}`,
         userId,
         title,
         segmentIds: initialStory ? [initialStory.id] : [],
         coverSegmentId: initialStory?.id,
         segments: initialStory ? [initialStory] : [], // Initialize segments
     };

     const userHighlights = mockHighlightsDb.get(userId) || [];
     userHighlights.push(newHighlight);
     mockHighlightsDb.set(userId, userHighlights);

     console.log(`Created highlight "${title}" for user ${userId}`);
     return newHighlight;
}

// TODO: Add functions for removing stories from highlights, deleting highlights, editing titles, etc.
