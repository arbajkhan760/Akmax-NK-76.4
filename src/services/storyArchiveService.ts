
export interface ArchivedStory {
    id: string; // Unique ID for the archived item (could be same as original segment ID)
    userId: string; // User who created the story
    type: 'image' | 'video'; // Type of the story segment
    mediaUrl: string;
    timestamp: string; // ISO Date string when the original story was created
    duration?: number; // Original duration
    // Add any other relevant metadata you want to archive
}

const STORY_ARCHIVE_KEY_PREFIX = 'akmax_story_archive_';

// Helper to get the correct localStorage key for a user
const getUserArchiveKey = (userId: string): string => `${STORY_ARCHIVE_KEY_PREFIX}${userId}`;

/**
 * Simulates saving a story segment to the user's private archive (localStorage).
 * In a real app, this would be an API call to the backend.
 * @param userId The ID of the user whose story is being archived.
 * @param story The story segment data to archive.
 */
export const archiveStory = async (userId: string, story: Omit<ArchivedStory, 'userId'>): Promise<void> => {
    if (typeof window === 'undefined') return; // Guard against server-side execution

    const archiveKey = getUserArchiveKey(userId);
    try {
        const existingArchiveJson = localStorage.getItem(archiveKey);
        const existingArchive: ArchivedStory[] = existingArchiveJson ? JSON.parse(existingArchiveJson) : [];

        const newArchivedStory: ArchivedStory = { ...story, userId };

        // Prevent duplicates (optional, based on ID logic)
        if (!existingArchive.some(s => s.id === newArchivedStory.id)) {
            existingArchive.push(newArchivedStory);
            localStorage.setItem(archiveKey, JSON.stringify(existingArchive));
            console.log(`Archived story ${newArchivedStory.id} for user ${userId}`);
        } else {
            console.log(`Story ${newArchivedStory.id} already archived for user ${userId}`);
        }
    } catch (error) {
        console.error("Failed to save story to archive:", error);
        // Handle potential localStorage errors (e.g., quota exceeded)
    }
};

/**
 * Fetches all archived stories for a given user from localStorage.
 * @param userId The ID of the user whose archive to fetch.
 * @returns A promise resolving to an array of ArchivedStory objects.
 */
export const getArchivedStories = async (userId: string): Promise<ArchivedStory[]> => {
     if (typeof window === 'undefined') return []; // Guard against server-side execution

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const archiveKey = getUserArchiveKey(userId);
    try {
        const archiveJson = localStorage.getItem(archiveKey);
        // --- Mock Data for Demo if archive is empty ---
        if (!archiveJson) {
            console.log("No real archive found, returning mock data for user:", userId);
            // Only return mock data for the specific mock user ID used elsewhere
             if (userId === 'current_user') {
                return [
                    { id: 'archived_story_1', userId: 'current_user', type: 'image', mediaUrl: 'https://picsum.photos/seed/archive1/1080/1920', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), duration: 5 },
                    { id: 'archived_story_2', userId: 'current_user', type: 'image', mediaUrl: 'https://picsum.photos/seed/archive2/1080/1920', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), duration: 7 },
                    { id: 'archived_story_3', userId: 'current_user', type: 'image', mediaUrl: 'https://picsum.photos/seed/archive3/1080/1920', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), duration: 5 },
                    { id: 'archived_story_4', userId: 'current_user', type: 'video', mediaUrl: 'https://example.com/mock_video.mp4', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), duration: 10 },
                ];
            }
            return []; // Return empty for other users if no real archive
        }
        // --- End Mock Data ---
        return JSON.parse(archiveJson) as ArchivedStory[];
    } catch (error) {
        console.error("Failed to load story archive:", error);
        return [];
    }
};

/**
 * Deletes all archived stories for a specific user from localStorage.
 * @param userId The ID of the user whose archive to clear.
 * @returns A promise resolving when the operation is complete.
 */
export const deleteAllArchivedStories = async (userId: string): Promise<void> => {
     if (typeof window === 'undefined') return; // Guard against server-side execution

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const archiveKey = getUserArchiveKey(userId);
    try {
        localStorage.removeItem(archiveKey);
        console.log(`Cleared story archive for user ${userId}`);
    } catch (error) {
        console.error("Failed to delete story archive:", error);
        throw error; // Re-throw to be caught by the caller
    }
};

// TODO: Add function to delete a single archived story if needed.
// export const deleteArchivedStory = async (userId: string, storyId: string): Promise<void> => { ... }
