"use client";

import { motion } from "framer-motion";
import { Home, Compass, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "navigator", label: "Navigator", icon: Compass, path: "/navigator" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-black/90 backdrop-blur-lg border-t border-gray-800 px-6 pb-safe">
      <div className="max-w-md mx-auto h-full flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === "/" && pathname !== "/navigator" && pathname !== "/"); 
          // Default to home if on an unknown route, or check strict equality
          const isStrictActive = pathname === item.path;
          
          return (
            <Link href={item.path} key={item.id} className="flex-1 h-full">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium"
              >
                <div
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isStrictActive ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  )}
                >
                  <Icon size={20} />
                </div>
                <span className={cn(
                  "transition-colors",
                  isStrictActive ? "text-emerald-400" : "text-gray-500"
                )}>
                  {item.label}
                </span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
