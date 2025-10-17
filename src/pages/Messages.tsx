import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "candidate":
        return "👤";
      case "interview":
        return "📅";
      case "offer":
        return "💼";
      case "project":
        return "📊";
      default:
        return "📧";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages & Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important platform events</p>
        </div>
        <Badge variant="secondary" className="h-8 px-4">
          <Bell className="h-4 w-4 mr-2" />
          {unreadCount} Unread
        </Badge>
      </div>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm text-muted-foreground">Check back later for updates</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification: any) => (
            <Card key={notification.id} className={`shadow-card transition-all ${!notification.read ? "border-l-4 border-l-primary" : ""}`}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(notification.type)}</div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead.mutate(notification.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as read
                  </Button>
                )}
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
