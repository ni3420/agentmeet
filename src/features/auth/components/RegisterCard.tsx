"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { OctagonAlert, Loader } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {registerSchema} from "../schema"
type RegisterCardFormValues = z.infer<typeof registerSchema>;

const RegisterCard = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCardFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterCardFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      
      console.log(values);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.log(err,"err")
    } finally {
      setIsPending(false);
    }
  };

  const onSocialSignIn = (provider: "google" | "github") => {
    setIsPending(true);
    console.log(`Signing up with ${provider}`);
  };

  return (
    <Card className="overflow-hidden p-0 shadow-xl w-full max-w-sm md:max-w-3xl">
      <CardContent className="grid p-0 md:grid-cols-2">
        
        <div className="p-6 md:p-8 space-y-4 bg-card">
          <div className="flex flex-col items-center text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Create an Account</h1>
            <p className="text-sm text-muted-foreground">
              Get started with your AgentMeet account
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-none text-destructive">
              <OctagonAlert className="size-4 text-destructive" />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Full Name
              </label>
              <Input 
                placeholder="John Doe" 
                type="text" 
                disabled={isPending}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Email
              </label>
              <Input 
                placeholder="name@example.com" 
                type="email" 
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <Input 
                placeholder="••••••••" 
                type="password" 
                disabled={isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <Input 
                placeholder="••••••••" 
                type="password" 
                disabled={isPending}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isPending}>
              {isPending ? <Loader className="size-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>

          <div className="relative text-center text-xs uppercase after:absolute after:inset-x-0 after:top-1/2 after:-z-10 after:flex after:items-center after:border-t after:border-border">
            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full" onClick={() => onSocialSignIn("google")} disabled={isPending}>
              <FaGoogle className="mr-2" /> Google
            </Button>
            <Button variant="outline" type="button" className="w-full" onClick={() => onSocialSignIn("github")} disabled={isPending}>
              <FaGithub className="mr-2" /> GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline underline-offset-4 font-medium text-foreground hover:text-primary">
              Login
            </Link>
          </div>
        </div>

        <div className="relative hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-sidebar via-sidebar to-primary/20 text-white p-8">
          <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 backdrop-blur-md">
              <Image src="/logo.svg" width={64} height={64} alt="AgentMeet Logo" className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">AgentMeet</h2>
            <p className="text-sm text-zinc-400 text-balance">
              Experience cinematic AI real-time video calls, get persistent chat timelines, and automate actionable summaries seamlessly.
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RegisterCard;