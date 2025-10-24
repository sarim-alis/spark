import React from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, BookOpen, User, LogOut, ShieldCheck, CreditCard } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/api/entities";
import { userAPI } from "@/services/api";


const adminNavigationItems = [
  { title: "Dashboard",     url: "/admin/dashboard",         icon: LayoutDashboard, description: "Overview"},
  { title: "Users",         url: "/admin/users",             icon: Users,           description: "Manage Users" },
  { title: "Courses",       url: "/admin/courses",           icon: BookOpen,        description: "All Courses"},
  { title: "Subscriptions", url: "/admin/subscriptions",     icon: Users,           description: "Manage Subscriptions" },
  { title: "Stripe",        url: "/admin/stripe",            icon: CreditCard,      description: "Stripe Keys" },
  // {
  //   title: "Reports",
  //   url: "/admin/reports",
  //   icon: BarChart3,
  //   description: "Analytics"
  // },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  //   description: "System Config"
  // },
];

const Logo = () => (
  <Link to="/admin/dashboard" className="flex items-center gap-2">
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-8 h-8 text-violet-400" />
      <span className="text-xl font-bold !text-[#a78bfa]">Admin Panel</span>
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
          --sidebar-background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          --accent-gold: #8b5cf6;
          --accent-gold-hover: #7c3aed;
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

        /* Global purple theme overrides for existing amber/orange utilities */

        /* Gradients */
        .from-amber-500 {
          --tw-gradient-from: #7c3aed var(--tw-gradient-from-position);
          --tw-gradient-to: rgb(124 58 237 / 0) var(--tw-gradient-to-position);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }
        .hover\\:from-amber-600:hover {
          --tw-gradient-from: #6d28d9 var(--tw-gradient-from-position);
          --tw-gradient-to: rgb(109 40 217 / 0) var(--tw-gradient-to-position);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }
        .from-amber-500\\/20 {
          --tw-gradient-from: rgb(124 58 237 / 0.2) var(--tw-gradient-from-position);
          --tw-gradient-to: rgb(124 58 237 / 0) var(--tw-gradient-to-position);
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
        }
        .to-orange-500 {
          --tw-gradient-to: #a78bfa var(--tw-gradient-to-position); /* violet-400 */
        }
        .hover\\:to-orange-600:hover {
          --tw-gradient-to: #7c3aed var(--tw-gradient-to-position); /* violet-600 */
        }
        .to-orange-500\\/20 {
          --tw-gradient-to: rgb(167 139 250 / 0.2) var(--tw-gradient-to-position);
        }

        /* Solid backgrounds */
        .bg-amber-500 { background-color: #8b5cf6 !important; }
        .bg-amber-600 { background-color: #7c3aed !important; }
        .hover\\:bg-amber-600:hover { background-color: #7c3aed !important; }
        .bg-amber-100 { background-color: #ede9fe !important; } /* violet-100 */

        /* Text colors */
        .text-amber-400 { color: #c4b5fd !important; } /* violet-300 */
        .text-amber-500 { color: #a78bfa !important; } /* violet-400 */
        .text-amber-600 { color: #7c3aed !important; } /* violet-600 */

        /* Icon fills (e.g., stars) */
        .fill-amber-400 { fill: #c4b5fd !important; color: #c4b5fd !important; }

        /* Borders and subtle variants */
        .border-amber-500 { border-color: #8b5cf6 !important; }
        .border-amber-500\\/30 { border-color: rgb(139 92 246 / 0.30) !important; }
      `}</style>

      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Sidebar className="border-r-0 shadow-2xl hidden md:flex" style={{background: "var(--sidebar-background)"}}>
          <SidebarHeader className="border-b border-slate-700/50 p-4 lg:p-6">
            <Logo />
          </SidebarHeader>

          <SidebarContent className="p-2 lg:p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 lg:px-3 py-3">
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
                            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-sm border border-amber-500/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 lg:gap-4 px-2 py-2 lg:px-4 lg:py-3">
                          <item.icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                            location.pathname === item.url ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-400'
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

          <SidebarFooter className="border-t border-slate-700/50 p-2 lg:p-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full rounded-lg transition-colors hover:bg-slate-700/50">
                  <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-violet-400/30">
                      {user.profile_picture_url ? (
                        <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 hidden lg:block text-left">
                      <p className="font-semibold text-slate-200 text-sm truncate capitalize">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
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
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                <span className="hidden lg:inline">Sign In</span>
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="mobile-nav md:static bg-white/90 backdrop-blur-sm border-b border-slate-200/60 px-3 md:px-6 py-2 flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-slate-100 p-1.5 rounded-lg transition-colors duration-200 -ml-1 md:hidden" />
              <div className="hidden md:block">
                <Logo />
              </div>
            </div>

            <div className="md:hidden">
              <Logo />
            </div>

            {user ? (
              <Link to="/admin/profile">
                <div className="w-9 h-9 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-violet-400/30 hover:ring-violet-400/50 transition-all cursor-pointer">
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
