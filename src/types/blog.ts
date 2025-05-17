

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
}

// 'pending_review' applies only to story_book type. Articles are 'published' directly.
export type StoryStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
export type ContentType = 'article' | 'story_book'; // New type

export interface Story {
  id: string;
  title: string;
  content: string; // Could be Markdown or HTML
  contentType: ContentType; // Added contentType
  author: User;
  status: StoryStatus;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  audioUrl?: string;
  coverImageUrl?: string;
  tags?: string[];
  // seriesId and episodeNumber are only relevant for contentType 'story_book'
  seriesId?: string | null; // Explicitly allow null/undefined for articles
  episodeNumber?: number | null; // Explicitly allow null/undefined for articles
  viewCount?: number;
  listenCount?: number;
}

export interface Draft extends Omit<Story, 'status' | 'createdAt' | 'updatedAt' | 'author'> {
  status: 'draft';
  contentType: ContentType; // Added contentType
  authorId: string;
  lastSavedAt: string; // ISO Date string
}

export interface Episode extends Story {
  status: 'published'; // Episodes are typically part of a published series
  contentType: 'story_book'; // Episodes must be stories
  seriesId: string; // seriesId is mandatory for episodes
  episodeNumber: number; // episodeNumber is mandatory for episodes
}

export interface Series {
  id: string;
  title: string;
  description?: string;
  author: User;
  coverImageUrl?: string;
  episodes: Episode[]; // Ensure episodes are of correct type
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
  genre?: string;
}

export interface WriterEarningSummary {
  totalEarnings: number;
  pendingEarnings: number;
  withdrawnEarnings: number;
  lastWithdrawalDate?: string;
}

export interface EarningTransaction {
  id: string;
  date: string;
  storyOrSeriesTitle: string;
  type: 'commission' | 'bonus' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface BlogPageProps {
  params?: {
    storyId?: string;
    seriesId?: string;
    draftId?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
