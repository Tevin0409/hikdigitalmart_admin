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
import { createSubCategory } from "../actions";
import { useFetchCategories } from "@/hooks/use-categories";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ActionResponse = {
  success: false,
  message: "",
  errors: {},
  inputs: { name: "" },
};

export function SubCategoryForm() {
  const router = useRouter();
  const { data: categories, isLoading, error } = useFetchCategories();

  const [formData, setFormData] = useState<Subcategory>({
    name: "",
    categoryId: "",
  });

  const [state, dispatch, isPending] = useActionState(
    (
      prevState: ActionResponse,
      formData: FormData
    ): Promise<ActionResponse> => {
      return createSubCategory(prevState, formData);
    },
    initialState
  );

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/dashboard/product");
    }
  }, [state.success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  return (
    <form
      action={(formData) => {
        if (!formData.get("categoryId")) {
          toast.error("Please select a category.");
          return;
        }
        console.log("Submitting data:", Object.fromEntries(formData));
        return dispatch(formData);
      }}
      className={cn("flex flex-col gap-6")}
    >
      <div className="grid gap-6">
        {/* Subcategory Name Input */}
        <div className="grid gap-2">
          <Label htmlFor="name">What is the name of your subcategory?</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {state.errors?.name && (
            <p className="text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Category Selection Dropdown */}
        <div className="grid gap-2">
          <Label htmlFor="categoryId">Select a category:</Label>
          <Select
            value={formData.categoryId}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading ? (
                  <SelectItem value="" disabled>
                    Loading...
                  </SelectItem>
                ) : error ? (
                  <SelectItem value="" disabled>
                    Error loading categories
                  </SelectItem>
                ) : categories?.data &&
                  Array.isArray(categories.data) &&
                  categories.data.length > 0 ? (
                  categories.data.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id!}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No categories found
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Hidden Input to Include categoryId in FormData */}
          <input type="hidden" name="categoryId" value={formData.categoryId} />

          {state.errors?.categoryId && (
            <p className="text-sm text-red-500">{state.errors.categoryId[0]}</p>
          )}
        </div>

        {/* Error / Success Message */}
        {state?.message && (
          <Alert variant={state.success ? "default" : "destructive"}>
            {state.success && <CheckCircle2 className="h-4 w-4" />}
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Please wait..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
