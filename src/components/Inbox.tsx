
import React from 'react';
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
      onMarkAsRead();
    }
  };

  const handleReject = async (notification: Notification) => {
    if (notification.data?.invitation_id) {
      await onRejectInvitation(notification.data.invitation_id);
      onMarkAsRead();
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

  return (
    <div className="fixed inset-0 bg-gray-950 z-50 overflow-y-auto">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Mail className="mr-2 h-6 w-6" />
            Inbox
          </h1>
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-gray-900 border-gray-700 ${!notification.read ? 'border-blue-500/50' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                      )}
                    </CardTitle>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{notification.message}</p>
                  
                  {notification.type === 'project_invitation' && notification.data?.invitation_id && (
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleAccept(notification)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleReject(notification)}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Decline
                      </Button>
                    </div>
                  )}
                  
                  {notification.data?.project_name && (
                    <div className="mt-3 text-sm text-gray-500">
                      Project: {notification.data.project_name} • Role: {notification.data.role}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
