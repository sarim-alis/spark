import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  BarChart3,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/api/entities";
import { userAPI } from "@/services/api";
import BrandLogo from "@/components/common/BrandLogo";

const adminNavigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview"
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    description: "Manage Users"
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: BookOpen,
    description: "All Courses"
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3,
    description: "Analytics"
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    description: "System Config"
  },
];

const Logo = () => (
  <Link to="/admin/dashboard" className="flex items-center gap-2">
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-8 h-8 text-red-500" />
      <span className="text-xl font-bold text-white">Admin Panel</span>
    </div>
  </Link>
);

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  React.useEffect(() => {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
  }, [location.pathname]);

  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_user' && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
    };

    const handleAuthUpdate = (e) => {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        setUser(JSON.parse(authUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth_user_updated', handleAuthUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth_user_updated', handleAuthUpdate);
    };
  }, []);

  const loadUser = async () => {
    try {
      const authUser = localStorage.getItem('auth_user');
      if (authUser) {
        setUser(JSON.parse(authUser));
      }
      
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const handleLogout = async () => {
    await UserEntity.logout();
    navigate('/admin/login');
  };

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --admin-sidebar-bg: linear-gradient(180deg, #7f1d1d 0%, #991b1b 100%);
          --admin-accent: #ef4444;
          --admin-accent-hover: #dc2626;
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
        }
        .mobile-nav {
          @media (max-width: 768px) {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(203, 213, 225, 0.3);
          }
        }
      `}</style>

      <div className="min-h-screen flex w-full bg-gradient-to-br from-red-50 via-white to-red-100">
        <Sidebar className="border-r-0 shadow-2xl hidden md:flex" style={{background: "var(--admin-sidebar-bg)"}}>
          <SidebarHeader className="border-b border-red-700/50 p-4 lg:p-6">
            <Logo />
          </SidebarHeader>

          <SidebarContent className="p-2 lg:p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-red-200 uppercase tracking-wider px-2 lg:px-3 py-3">
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {adminNavigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`group relative overflow-hidden rounded-lg transition-all duration-300 ${
                          location.pathname === item.url
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 shadow-sm border border-red-500/30'
                            : 'text-red-100 hover:text-white hover:bg-red-700/50'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 lg:gap-4 px-2 py-2 lg:px-4 lg:py-3">
                          <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                            location.pathname === item.url ? 'text-red-300' : 'text-red-300 group-hover:text-red-200'
                          }`} />
                          <div className="flex-1 min-w-0 hidden lg:block">
                            <div className="font-semibold text-sm">{item.title}</div>
                            <div className="text-xs opacity-75 truncate">{item.description}</div>
                          </div>
                          <div className="lg:hidden">
                            <div className="font-semibold text-xs">{item.title}</div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-red-700/50 p-2 lg:p-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full rounded-lg transition-colors hover:bg-red-700/50">
                  <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-red-400/30">
                      {user.profile_picture_url ? (
                        <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 hidden lg:block text-left">
                      <p className="font-semibold text-red-100 text-sm truncate capitalize">{user.name}</p>
                      <p className="text-xs text-red-300 truncate">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Admin Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Go to Main App</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate('/admin/login')}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Sign In</span>
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="mobile-nav md:static bg-white/90 backdrop-blur-sm border-b border-red-200/60 px-3 md:px-6 py-2 flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-red-100 p-1.5 rounded-lg transition-colors duration-200 -ml-1 md:hidden" />
              <div className="hidden md:block">
                <Logo />
              </div>
            </div>

            <div className="md:hidden">
              <Logo />
            </div>

            {user ? (
              <Link to="/admin/profile">
                <div className="w-9 h-9 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center ring-2 ring-red-400/30 hover:ring-red-400/50 transition-all cursor-pointer">
                  {user.profile_picture_url ? (
                    <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </Link>
            ) : (
              <Button size="sm" onClick={() => navigate('/admin/login')}>Sign In</Button>
            )}
          </header>

          <div className="flex-1 overflow-auto pt-14 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
