import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, Activity, TrendingUp, User } from "lucide-react";
import { motion } from "motion/react";
import { scaleIcon } from "@/app/utils/motion";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/patient" },
  { id: "tracking", label: "Track", icon: Activity, path: "/patient/tracking" },
  { id: "trends", label: "Trends", icon: TrendingUp, path: "/patient/trends" },
  { id: "profile", label: "Profile", icon: User, path: "/patient/profile" },
];

export default function PatientLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.find((tab) => tab.path === location.pathname)?.id || "home";

  return (
    <div className="min-h-screen bg-[var(--bg-0)] flex flex-col">
      {/* Main content */}
      <div className="flex-1 overflow-auto pb-[84px]">
        <Outlet />
      </div>

      {/* Bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[84px] bg-[var(--surface-1)] border-t border-[var(--border-1)] backdrop-blur-lg bg-opacity-95">
        <div className="max-w-[390px] mx-auto h-full flex items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center min-w-[60px] h-[60px] relative"
                {...scaleIcon}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-[16px] bg-[var(--accent-2)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10 mb-1">
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? "text-[var(--accent-1)]" : "text-[var(--text-2)]"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 text-[12px] leading-[16px] font-medium transition-colors ${
                    isActive ? "text-[var(--accent-1)]" : "text-[var(--text-2)]"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}