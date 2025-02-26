"use client";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { createCategory } from "../actions";

const initialState: ActionResponse = {
  success: false,
  message: "",
  errors: {},
  inputs: { name: "" },
};
export function CategoryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Category>({
    name: "",
  });
  const [state, dispatch, isPending] = useActionState(
    (
      prevState: ActionResponse,
      formData: FormData
    ): Promise<ActionResponse> => {
      return createCategory(prevState, formData);
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      router.push("/dashboard/product");
    }
  }, [state.success, state.message, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form action={dispatch} className={cn("flex flex-col gap-6")}>
      {/* <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold">Create Category</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your category name below to create a new category
        </p>
      </div> */}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">What is the name of your category?</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.category[0]}</p>
          )}
        </div>

        {state?.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            {state.success && <CheckCircle2 className="h-4 w-4" />}
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
