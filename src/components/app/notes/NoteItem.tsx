
'use client';

import type { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Music2 } from 'lucide-react'; // Added Music2 icon
import type { UserNote } from '@/types/notes';

interface NoteItemProps {
  note?: UserNote;
  isCurrentUserPlaceholder?: boolean; // True if this item is for the current user to add a note
  onClick: () => void;
  currentUsername?: string; // To display "Your Note"
}

const NoteItem: FC<NoteItemProps> = ({ note, isCurrentUserPlaceholder, onClick, currentUsername }) => {
  const displayUsername = isCurrentUserPlaceholder ? "Your Note" : note?.username;
  const displayAvatarUrl = isCurrentUserPlaceholder ? (note?.avatarUrl || '') : note?.avatarUrl; // Use current user's avatar if note exists, or placeholder

  return (
    <div
      className="flex flex-col items-center gap-1.5 cursor-pointer w-20 flex-shrink-0"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={isCurrentUserPlaceholder ? "Add or edit your note" : `View ${note?.username}'s note`}
    >
      <div className="relative">
        <Avatar className="h-14 w-14 border-2 border-muted-foreground/30 p-0.5">
          {displayAvatarUrl ? (
            <AvatarImage src={displayAvatarUrl} alt={displayUsername} className="rounded-full" data-ai-hint="user avatar" />
          ) : null}
          <AvatarFallback className="text-xl bg-muted">
            {isCurrentUserPlaceholder && !note ? (
              <Plus className="h-6 w-6 text-muted-foreground" />
            ) : (
              displayUsername?.charAt(0).toUpperCase()
            )}
          </AvatarFallback>
        </Avatar>
        {isCurrentUserPlaceholder && note && (
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-0.5 leading-none">
            <Plus className="h-2.5 w-2.5" />
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-center truncate w-full">
        {isCurrentUserPlaceholder ? "Your Note" : note?.username}
      </span>
      {note && !isCurrentUserPlaceholder && (
        <div className="text-[10px] text-muted-foreground text-center truncate w-full h-auto space-y-0.5">
           {/* Display note content and emoji */}
          <p className="truncate leading-tight h-3">
            {note.content} {note.emoji}
          </p>
           {/* Display song info if available */}
           {note.songTitle && (
            <p className="flex items-center justify-center gap-1 truncate leading-tight h-3 text-purple-600/80 dark:text-purple-400/80">
              <Music2 className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">{note.songTitle}{note.songArtist ? ` - ${note.songArtist}`: ''}</span>
            </p>
           )}
        </div>
      )}
      {/* Ensure consistent height even if no song/note content */}
      {!note && !isCurrentUserPlaceholder && <div className="h-4"></div>}
       {note && !isCurrentUserPlaceholder && !note.songTitle && <div className="h-[calc(0.25rem+3px)]"></div>} {/* Add padding if no song */}

    </div>
  );
};

export default NoteItem;
