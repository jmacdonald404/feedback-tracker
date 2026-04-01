import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, ThumbsUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Feedback Tracker
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Help us improve by submitting bug reports, feature requests, and suggestions.
          Vote and comment on ideas that matter to you.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/submit">
            <Button size="lg">
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </Link>
          <Link href="/feedback">
            <Button variant="outline" size="lg">
              <MessageSquare className="h-4 w-4" />
              Browse Feedback
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-3">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <Send className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">Submit</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Report bugs, request features, or suggest improvements. No account required.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <ThumbsUp className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">Vote</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Upvote the feedback that matters most to you so we know what to prioritize.
          </p>
        </div>
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            <MessageSquare className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">Discuss</h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Comment on posts to add context, share workarounds, or refine ideas.
          </p>
        </div>
      </div>
    </div>
  );
}
