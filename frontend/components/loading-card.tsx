import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function LoadingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Index</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[300px] w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
}
