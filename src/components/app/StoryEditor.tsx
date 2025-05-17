
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { Save, Send, Loader2, ImageUp, Mic, FilePenLine, BookText, Newspaper, UploadCloud, ShieldAlert } from 'lucide-react'; 
import type { Draft, Story, ContentType } from '@/types/blog';
import { getDraftById, saveDraft, submitStoryForReview, publishArticle } from '@/services/blog'; 
import { useRouter } from 'next/navigation';

const MOCK_USER_ID = 'user123';

// Simple list of filtered words (expand as needed)
const FILTERED_WORDS = ['badword1', 'inappropriate', 'spammycontent', 'hateword', 'offensiveexample'];

const storyFormSchema = z.object({
  contentType: z.enum(['article', 'story_book'], { required_error: "Please select a content type." }),
  title: z.string().min(5, "Title must be at least 5 characters.").max(150, "Title too long."),
  content: z.string().min(50, "Content must be at least 50 characters."),
  audioUrl: z.string().url("Please enter a valid URL for the audio.").optional().or(z.literal('')),
  coverImageUrl: z.string().url("Please enter a valid URL for the cover image.").optional().or(z.literal('')),
  tags: z.string().optional(), 
  seriesId: z.string().optional(),
  episodeNumber: z.coerce.number().int().positive("Episode number must be positive.").optional(),
}).superRefine((data, ctx) => {
    if (data.contentType === 'article') {
        if (data.seriesId) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Articles cannot belong to a series.", path: ["seriesId"]});
        }
        if (data.episodeNumber) {
             ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Articles cannot have an episode number.", path: ["episodeNumber"]});
        }
    }
});


type StoryFormData = z.infer<typeof storyFormSchema>;

interface StoryEditorProps {
  draftId?: string;
  initialContentType?: ContentType; 
}

const StoryEditor: FC<StoryEditorProps> = ({ draftId, initialContentType = 'story_book' }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);
  const [isEditing, setIsEditing] = useState(!!draftId); 

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      contentType: initialContentType,
      title: '',
      content: '',
      audioUrl: '',
      coverImageUrl: '',
      tags: '',
      seriesId: '',
      episodeNumber: undefined,
    },
  });

  const contentType = form.watch('contentType');

  useEffect(() => {
    if (contentType === 'article') {
      form.setValue('seriesId', '');
      form.setValue('episodeNumber', undefined);
    }
  }, [contentType, form]);

  useEffect(() => {
    if (draftId) {
      setIsEditing(true);
      const fetchDraft = async () => {
        try {
          const draft = await getDraftById(draftId, MOCK_USER_ID);
          if (draft) {
            form.reset({
              contentType: draft.contentType, 
              title: draft.title,
              content: draft.content,
              audioUrl: draft.audioUrl || '',
              coverImageUrl: draft.coverImageUrl || '',
              tags: draft.tags?.join(', ') || '',
              seriesId: draft.seriesId || '',
              episodeNumber: draft.episodeNumber || undefined,
            });
            setCurrentDraftId(draft.id);
          } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Draft not found or access denied.' });
            router.push('/blog/publish'); 
          }
        } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to load draft.' });
          router.push('/blog/publish'); 
        }
      };
      fetchDraft();
    } else {
        form.reset({ ...form.formState.defaultValues, contentType: initialContentType });
        setIsEditing(false);
    }
  }, [draftId, form, toast, router, initialContentType]);

  const checkFilteredWords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return FILTERED_WORDS.some(word => lowerText.includes(word));
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    const values = form.getValues();

    if (checkFilteredWords(values.title) || checkFilteredWords(values.content)) {
      toast({
        variant: 'destructive',
        title: 'Inappropriate Content Detected',
        description: 'Your title or content contains words that violate our community guidelines. Please revise before saving.',
        duration: 7000,
        action: <Button variant="outline" size="sm" onClick={() => { /* Allow user to dismiss */ }}>OK</Button>
      });
      setIsSavingDraft(false);
      return;
    }

    try {
      const draftToSave: Partial<Draft> & { authorId: string } = {
        id: currentDraftId,
        authorId: MOCK_USER_ID,
        contentType: values.contentType, 
        title: values.title,
        content: values.content,
        audioUrl: values.audioUrl,
        coverImageUrl: values.coverImageUrl,
        tags: values.tags?.split(',').map(tag => tag.trim()).filter(Boolean),
        seriesId: values.contentType === 'story_book' ? values.seriesId : undefined,
        episodeNumber: values.contentType === 'story_book' ? values.episodeNumber : undefined,
      };
      const saved = await saveDraft(draftToSave);
      setCurrentDraftId(saved.id); 
      setIsEditing(true); 
      toast({ title: 'Draft Saved!', description: 'Your progress has been saved.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error Saving Draft', description: 'Could not save your draft. Please try again.' });
    }
    setIsSavingDraft(false);
  };

  const handleFormSubmit = async (data: StoryFormData) => {
    if (checkFilteredWords(data.title) || checkFilteredWords(data.content)) {
      toast({
        variant: 'destructive',
        title: 'Inappropriate Content Detected',
        description: `Your title or content contains words that violate our community guidelines. Please revise before submitting for ${data.contentType === 'article' ? 'publishing' : 'review'}.`,
        duration: 7000,
        action: <Button variant="outline" size="sm" onClick={() => { /* Allow user to dismiss */ }}>OK</Button>
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const commonData = {
        title: data.title,
        content: data.content,
        audioUrl: data.audioUrl,
        coverImageUrl: data.coverImageUrl,
        tags: data.tags?.split(',').map(tag => tag.trim()).filter(Boolean),
        authorId: MOCK_USER_ID,
        draftId: currentDraftId,
      };

      if (data.contentType === 'story_book') {
        const storyData = {
            ...commonData,
            contentType: 'story_book' as const, 
            seriesId: data.seriesId || undefined,
            episodeNumber: data.episodeNumber || undefined,
        };
        await submitStoryForReview(storyData);
        toast({
          title: 'Story Submitted!',
          description: `Your story is now pending review. You will be notified upon approval.`,
        });
      } else if (data.contentType === 'article') {
         const articleData = {
            ...commonData,
             contentType: 'article' as const, 
         };
        await publishArticle(articleData);
        toast({
          title: 'Article Published!',
          description: `Your article "${data.title}" is now live.`,
        });
      }

      form.reset(); 
      setCurrentDraftId(undefined); 
      router.push('/blog'); 
    } catch (error: any) {
       console.error("Submission Error:", error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.message || 'Could not submit your content. Please try again.' });
    }
    setIsSubmitting(false);
  };

  const editorTitle = isEditing
    ? `Edit ${contentType === 'article' ? 'Article' : 'Story'} Draft`
    : `Write a New ${contentType === 'article' ? 'Article' : 'Story'}`;

  const submitButtonText = contentType === 'article' ? 'Publish Article' : 'Submit Story for Review';
  const SubmitIcon = contentType === 'article' ? UploadCloud : Send;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
           {contentType === 'article' ? <Newspaper className="mr-3 h-6 w-6"/> : <BookText className="mr-3 h-6 w-6"/>}
           {editorTitle}
        </CardTitle>
        <CardDescription>
          Craft your narrative, add audio, images, and share your world. Save as a draft or submit.
          {contentType === 'article' && <span className="font-semibold"> Articles are published directly.</span>}
          {contentType === 'story_book' && <span className="font-semibold"> Stories require review before publishing.</span>}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <CardContent className="space-y-4">

             <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>What are you writing?</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                        disabled={isEditing}
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4 flex-1 has-[[data-state=checked]]:border-primary">
                            <FormControl><RadioGroupItem value="article" id="type-article"/></FormControl>
                            <FormLabel htmlFor="type-article" className="font-normal cursor-pointer flex-1">
                                <div className="flex items-center gap-2 mb-1"><Newspaper className="h-5 w-5"/> Article</div>
                                <p className="text-xs text-muted-foreground">Standalone piece like news, opinion, tutorial, etc. Published directly.</p>
                            </FormLabel>
                        </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4 flex-1 has-[[data-state=checked]]:border-primary">
                            <FormControl><RadioGroupItem value="story_book" id="type-story"/></FormControl>
                            <FormLabel htmlFor="type-story" className="font-normal cursor-pointer flex-1">
                                <div className="flex items-center gap-2 mb-1"><BookText className="h-5 w-5"/> Story / Book Episode</div>
                                 <p className="text-xs text-muted-foreground">Fictional story, potentially part of a series. Requires review.</p>
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                     {isEditing && <p className="text-xs text-muted-foreground">Content type cannot be changed once a draft is saved.</p>}
                    </FormItem>
                )}
                />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder={`Enter your ${contentType === 'article' ? 'article' : 'story'} title`} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={`Start writing your ${contentType === 'article' ? 'article' : 'story'} here...`}
                      className="min-h-[250px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ImageUp className="mr-2 h-4 w-4" />Cover Image URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/cover.jpg" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audioUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Mic className="mr-2 h-4 w-4" />Audio URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://example.com/story.mp3" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {contentType === 'story_book' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <FormField
                        control={form.control}
                        name="seriesId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Series ID (Optional)</FormLabel>
                            <FormControl><Input placeholder="Assign to existing series by ID" {...field} /></FormControl>
                            <FormDescription className="text-xs">Leave blank if this is the first episode or a standalone story.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="episodeNumber"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Episode Number (If part of a series)</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 1"
                                name={field.name}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                value={field.value ?? ''} 
                                onChange={(e) => {
                                    const stringValue = e.target.value;
                                    field.onChange(stringValue === '' ? undefined : parseInt(stringValue, 10));
                                }}
                                disabled={field.disabled}
                                />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                     />
                </div>
            )}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Comma-separated)</FormLabel>
                  <FormControl><Input placeholder="e.g., fantasy, adventure, tech, tutorial" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSubmitting}
            >
              {isSavingDraft ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button type="submit" disabled={isSubmitting || isSavingDraft}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SubmitIcon className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Submitting...' : submitButtonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default StoryEditor;

