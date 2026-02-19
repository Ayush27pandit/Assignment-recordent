import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, Database, Upload, BarChart3, History } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link, useLocation } from "react-router-dom";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: "Manage Buyers",
      icon: <Database size={20} />,
      path: "/dashboard/buyers",
    },
    {
      label: "Import Data",
      icon: <Upload size={20} />,
      path: "/dashboard/import",
    },
    {
      label: "Upload History",
      icon: <History size={20} />,
      path: "/dashboard/history",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard/history") {
      return location.pathname.startsWith("/dashboard/history");
    }
    return location.pathname === path;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Import Data";
    if (path.startsWith("/dashboard/history/") && path !== "/dashboard/history") {
      return "Upload Details";
    }
    return navItems.find(item => path === item.path)?.label || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={18} />
            </div>
            <span className="font-bold tracking-tight text-gray-900">
              BuyerPortal
            </span>
          </Link>
        </div>

<nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-primary/5 text-primary"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
<header className="h-20 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {getPageTitle()}
          </h2>
          <div className="flex items-center space-x-4"></div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
