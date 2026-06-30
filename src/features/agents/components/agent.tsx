"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { Plus, Bot, Shield, User, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Agents() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await client.api.rpc.agents.$get();
      if (!res.ok) throw new Error("Failed to load agents platform assets");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center p-6">
        <AlertCircle className="size-10 text-destructive" />
        <h3 className="text-lg font-semibold">Failed to fetch environment state</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          An error occurred while communicating with the remote Hono RPC node.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 select-none max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-x-2">
            <Bot className="size-6 text-primary" />
            AI Interrogator Pools
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure, manage, and scale specialized assessment environments.
          </p>
        </div>
        <Button asChild className="shadow-sm">
          <Link href="/agents/create" className="gap-x-2">
            <Plus className="size-4" />
            Deploy New Agent
          </Link>
        </Button>
      </div>

      {data?.data && data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl h-[40vh] p-8 text-center bg-card/30">
          <Bot className="size-12 text-muted-foreground/60 stroke-[1.5]" />
          <h3 className="text-lg font-medium mt-4">No agents active</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            Get started by spinning up your first custom specialized technical evaluator bot.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map((agent: any) => (
            <Card key={agent.id} className="bg-card hover:bg-accent/20 border-border transition-all duration-200 flex flex-col justify-between group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-x-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold tracking-tight text-foreground line-clamp-1">
                      {agent.name || "System Design Expert"}
                    </CardTitle>
                    <CardDescription className="text-xs font-mono text-muted-foreground/80 flex items-center gap-x-1.5">
                      <Shield className="size-3" />
                      ID: {agent.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize text-[10px] font-semibold">
                    {agent.role || "Evaluator"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {agent.prompt || "No specialization prompt parameter declared for this context."}
                </p>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/65 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-x-1.5 font-medium">
                  <User className="size-3.5" />
                  <span className="truncate max-w-[100px]">Owner ID: {agent.userId?.slice(0, 6) || "System"}</span>
                </div>
                <Button variant="ghost" size="sm" asChild className="h-8 gap-x-1 px-2.5 text-xs text-muted-foreground hover:text-foreground">
                  <Link href={`/sandbox/${agent.id}`}>
                    Launch Room
                    <ExternalLink className="size-3 ml-0.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}