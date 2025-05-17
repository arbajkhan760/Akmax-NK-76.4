
'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Edit, Trash2, PlusCircle, ArrowLeft, FilePenLine } from 'lucide-react'; // Added FilePenLine
import type { Draft } from '@/types/blog';
import { getDraftsByAuthor, deleteDraft } from '@/services/blog';
import { useToast } from '@/hooks/use-toast';
import DraftListItem from '@/components/app/DraftListItem'; // Will create this

// Mock current user ID - replace with actual auth logic
const MOCK_USER_ID = 'user123';

const DraftsPage: NextPage = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const fetchedDrafts = await getDraftsByAuthor(MOCK_USER_ID);
      setDrafts(fetchedDrafts.sort((a,b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime()));
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load your drafts." });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDrafts();
  }, []); // Removed fetchDrafts from dependency array to prevent potential infinite loop if toast changes identity

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm("Are you sure you want to delete this draft? This action cannot be undone.")) return;

    try {
      const success = await deleteDraft(draftId, MOCK_USER_ID);
      if (success) {
        toast({ title: "Draft Deleted", description: "The draft has been successfully deleted." });
        fetchDrafts(); // Refresh the list
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete draft." });
      }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "An error occurred while deleting the draft." });
    }
  };


  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <FileText className="mr-3 h-8 w-8 text-primary" />
          My Article & Story Drafts
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
            </Button>
            {/* Keep single button, type selection handled in editor or next step */}
            <Button asChild>
                <Link href="/blog/publish">
                <FilePenLine className="mr-2 h-4 w-4" /> Create New
                </Link>
            </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading drafts...</div>
      ) : drafts.length > 0 ? (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <DraftListItem key={draft.id} draft={draft} onDelete={handleDeleteDraft} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-10">
          <CardHeader>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Drafts Found</CardTitle>
            <CardDescription>You haven't saved any drafts yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/blog/publish">Start Writing Your First Article/Story</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DraftsPage;
