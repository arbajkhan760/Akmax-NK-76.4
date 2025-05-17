
'use client';

import type { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StoryEditor from '@/components/app/StoryEditor';
import type { BlogPageProps, ContentType } from '@/types/blog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getDraftById } from '@/services/blog'; // Import service to fetch draft

// Mock user ID, replace with actual auth
const MOCK_USER_ID = 'user123';

const PublishStoryPage: NextPage<BlogPageProps> = () => {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId') || undefined;
  const queryType = searchParams.get('type') as ContentType | null; // Explicitly get type from query

  const [initialContentType, setInitialContentType] = useState<ContentType | undefined>(queryType || undefined);
  const [isLoading, setIsLoading] = useState(!!draftId); // Only load if draftId exists

  useEffect(() => {
    // If editing a draft, fetch its content type to override query param or default
    if (draftId) {
      const fetchDraftType = async () => {
        setIsLoading(true);
        try {
          const draft = await getDraftById(draftId, MOCK_USER_ID);
          if (draft?.contentType) {
            setInitialContentType(draft.contentType);
          } else if (!draft) {
             console.error("Draft not found or access denied");
             // Optionally show a toast and redirect
          }
          // If draft exists but has no contentType, it will default in StoryEditor
        } catch (error) {
          console.error("Failed to fetch draft type:", error);
           // Optionally show a toast
        }
        setIsLoading(false);
      };
      fetchDraftType();
    } else {
        // If creating new, set type from query param if present
        setInitialContentType(queryType || undefined);
    }
  }, [draftId, queryType]);

  if (isLoading) {
    return <div className="container mx-auto max-w-3xl py-10 text-center">Loading editor...</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>
      </Button>
      {/* Pass draftId and determined initialContentType to the editor */}
      <StoryEditor draftId={draftId} initialContentType={initialContentType} />
    </div>
  );
};

export default PublishStoryPage;
