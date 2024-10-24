import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  TransactionFormSchema,
  transactionFormSchema,
} from "@/types/form-schema";
import { createTransaction } from "@/lib/request";
import { ErrorResponse } from "@/types/error-response";
import { useRouter } from "next/navigation";

interface TransactionDialogProps {
  ticker?: string;
  size?: "default" | "icon";
  className?: string;
}

export function TransactionDialog({
  ticker,
  size = "default",
  className,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      transactionType: ticker ? "buy" : "deposit",
      ticker: ticker || "",
      date: new Date(),
      price: 0,
      shares: 0,
    },
  });

  const watchTransactionType = form.watch("transactionType");

  useEffect(() => {
    if (
      watchTransactionType === "deposit" ||
      watchTransactionType === "withdraw"
    ) {
      form.setValue("ticker", "");
      form.setValue("shares", undefined);
    }
  }, [watchTransactionType, form]);

  async function onSubmit(values: TransactionFormSchema) {
    const toastId = "transactionToast";
    toast.loading("Making transaction...", { id: toastId });

    try {
      const response = await createTransaction(values);

      if (response.ok) {
        router.refresh();
        toast.success("Transaction completed.", { id: toastId });
        setOpen(false);
      } else {
        const result: ErrorResponse = await response.json();
        toast.error(result.detail, { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {size === "default" ? (
          <Button
            variant="default"
            size="icon"
            className={cn(
              "group transition-all duration-300 ease-in-out hover:w-40",
              className,
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden font-semibold group-hover:inline-flex">
              Add Transaction
            </span>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className={className}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your transaction here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ticker ? (
                        <>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdraw">Withdrawal</SelectItem>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of transaction you want to make.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(watchTransactionType === "buy" ||
              watchTransactionType === "sell") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticker</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="AAPL"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value.toUpperCase());
                          }}
                          disabled={!!ticker}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shares</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          min={0}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the date of the transaction.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {watchTransactionType === "buy" ||
                    watchTransactionType === "sell"
                      ? "Price"
                      : "Amount"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      min={0}
                      step={0.01}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {watchTransactionType === "buy" ||
                    watchTransactionType === "sell"
                      ? "Enter the price per share."
                      : "Enter the transaction amount."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
