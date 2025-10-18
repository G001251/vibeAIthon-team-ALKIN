import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AppLayout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["header-notifications"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      return data || [];
    },
  });

  // Real-time subscription for notifications
  useEffect(() => {
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["header-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-destructive text-destructive-foreground">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-popover">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="secondary">{unreadCount} unread</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification: any) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex flex-col items-start p-4 cursor-pointer ${
                          !notification.read ? "bg-secondary/50" : ""
                        }`}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead.mutate(notification.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {!notification.read && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="justify-center text-primary cursor-pointer"
                      onClick={() => navigate("/messages")}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{profile?.name}</span>
                  <Badge variant="secondary" className="hidden md:inline">
                    {profile?.role}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-secondary/20 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
