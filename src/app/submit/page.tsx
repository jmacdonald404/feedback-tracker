"use client";

import { useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { submitFeedback, type SubmitFeedbackResult } from "@/lib/actions/feedback";
import { Send } from "lucide-react";

function SubmitForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (_prev: SubmitFeedbackResult | null, formData: FormData) => {
      const result = await submitFeedback(formData);
      if (result.success) {
        router.push("/submit/confirmation");
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {state && !state.success && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={200}
          placeholder="Brief summary of your feedback"
        />
        <p className="text-xs text-neutral-500">3-200 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select id="category" name="category" required>
          <option value="">Select a category...</option>
          <option value="BUG">Bug Report</option>
          <option value="FEATURE">Feature Request</option>
          <option value="IMPROVEMENT">Improvement</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Describe the bug, feature, or improvement in detail..."
        />
        <p className="text-xs text-neutral-500">10-5000 characters</p>
      </div>

      {!session && (
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email (optional)</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="your@email.com — so we can follow up"
          />
          <p className="text-xs text-neutral-500">
            Sign in to automatically link this to your account
          </p>
        </div>
      )}

      {/* Honeypot — hidden from real users */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (
          "Submitting..."
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Feedback
          </>
        )}
      </Button>
    </form>
  );
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit Feedback</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Report a bug, request a feature, or suggest an improvement. No account
          required — your submission will be reviewed by our team.
        </p>
      </div>
      <SubmitForm />
    </div>
  );
}
