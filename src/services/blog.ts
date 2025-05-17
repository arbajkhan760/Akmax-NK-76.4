
import type { Story, Draft, Series, Episode, WriterEarningSummary, EarningTransaction, User, ContentType } from '@/types/blog';
import { getCommentCount as fetchCommentCountFromService } from './commentService'; // Import from comment service

const MOCK_DELAY = 500; // ms

const mockUser: User = {
  id: 'user123',
  username: 'current_blogger',
  avatarUrl: 'https://picsum.photos/seed/blogger/50',
};

let mockStoriesDb: Story[] = [
  {
    id: 'story1',
    title: 'The Lost City of Eldoria',
    content: 'Chapter 1: The Map...\n\nEldoria was a legend, a whisper among treasure hunters...',
    contentType: 'story_book',
    author: mockUser,
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImageUrl: 'https://picsum.photos/seed/eldoria/600/400',
    tags: ['adventure', 'fantasy'],
    seriesId: 'series1',
    episodeNumber: 1,
    viewCount: 1200,
    listenCount: 300,
  },
  {
    id: 'story2',
    title: 'Secrets of the Eldorian Tombs',
    content: 'Chapter 1: The Descent...\n\nFollowing the ancient map, they found the entrance...',
    contentType: 'story_book',
    author: mockUser,
    status: 'published',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    coverImageUrl: 'https://picsum.photos/seed/eldoriatombs/600/400',
    tags: ['adventure', 'fantasy', 'mystery'],
    seriesId: 'series1',
    episodeNumber: 2,
    viewCount: 950,
  },
  {
    id: 'story3',
    title: 'Whispers in the Data Stream',
    content: 'A standalone cyberpunk thriller article about a hacker uncovering a global conspiracy.',
    contentType: 'article',
    author: mockUser,
    status: 'published',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImageUrl: 'https://picsum.photos/seed/cyberpunk/600/400',
    tags: ['cyberpunk', 'thriller', 'sci-fi'],
    viewCount: 2500,
    listenCount: 800,
  },
   {
    id: 'story4',
    title: 'Beginners Guide to React Hooks',
    content: 'Learn the fundamentals of React Hooks in this comprehensive article...',
    contentType: 'article',
    author: mockUser,
    status: 'published',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    coverImageUrl: 'https://picsum.photos/seed/reacthooks/600/400',
    tags: ['react', 'tutorial', 'webdev'],
    viewCount: 3100,
  },
  {
    id: 'pendingStoryBook1',
    title: 'The Galactic Cookbook (Pending Review)',
    content: 'Delicious recipes from across the galaxy. This culinary journey explores the unique ingredients and cooking techniques of various alien civilizations. Awaiting approval from the Galactic Culinary Council.',
    contentType: 'story_book',
    author: mockUser,
    status: 'pending_review', 
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    coverImageUrl: 'https://picsum.photos/seed/galacticcookbook/600/400',
    tags: ['cooking', 'sci-fi', 'recipes'],
    seriesId: undefined, 
    episodeNumber: undefined,
    viewCount: 0,
  }
];

let mockDraftsDb: Draft[] = [
  {
    id: 'draft1',
    title: 'Chronicles of the Void - Draft',
    content: 'The spaceship drifted silently through the void...',
    contentType: 'story_book',
    authorId: mockUser.id,
    lastSavedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    audioUrl: '',
    coverImageUrl: 'https://picsum.photos/seed/voidchronicles/600/400',
    tags: ['sci-fi', 'space opera'],
  },
   {
    id: 'draft2',
    title: 'My Thoughts on AI - Draft',
    content: 'Artificial intelligence is rapidly evolving...',
    contentType: 'article',
    authorId: mockUser.id,
    lastSavedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['ai', 'technology', 'opinion'],
  }
];

let mockSeriesDb: Series[] = [
  {
    id: 'series1',
    title: 'The Eldoria Saga',
    description: 'An epic adventure into forgotten lands and ancient secrets.',
    author: mockUser,
    coverImageUrl: 'https://picsum.photos/seed/eldoriasaga/800/500',
    episodes: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isCompleted: false,
    genre: 'Fantasy Adventure',
  }
];


export const getPublishedStories = async (): Promise<Story[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockStoriesDb.filter(story => story.status === 'published' && story.contentType === 'article');
};

export const getPublishedSeries = async (): Promise<Series[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockSeriesDb.map(series => ({
    ...series,
    episodes: mockStoriesDb.filter(s => s.seriesId === series.id && s.status === 'published' && s.contentType === 'story_book') as Episode[]
  }));
};

export const getPendingReviewStoryBooks = async (): Promise<Story[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockStoriesDb.filter(story => story.status === 'pending_review' && story.contentType === 'story_book');
};

export const getStoryById = async (storyId: string): Promise<Story | null> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockStoriesDb.find(story => story.id === storyId) || null;
};

export const getSeriesById = async (seriesId: string): Promise<Series | null> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  const series = mockSeriesDb.find(s => s.id === seriesId);
  if (!series) return null;
  return {
    ...series,
    episodes: mockStoriesDb.filter(s => s.seriesId === seriesId && s.status === 'published' && s.contentType === 'story_book') as Episode[]
  };
};

export const getDraftsByAuthor = async (authorId: string): Promise<Draft[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return mockDraftsDb.filter(draft => draft.authorId === authorId);
};

export const getDraftById = async (draftId: string, authorId: string): Promise<Draft | null> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  const draft = mockDraftsDb.find(d => d.id === draftId && d.authorId === authorId);
  return draft || null;
};

export const saveDraft = async (draftData: Partial<Draft> & { authorId: string }): Promise<Draft> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  const existingDraftIndex = mockDraftsDb.findIndex(d => d.id === draftData.id);
  const now = new Date().toISOString();

  if (existingDraftIndex > -1) {
    const updatedDraft = {
        ...mockDraftsDb[existingDraftIndex],
        ...draftData,
        contentType: draftData.contentType || mockDraftsDb[existingDraftIndex].contentType,
        lastSavedAt: now
    };
    mockDraftsDb[existingDraftIndex] = updatedDraft;
    return updatedDraft;
  } else {
    const newDraft: Draft = {
      id: draftData.id || `draft-${Date.now()}`,
      title: draftData.title || 'Untitled Draft',
      content: draftData.content || '',
      contentType: draftData.contentType || 'story_book',
      authorId: draftData.authorId,
      lastSavedAt: now,
      audioUrl: draftData.audioUrl,
      coverImageUrl: draftData.coverImageUrl,
      tags: draftData.tags,
      status: 'draft',
      seriesId: draftData.contentType === 'story_book' ? draftData.seriesId : undefined,
      episodeNumber: draftData.contentType === 'story_book' ? draftData.episodeNumber : undefined,
    };
    mockDraftsDb.push(newDraft);
    return newDraft;
  }
};

export const submitStoryForReview = async (storyData: Omit<Story, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'author'> & { authorId: string, draftId?: string }): Promise<Story> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  if (storyData.contentType !== 'story_book') {
      throw new Error("Only 'story_book' types can be submitted for review.");
  }
  const now = new Date().toISOString();
  const newStory: Story = {
    id: `story-${Date.now()}`,
    ...storyData,
    contentType: 'story_book',
    author: mockUser,
    status: 'pending_review',
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    listenCount: 0,
  };
  mockStoriesDb.push(newStory);

  if (storyData.draftId) {
    mockDraftsDb = mockDraftsDb.filter(d => d.id !== storyData.draftId);
  }

  // Simulate review process
  setTimeout(() => {
    const foundStoryIndex = mockStoriesDb.findIndex(s => s.id === newStory.id);
    if (foundStoryIndex > -1 && mockStoriesDb[foundStoryIndex].status === 'pending_review') { // Check status before changing
      mockStoriesDb[foundStoryIndex].status = 'published';
      console.log(`STORY PUBLISHED (Simulated): ${mockStoriesDb[foundStoryIndex].title}. Email would be sent.`);
       if (mockStoriesDb[foundStoryIndex].seriesId) {
            const seriesIndex = mockSeriesDb.findIndex(series => series.id === mockStoriesDb[foundStoryIndex].seriesId);
            if (seriesIndex > -1) {
                mockSeriesDb[seriesIndex].updatedAt = new Date().toISOString();
            }
       }
    }
  }, MOCK_DELAY * 4);


  return newStory;
};

export const publishArticle = async (articleData: Omit<Story, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'author' | 'seriesId' | 'episodeNumber'> & { authorId: string, draftId?: string }): Promise<Story> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
   if (articleData.contentType !== 'article') {
      throw new Error("Only 'article' types can be published directly using this function.");
  }
  const now = new Date().toISOString();
  const newArticle: Story = {
    id: `article-${Date.now()}`,
    ...articleData,
    contentType: 'article',
    author: mockUser,
    status: 'published',
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    listenCount: 0,
    seriesId: undefined,
    episodeNumber: undefined,
  };
  mockStoriesDb.push(newArticle);

  if (articleData.draftId) {
    mockDraftsDb = mockDraftsDb.filter(d => d.id !== articleData.draftId);
  }

  console.log(`ARTICLE PUBLISHED (Simulated): ${newArticle.title}`);
  return newArticle;
};


export const deleteDraft = async (draftId: string, authorId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    const initialLength = mockDraftsDb.length;
    mockDraftsDb = mockDraftsDb.filter(d => !(d.id === draftId && d.authorId === authorId));
    return mockDraftsDb.length < initialLength;
};


export const getWriterEarningsSummary = async (authorId: string): Promise<WriterEarningSummary> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  const storiesByAuthor = mockStoriesDb.filter(s => s.author.id === authorId && s.status === 'published');
  let totalPotentialEarnings = 0;
  storiesByAuthor.forEach(s => {
    totalPotentialEarnings += (s.viewCount || 0) * 0.01;
    totalPotentialEarnings += (s.listenCount || 0) * 0.05;
  });

  return {
    totalEarnings: totalPotentialEarnings,
    pendingEarnings: totalPotentialEarnings * 0.3,
    withdrawnEarnings: totalPotentialEarnings * 0.5,
    lastWithdrawalDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export const getWriterTransactions = async (authorId: string): Promise<EarningTransaction[]> => {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return [
    { id: 'txn1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'The Lost City of Eldoria', type: 'commission', amount: 15.00, status: 'completed' },
    { id: 'txn2', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Whispers in the Data Stream', type: 'commission', amount: 20.50, status: 'completed' },
    { id: 'txn3', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Monthly Bonus', type: 'bonus', amount: 50.00, status: 'completed' },
    { id: 'txn4', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Withdrawal', type: 'withdrawal', amount: -75.00, status: 'completed' },
    { id: 'txn5', date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Withdrawal', type: 'withdrawal', amount: -100.00, status: 'failed' },
    { id: 'txn6', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Secrets of the Eldorian Tombs', type: 'commission', amount: 10.50, status: 'pending' },
    { id: 'txn7', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), storyOrSeriesTitle: 'Beginners Guide to React Hooks', type: 'commission', amount: 31.00, status: 'pending' },
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Fetches the comment count for a specific story or article.
 * @param contentId The ID of the story or article.
 * @returns A promise that resolves to the number of comments.
 */
export const getCommentCount = async (contentId: string): Promise<number> => {
    // Delegate to the comment service
    return fetchCommentCountFromService(contentId);
};
