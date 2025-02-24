"use client";
import { useActionState, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

interface ReusableFormProps {
  title: string;
  fields: FormField[];
  action: (
    prevState: ActionResponse,
    formData: FormData
  ) => Promise<ActionResponse>;
  initialState?: ActionResponse;
  onSuccess?: () => void; // Optional callback for successful submission
}

const defaultState: ActionResponse = {
  success: false,
  message: "",
  errors: {},
  inputs: {},
};

function SelectBox({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Select name={name} onValueChange={onChange} value={value}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Reusable CheckBox Component */
function CheckBox({
  label,
  id,
  checked,
  onCheckedChange,
}: {
  label: string;
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
export function ReusableForm({
  title,
  fields,
  action,
  initialState = defaultState,
  onSuccess,
}: ReusableFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [state, dispatch, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      setFormData(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
      ); // Reset form
      onSuccess?.(); // Trigger optional success callback
    }
  }, [state.success, state.message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form action={dispatch} className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      {fields.map((field) => {
        // Render input for non-checkbox and non-select field types
        if (field.type !== "checkbox" && field.type !== "select") {
          return (
            <div key={field.name} className="grid gap-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
              />
              {state.errors?.[field.name] && (
                <p className="text-sm text-red-500">
                  {state.errors[field.name][0]}
                </p>
              )}
            </div>
          );
        }

        // Render checkbox if field type is checkbox
        // if (field.type === "checkbox") {
        //   return (
        //     <CheckBox
        //       key={field.name}
        //       label={field.label}
        //       id={field.name}
        //       checked={formData[field.name]=="true"}
        //       onCheckedChange={(checked) =>
        //         handleChange({ target: { name: field.name, value: `${checked}` } })
        //       } // Pass the updated value correctly
        //     />
        //   );
        //}

        // Render select if field type is select
        // if (field.type === "select") {
        //   return (
        //     <SelectBox
        //       key={field.name}
        //       label={field.label}
        //       name={field.name}
        //       options={field.options}
        //       value={formData[field.name]}
        //       onChange={(value) =>
        //         handleChange({ target: { name: field.name, value } })
        //       } // Pass value to handleChange
        //     />
        //   );
        // }
      })}
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success && <CheckCircle2 className="h-4 w-4" />}
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
