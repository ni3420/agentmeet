"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  User, 
  LogOut, 
  Bell, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileResponsiveSideBar from "./mobile-responsive-sidebar";

interface NavLinkItem {
  label: string;
  href: string;
  isNew?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "AI Agents", href: "/agents", isNew: true },
  { label: "Analytics", href: "/analytics" },
  { label: "Documentation", href: "/docs" },
];

const MOCK_USER = {
  name: "Kuldeep Saini",
  email: "kuldeep.saini@architect.io",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
};

export const NavBar = () => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 w-full h-16 border-b border-border bg-background/85 backdrop-blur-md z-50 select-none px-3 sm:px-6 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <MobileResponsiveSideBar />

          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20 shrink-0">
            <Sparkles size={15} className="animate-pulse" />
          </div>
          <span className="font-bold text-sm tracking-tight font-sans text-foreground">
            agent-meet
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground hidden sm:inline-flex rounded-lg h-9 w-9"
        >
          <HelpCircle size={18} />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground relative rounded-lg h-9 w-9"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full border border-border/80 p-0.5 transition-transform duration-200 hover:scale-105 cursor-pointer outline-none shrink-0">
              <Avatar className="w-8 h-8 rounded-full border border-neutral-200/40 dark:border-neutral-800/40">
                <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} className="object-cover" />
                <AvatarFallback className="bg-accent text-muted-foreground text-xs font-bold">
                  <User size={13} />
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            sideOffset={8}
            className="w-56 bg-card text-card-foreground border border-border rounded-xl p-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150"
          >
            <DropdownMenuLabel className="px-2.5 py-2 flex flex-col justify-center">
              <span className="text-xs font-bold text-foreground leading-tight truncate">{MOCK_USER.name}</span>
              <span className="text-[10px] text-muted-foreground/80 mt-0.5 leading-tight truncate">{MOCK_USER.email}</span>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-border/60 mx-1 my-1" />
            
            <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground focus:bg-accent focus:text-foreground cursor-pointer transition-colors">
              <User size={14} className="opacity-70" /> Profile Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-lg text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors">
              <LogOut size={14} className="opacity-80" /> Log Out Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-16 left-0 right-0 border-b border-border bg-background flex flex-col p-3 gap-1 md:hidden shadow-xl z-50"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  setActiveTab(link.label);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 h-10 rounded-lg text-sm font-medium transition-colors text-left",
                  activeTab === link.label ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                )}
              >
                <span>{link.label}</span>
                {link.isNew && (
                  <span className="text-[9px] px-1.5 py-0.5 font-bold rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    New
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;