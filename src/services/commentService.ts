import type { Comment } from '@/types/comment';
import type { ContentType } from '@/types/blog'; // Use blog content type for consistency

const MOCK_DELAY = 400; // ms

// In-memory store for comments, keyed by contentId
let mockCommentsDb = new Map<string, Comment[]>([
    ['post-1', [
        { id: 'c1-1', contentId: 'post-1', contentType: 'post', user: { id: 'user2', username: 'sarah_j', avatarUrl: 'https://picsum.photos/id/102/40' }, text: 'Great post! 👍', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { id: 'c1-2', contentId: 'post-1', contentType: 'post', user: { id: 'user3', username: 'mike_ross', avatarUrl: 'https://picsum.photos/id/103/40' }, text: 'Love this!', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    ]],
    ['reel-1', [
         { id: 'c2-1', contentId: 'reel-1', contentType: 'reel', user: { id: 'user4', username: 'coder_cat', avatarUrl: 'https://picsum.photos/id/104/40' }, text: '😂😂😂', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    ]],
    ['story1', [ // Assuming storyId from blog service
         { id: 'c3-1', contentId: 'story1', contentType: 'story', user: { id: 'user5', username: 'design_guru', avatarUrl: 'https://picsum.photos/id/105/40' }, text: 'Can\'t wait for the next chapter!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    ]],
     ['story3', [ // Assuming articleId from blog service (using story ID for mock)
         { id: 'c4-1', contentId: 'story3', contentType: 'article', user: { id: 'user6', username: 'travel_bug', avatarUrl: 'https://picsum.photos/id/106/40' }, text: 'Interesting perspective.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
         { id: 'c4-2', contentId: 'story3', contentType: 'article', user: { id: 'user7', username: 'food_lover', avatarUrl: 'https://picsum.photos/id/107/40' }, text: 'Well written article!', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ]],
]);

/**
 * Fetches comments for a specific piece of content.
 * @param contentId The ID of the post, reel, story, or article.
 * @param contentType The type of content.
 * @returns A promise that resolves to an array of comments.
 */
export const getComments = async (contentId: string, contentType: 'post' | 'reel' | 'story' | 'article'): Promise<Comment[]> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    console.log(`Fetching comments for ${contentType} ID: ${contentId}`);
    const comments = mockCommentsDb.get(contentId) || [];
    // Ensure comments match the requested contentType (optional sanity check for mock)
    return comments.filter(c => c.contentType === contentType).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/**
 * Adds a new comment to a piece of content.
 * @param contentId The ID of the content.
 * @param contentType The type of content.
 * @param text The comment text.
 * @param userId The ID of the user posting the comment.
 * @param username The username of the user posting the comment.
 * @param avatarUrl The avatar URL of the user posting the comment.
 * @returns A promise that resolves to the newly added comment.
 */
export const addComment = async (
    contentId: string,
    contentType: 'post' | 'reel' | 'story' | 'article',
    text: string,
    userId: string,
    username: string,
    avatarUrl: string
): Promise<Comment> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY + 200)); // Slightly longer delay for posting
    console.log(`Adding comment to ${contentType} ID: ${contentId} by ${username}`);

    const newComment: Comment = {
        id: `c-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        contentId,
        contentType,
        user: { id: userId, username, avatarUrl },
        text,
        timestamp: new Date().toISOString(),
    };

    const existingComments = mockCommentsDb.get(contentId) || [];
    mockCommentsDb.set(contentId, [...existingComments, newComment]);

    return newComment;
};

// Optional: Function to get comment count (can be derived or fetched separately)
export const getCommentCount = async (contentId: string): Promise<number> => {
     await new Promise(resolve => setTimeout(resolve, MOCK_DELAY / 2)); // Faster count fetch
     return (mockCommentsDb.get(contentId) || []).length;
}
