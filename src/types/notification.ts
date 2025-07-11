// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.


export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: {
    invitation_id?: string;
    project_id?: string;
    project_name?: string;
    inviter_email?: string;
    role?: string;
    accepted?: boolean;
    rejected?: boolean;
  };
  read: boolean;
  created_at: string;
  updated_at: string;
}
