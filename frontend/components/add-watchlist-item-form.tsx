import { addToWatchList } from "@/lib/request";
import { ErrorResponse } from "@/types/error-response";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AddWatchlistItemForm({ onSuccess }: { onSuccess: () => void }) {
  const [newTicker, setNewTicker] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = "watchlistToast";
    toast.loading("Adding to your watchlist...", { id: toastId });

    try {
      const response = await addToWatchList(newTicker);

      if (response.ok) {
        onSuccess();
        toast.success("Succesfully added.", { id: toastId });
        setNewTicker("");
      } else {
        const result: ErrorResponse = await response.json();
        toast.error(result.detail, { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Enter stock symbol"
        value={newTicker}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          setNewTicker(e.target.value);
        }}
        required
      />
      <Button type="submit">
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </form>
  );
}
