// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, X, Mail } from 'lucide-react';
import { Notification } from '@/types/notification';

interface InboxProps {
  notifications: Notification[];
  onClose: () => void;
  onAcceptInvitation: (invitationId: string) => void;
  onRejectInvitation: (invitationId: string) => void;
  onMarkAsRead: () => void;
}

export const Inbox: React.FC<InboxProps> = ({
  notifications,
  onClose,
  onAcceptInvitation,
  onRejectInvitation,
  onMarkAsRead
}) => {
  const handleAccept = async (notification: Notification) => {
    if (notification.data?.invitation_id) {
      await onAcceptInvitation(notification.data.invitation_id);
    }
  };

  const handleReject = async (notification: Notification) => {
    if (notification.data?.invitation_id) {
      await onRejectInvitation(notification.data.invitation_id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-inbox-fade">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[220px] h-[220px] bg-purple-900 opacity-20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[180px] h-[180px] bg-blue-900 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      <Card className="w-full max-w-2xl bg-black/90 border border-purple-900 shadow-2xl rounded-xl relative z-10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
          {/* Move back button to the left */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <Mail className="text-purple-400" />
            <CardTitle className="text-white text-xl">Inbox</CardTitle>
          </div>
        </CardHeader>
        {/* Add pt-4 for padding at the top */}
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto pt-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-5 rounded-xl transition-all
                  ${!notification.read ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/30 border border-purple-800' : 'bg-slate-900/60 border border-slate-800'}
                `}
              >
                <div className="flex-1">
                  <div className="font-semibold text-white text-base flex items-center">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">{notification.message}</div>
                  {notification.data?.project_name && (
                    <div className="mt-2 text-xs text-gray-500">
                      Project: {notification.data.project_name} • Role: {notification.data.role}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">{formatDate(notification.created_at)}</div>
                </div>
                {notification.type === 'project_invitation' && notification.data?.invitation_id && (
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    {!notification.data.accepted && !notification.data.rejected ? (
                      <>
                        <Button
                          onClick={() => handleAccept(notification)}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleReject(notification)}
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-900"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Decline
                        </Button>
                      </>
                    ) : notification.data.accepted ? (
                      <div className="mt-2 text-green-500 font-semibold">Invitation accepted</div>
                    ) : (
                      <div className="mt-2 text-red-500 font-semibold">Invitation declined</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <style>{`
        .animate-inbox-fade {
          animation: inboxFadeIn 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes inboxFadeIn {
          from { opacity: 0; transform: scale(0.98);}
          to { opacity: 1; transform: none;}
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3;}
          50% { opacity: 0.6;}
        }
      `}</style>
    </div>,
    typeof window !== 'undefined' ? document.body : (null as any)
  );
};
