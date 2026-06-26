"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Video, Bot, Star, CreditCard, LogOut, Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meetings",
    href: "/dashboard/meetings",
    icon: Video,
  },
  {
    label: "AI Agents",
    href: "/dashboard/agents",
    icon: Bot,
  },
];

const MobileResponsiveSideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const onSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden shrink-0">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border p-0 flex flex-col justify-between">
        
        <div className="flex flex-col flex-1 min-h-0">
          <SheetHeader className="p-4 border-b border-sidebar-border/40 text-left shrink-0">
            <SheetTitle className="flex flex-row items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <Image src="/logo.svg" width={24} height={24} alt="AgentMeet Logo" />
              </div>
              <span className="text-lg font-bold tracking-tight text-sidebar-accent-foreground">
                AgentMeet
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="px-2 py-4 flex-1">
            <Command className="bg-transparent text-sidebar-foreground overflow-visible">
              <CommandList className="max-h-none overflow-visible">
                <CommandGroup>
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <CommandItem
                        key={item.href}
                        onSelect={() => router.push(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer mb-1 border border-transparent data-[selected='true']:bg-sidebar-accent/40 data-[selected='true']:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/60 shadow-xs"
                            : "text-sidebar-foreground/75 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30"
                        )}
                      >
                        <item.icon className={cn("size-4 shrink-0 transition-colors", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
                        <span>{item.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                
                <CommandSeparator className="bg-sidebar-border/40 my-2 mx-1" />
                
                <CommandGroup>
                  <CommandItem
                    onSelect={() => router.push("/dashboard/billing")}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border border-transparent data-[selected='true']:bg-sidebar-accent/40 data-[selected='true']:text-sidebar-accent-foreground",
                      pathname === "/dashboard/billing"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/60 shadow-xs"
                        : "text-sidebar-foreground/75 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/30"
                    )}
                  >
                    <Star className="size-4 text-amber-500 shrink-0 fill-amber-500/10 animate-pulse" />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">Upgrade Plan</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        <div className="p-4 border-t border-sidebar-border/40 bg-sidebar/30 backdrop-blur-xs">
          {!isPending && session?.user && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="rounded-xl border border-sidebar-border bg-sidebar-accent/20 p-2.5 w-full flex items-center justify-between gap-2 hover:bg-sidebar-accent/40 overflow-hidden text-left transition-all duration-200 cursor-pointer group outline-none">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold truncate text-sidebar-accent-foreground group-hover:text-sidebar-accent-foreground">
                        {session.user.name}
                      </span>
                      <span className="text-xs text-sidebar-foreground/60 truncate">
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                align="end" 
                side="top" 
                className="w-60 border-sidebar-border bg-sidebar text-sidebar-foreground mb-2 shadow-xl p-1.5 rounded-xl"
              >
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
                  <span className="font-semibold text-sidebar-accent-foreground truncate">{session.user.name}</span>
                  <span className="text-xs font-normal text-sidebar-foreground/60 truncate">{session.user.email}</span>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-sidebar-border/40 mx-1" />
                
                <DropdownMenuItem asChild className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer rounded-lg py-2 px-2.5 transition-colors">
                  <Link href="/dashboard/billing" className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium">Billing</span>
                    <CreditCard className="size-3.5 opacity-60" />
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={onSignOut} 
                  className="focus:bg-destructive/10 focus:text-destructive text-destructive/90 cursor-pointer flex items-center justify-between rounded-lg py-2 px-2.5 transition-colors"
                >
                  <span className="text-xs font-medium">Log out</span>
                  <LogOut className="size-3.5 opacity-80" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default MobileResponsiveSideBar;