
export interface ArchivedPost {
    id: string; // Unique ID for the archived post (could be same as original post ID)
    userId: string; // User who created the post
    type: 'image' | 'video'; // Type of the post
    mediaUrl: string;
    thumbnailUrl?: string; // Optional thumbnail for videos
    caption?: string;
    timestamp: string; // ISO Date string when the original post was created
}

const POST_ARCHIVE_KEY_PREFIX = 'akmax_post_archive_';

// Helper to get the correct localStorage key for a user
const getUserArchiveKey = (userId: string): string => `${POST_ARCHIVE_KEY_PREFIX}${userId}`;

/**
 * Simulates saving a post to the user's private archive (localStorage).
 * @param userId The ID of the user whose post is being archived.
 * @param post The post data to archive.
 */
export const archivePost = async (userId: string, post: Omit<ArchivedPost, 'userId'>): Promise<void> => {
    if (typeof window === 'undefined') return; // Guard against server-side execution

    const archiveKey = getUserArchiveKey(userId);
    try {
        const existingArchiveJson = localStorage.getItem(archiveKey);
        const existingArchive: ArchivedPost[] = existingArchiveJson ? JSON.parse(existingArchiveJson) : [];

        const newArchivedPost: ArchivedPost = { ...post, userId };

        if (!existingArchive.some(p => p.id === newArchivedPost.id)) {
            existingArchive.push(newArchivedPost);
            localStorage.setItem(archiveKey, JSON.stringify(existingArchive));
            console.log(`Archived post ${newArchivedPost.id} for user ${userId}`);
        } else {
            console.log(`Post ${newArchivedPost.id} already archived for user ${userId}`);
        }
    } catch (error) {
        console.error("Failed to save post to archive:", error);
    }
};

/**
 * Fetches all archived posts for a given user from localStorage.
 * @param userId The ID of the user whose archive to fetch.
 * @returns A promise resolving to an array of ArchivedPost objects.
 */
export const getArchivedPosts = async (userId: string): Promise<ArchivedPost[]> => {
     if (typeof window === 'undefined') return []; // Guard against server-side execution

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const archiveKey = getUserArchiveKey(userId);
    try {
        const archiveJson = localStorage.getItem(archiveKey);
        // --- Mock Data for Demo if archive is empty ---
        if (!archiveJson) {
            console.log("No real post archive found, returning mock data for user:", userId);
            // Only return mock data for the specific mock user ID used elsewhere
             if (userId === 'current_user') { // Use a consistent mock user ID
                // Generate some mock archived posts
                return Array.from({ length: 5 }).map((_, i) => ({
                   id: `archived_post_${i + 1}`,
                   userId: 'current_user',
                   type: i % 2 === 0 ? 'image' : 'video',
                   mediaUrl: i % 2 === 0 ? `https://picsum.photos/seed/archivedpost${i + 1}/400` : `https://example.com/archived_video_${i+1}.mp4`,
                   thumbnailUrl: i % 2 !== 0 ? `https://picsum.photos/seed/archivedpostthumb${i + 1}/400` : undefined,
                   caption: `This is archived post number ${i + 1}. #archive`,
                   timestamp: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000).toISOString(), // Archived days ago
                }));
            }
            return []; // Return empty for other users if no real archive
        }
        // --- End Mock Data ---
        return JSON.parse(archiveJson) as ArchivedPost[];
    } catch (error) {
        console.error("Failed to load post archive:", error);
        return [];
    }
};

/**
 * Deletes all archived posts for a specific user from localStorage.
 * @param userId The ID of the user whose archive to clear.
 * @returns A promise resolving when the operation is complete.
 */
export const deleteAllArchivedPosts = async (userId: string): Promise<void> => {
     if (typeof window === 'undefined') return; // Guard against server-side execution

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const archiveKey = getUserArchiveKey(userId);
    try {
        localStorage.removeItem(archiveKey);
        console.log(`Cleared post archive for user ${userId}`);
    } catch (error) {
        console.error("Failed to delete post archive:", error);
        throw error; // Re-throw to be caught by the caller
    }
};

// TODO: Add function to delete a single archived post if needed.
// export const deleteArchivedPost = async (userId: string, postId: string): Promise<void> => { ... }
