export interface allNotification {
  NotificationId: number;
  Title: string;
  Description: string;
  Type: number;
  Priority: number;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  CreatedDate: string;
  IsRead: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  type?: "info" | "success" | "warning" | "error";
}
