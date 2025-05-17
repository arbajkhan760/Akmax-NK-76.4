
import type { UserNote } from '@/types/notes';

// Mock current user ID - replace with actual auth logic
const MOCK_CURRENT_USER_ID = 'current_user'; // Matches the 'me' user in chat mock data

// In-memory store for mock notes
let mockUserNotesDb = new Map<string, UserNote>([
  ['alex_doe', {
    userId: 'alex_doe',
    username: 'alex_doe',
    avatarUrl: 'https://picsum.photos/id/101/50',
    content: 'Having a great day! ☀️',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    emoji: '☀️'
  }],
  ['sarah_j', {
    userId: 'sarah_j',
    username: 'sarah_j',
    avatarUrl: 'https://picsum.photos/id/102/50',
    content: 'Coding session 💻',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    emoji: '💻',
    songTitle: 'Study Lo-fi Beat', // Added song info
    songArtist: 'Chillhop Masters'
  }],
  ['mike_ross', {
    userId: 'mike_ross',
    username: 'mike_ross',
    avatarUrl: 'https://picsum.photos/id/103/50',
    content: 'Thinking about dinner...',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  }],
  // Example with current user note
  [MOCK_CURRENT_USER_ID, {
    userId: MOCK_CURRENT_USER_ID,
    username: 'current_user',
    avatarUrl: 'https://picsum.photos/id/200/50',
    content: 'My awesome note!',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    emoji: '🎉',
    songTitle: 'Celebration Funk',
    songArtist: 'The Groovers'
  }],
]);

const MOCK_DELAY = 300;

export const getAllNotes = async (): Promise<UserNote[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return Array.from(mockUserNotesDb.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const getUserNote = async (userId: string): Promise<UserNote | null> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockUserNotesDb.get(userId) || null;
}

// Updated saveUserNote to accept song details
export const saveUserNote = async (
    userId: string,
    username: string,
    avatarUrl: string,
    content: string,
    emoji?: string,
    songTitle?: string,
    songArtist?: string
): Promise<UserNote> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  if (content.length > 60) {
    throw new Error("Note content cannot exceed 60 characters.");
  }
  const note: UserNote = {
    userId,
    username,
    avatarUrl,
    content,
    timestamp: new Date(),
    emoji,
    songTitle: songTitle?.trim() || undefined, // Save trimmed song info or undefined
    songArtist: songArtist?.trim() || undefined,
  };
  mockUserNotesDb.set(userId, note);
  return note;
};

export const deleteUserNote = async (userId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  mockUserNotesDb.delete(userId);
};

// Helper to get the MOCK_CURRENT_USER_ID if needed by components
export const getCurrentMockUserId = () => MOCK_CURRENT_USER_ID;
export const getCurrentMockUserAvatar = () => 'https://picsum.photos/id/200/50'; // Matches 'me' in chat details
export const getCurrentMockUsername = () => 'current_user';
