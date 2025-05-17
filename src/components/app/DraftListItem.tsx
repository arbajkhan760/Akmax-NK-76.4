
'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BookText, Newspaper } from 'lucide-react'; // Added icons
import type { Draft } from '@/types/blog';
import { formatDistanceToNow } from 'date-fns';

interface DraftListItemProps {
  draft: Draft;
  onDelete: (draftId: string) => void;
}

const DraftListItem: FC<DraftListItemProps> = ({ draft, onDelete }) => {
  const contentTypeLabel = draft.contentType === 'article' ? 'Article' : 'Story Book';
  const ContentIcon = draft.contentType === 'article' ? Newspaper : BookText;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{draft.title || "Untitled Draft"}</CardTitle>
        <CardDescription className="flex items-center gap-2">
           <ContentIcon className="h-4 w-4 text-muted-foreground"/>
          <span>{contentTypeLabel}</span>
          <span>·</span>
          <span>Last saved: {formatDistanceToNow(new Date(draft.lastSavedAt), { addSuffix: true })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {draft.content.substring(0, 150) || "No content yet..."}...
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/blog/publish?draftId=${draft.id}`}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(draft.id)}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DraftListItem;
