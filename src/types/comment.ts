export interface CommentUser {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  contentId: string; // ID of the post, reel, story etc.
  contentType: 'post' | 'reel' | 'story' | 'article'; // Type of content
  user: CommentUser;
  text: string;
  timestamp: string; // ISO Date string
  likes?: number; // Optional: number of likes on the comment
  replies?: Comment[]; // Optional: nested replies
}
