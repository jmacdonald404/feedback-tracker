"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MessageSquare, LogIn, LogOut, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <MessageSquare className="h-5 w-5" />
            Feedback Tracker
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/feedback" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              Browse
            </Link>
            <Link href="/submit" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
              Submit Feedback
            </Link>
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          ) : session ? (
            <>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
              )}
              <span className="text-sm">{session.user.name}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => signIn()}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 px-4 py-3 md:hidden dark:border-neutral-800">
          <div className="flex flex-col gap-3">
            <Link href="/feedback" className="text-sm" onClick={() => setMobileOpen(false)}>
              Browse
            </Link>
            <Link href="/submit" className="text-sm" onClick={() => setMobileOpen(false)}>
              Submit Feedback
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            )}
            <hr className="border-neutral-200 dark:border-neutral-800" />
            {session ? (
              <button className="text-sm text-left" onClick={() => signOut()}>
                Sign out ({session.user.name})
              </button>
            ) : (
              <button className="text-sm text-left" onClick={() => signIn()}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
