import { Home, Target, Users, DollarSign, BarChart3, Mail, Settings, HelpCircle, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "HireSmart", url: "/hire-smart", icon: Target },
  { title: "AutoMatch", url: "/auto-match", icon: Users },
  { title: "Salary Analysis", url: "/salary-analysis", icon: DollarSign },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Messages", url: "/messages", icon: Mail },
  { title: "Settings", url: "/settings", icon: Settings },
];

const footerMenuItems = [
  { title: "Help", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <span className="text-lg font-bold text-primary-foreground">H</span>
              </div>
              {!collapsed && (
                <span className="text-lg font-bold">Humanet</span>
              )}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <Separator className="my-2" />
        <SidebarMenu>
          {footerMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
