
export interface UserNote {
  userId: string; // Unique ID of the user who posted the note
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: Date;
  emoji?: string; // Optional emoji for the note
  songTitle?: string; // Optional song title
  songArtist?: string; // Optional song artist
}
