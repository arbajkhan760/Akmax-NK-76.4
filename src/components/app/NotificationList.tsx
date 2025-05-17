'use client';

import type { FC } from 'react';
import React from 'react'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns'; 
import { UserPlus, MessageSquare, AtSign } from 'lucide-react'; // Added icons

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention' | 'system' | 'follow_request';
  user?: { 
    username: string;
    avatarUrl: string;
    id: string; // Added user ID for linking
  };
  post?: { 
    id: string;
    thumbnailUrl: string;
  };
  message: string; 
  timestamp: Date;
  isRead: boolean;
  commentText?: string; // For comment/mention notifications
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'like',
    user: { id: 'sarah_j', username: 'sarah_j', avatarUrl: 'https://picsum.photos/id/102/40' },
    post: { id: 'post-1', thumbnailUrl: 'https://picsum.photos/seed/post1/40' },
    message: 'liked your post.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), 
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'follow',
    user: { id: 'mike_ross', username: 'mike_ross', avatarUrl: 'https://picsum.photos/id/103/40' },
    message: 'started following you.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), 
    isRead: true,
  },
   {
    id: 'notif-3',
    type: 'comment',
    user: { id: 'coder_cat', username: 'coder_cat', avatarUrl: 'https://picsum.photos/id/104/40' },
    post: { id: 'post-2', thumbnailUrl: 'https://picsum.photos/seed/post2/40' },
    message: 'commented:',
    commentText: "Great shot! 📸",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), 
    isRead: false,
  },
   {
    id: 'notif-4',
    type: 'mention',
    user: { id: 'design_guru', username: 'design_guru', avatarUrl: 'https://picsum.photos/id/105/40' },
    post: { id: 'post-5', thumbnailUrl: 'https://picsum.photos/seed/post5/40' },
    message: 'mentioned you in a comment:',
    commentText: "Check this out @current_user!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), 
    isRead: true,
  },
   {
    id: 'notif-5',
    type: 'follow_request',
    user: { id: 'new_user_123', username: 'new_user_123', avatarUrl: 'https://picsum.photos/id/110/40' },
    message: 'requested to follow you.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
    isRead: false,
  },
   {
    id: 'notif-6',
    type: 'system',
    message: 'Welcome to AK Reels! Explore and connect.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
    isRead: true,
  },
    {
    id: 'notif-7',
    type: 'like',
    user: { id: 'alex_doe', username: 'alex_doe', avatarUrl: 'https://picsum.photos/id/101/40' },
    post: { id: 'post-3', thumbnailUrl: 'https://picsum.photos/seed/post3/40' },
    message: 'liked your photo.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
    isRead: true,
  },
];


const NotificationList: FC = () => {

  const handleAcceptFollow = (userId: string) => alert(`Accepted follow request from ${userId}`);
  const handleDeclineFollow = (userId: string) => alert(`Declined follow request from ${userId}`);

  if (mockNotifications.length === 0) {
    return (
      <DropdownMenuItem disabled className="text-center text-muted-foreground p-4">
        No new notifications
      </DropdownMenuItem>
    );
  }

  return (
    <>
      {mockNotifications.map((notif, index) => (
        <React.Fragment key={notif.id}>
          <DropdownMenuItem
            className={`flex items-start gap-3 p-3 ${!notif.isRead ? 'bg-accent/50' : ''}`} 
            onSelect={(e) => e.preventDefault()}
            >
            {notif.user ? (
              <Link href={`/profile/${notif.user.id}`} onClick={(e) => e.stopPropagation()}>
                <Avatar className="h-8 w-8 mt-0.5 cursor-pointer">
                  <AvatarImage src={notif.user.avatarUrl} alt={notif.user.username} data-ai-hint="user avatar"/>
                  <AvatarFallback>{notif.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
            ) : <div className="w-8 h-8 flex-shrink-0" />} 

            <div className="flex-grow text-sm space-y-1">
              <p>
                {notif.user && (
                  <Link href={`/profile/${notif.user.id}`} onClick={(e) => e.stopPropagation()} className="font-semibold hover:underline">
                    {notif.user.username}
                  </Link>
                )}
                {' '}{notif.message}
                {notif.commentText && <span className="text-muted-foreground italic"> "{notif.commentText}"</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                 {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
              </p>
               {notif.type === 'follow_request' && notif.user && (
                 <div className="flex gap-2 mt-1">
                    <Button size="sm" className="h-7 px-2" onClick={() => handleAcceptFollow(notif.user!.id)}>Accept</Button>
                    <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleDeclineFollow(notif.user!.id)}>Decline</Button>
                 </div>
               )}
            </div>

            {notif.post && (
              <Link href={`/post/${notif.post.id}`} onClick={(e) => e.stopPropagation()}> 
                <div className="relative h-10 w-10 rounded-sm overflow-hidden flex-shrink-0 ml-2 cursor-pointer">
                   <Avatar className="h-full w-full rounded-sm">
                     <AvatarImage src={notif.post.thumbnailUrl} alt="Post thumbnail" style={{ objectFit: 'cover' }} data-ai-hint="post thumbnail"/>
                      <AvatarFallback className="rounded-sm bg-muted" />
                   </Avatar>
                </div>
               </Link>
            )}
          </DropdownMenuItem>
          {index < mockNotifications.length - 1 && <DropdownMenuSeparator className="my-0" />}
        </React.Fragment>
      ))}
    </>
  );
};

export default NotificationList;
