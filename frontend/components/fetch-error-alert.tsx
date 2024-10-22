import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function FetchErrorAlert({ error }: { error: string | null }) {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center p-4">
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Failed to load data. Please try again later."}
        </AlertDescription>
      </Alert>
    </div>
  );
}
