import { z } from "zod";

export const transactionFormSchema = z.object({
  transactionType: z.enum(["deposit", "withdraw", "buy", "sell"]),
  ticker: z.union([
    z.string().toUpperCase().min(1, "Ticker is required").optional(),
    z.literal("").transform(() => undefined),
  ]),
  date: z.date({
    required_error: "Transaction date is required",
  }),
  price: z.number().positive("Amount must be positive"),
  shares: z
    .number()
    .int()
    .positive("Number of shares must be a positive integer")
    .optional(),
});

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;
