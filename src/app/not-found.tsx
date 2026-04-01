import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-neutral-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
        <Link href="/feedback">
          <Button>Browse Feedback</Button>
        </Link>
      </div>
    </div>
  );
}
