import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, MessageSquare } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Thank you!</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        Your feedback has been submitted and is pending review. Our team will
        review it shortly and publish it to the public board if approved.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/submit">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Submit Another
          </Button>
        </Link>
        <Link href="/feedback">
          <Button>
            <MessageSquare className="h-4 w-4" />
            Browse Feedback
          </Button>
        </Link>
      </div>
    </div>
  );
}
