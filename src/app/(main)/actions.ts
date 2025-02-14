"use server";
import { AxiosError } from "axios";
import z from "zod";
import {
  ProductFormSchema,
  CategoryFormSchema,
  SubcategoryFormSchema,
} from "@/app/_lib/definitions";
import {
  createProductMutation,
  createCategoryMutation,
  createSubcategoryMutation,
} from "@/lib/api";

async function validateAndPost<T>(
  schema: z.ZodSchema<T>,
  rawData: unknown,
  mutation: (data: T) => Promise<unknown>
) {
  const validatedData = schema.safeParse(rawData);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Please fix the errors in the form",
      errors: validatedData.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }
  return await mutation(validatedData.data);
}

export async function createProduct(state: ActionResponse, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      subCategoryId: formData.get("subCategoryId"),
      defaultPrice: parseFloat(formData.get("defaultPrice") as string),
      models: JSON.parse(formData.get("models") as string),
    };
    return await validateAndPost(
      ProductFormSchema,
      rawData,
      createProductMutation
    );
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ error: { message: string } }>)?.response?.data
        ?.error?.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: state.inputs, // Retain previous inputs
    };
  }
}

export async function createCategory(
  state: ActionResponse,
  formData: FormData
) {
  try {
    const rawData = {
      name: formData.get("name"),
    };
    return await validateAndPost(
      CategoryFormSchema,
      rawData,
      createCategoryMutation
    );
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ error: { message: string } }>)?.response?.data
        ?.error?.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: state.inputs, // Retain previous inputs
    };
  }
}

export async function createSubcategory(
  state: ActionResponse,
  formData: FormData
) {
  try {
    const rawData = {
      name: formData.get("name"),
      categoryId: formData.get("categoryId"),
    };
    return await validateAndPost(
      SubcategoryFormSchema,
      rawData,
      createSubcategoryMutation
    );
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ error: { message: string } }>)?.response?.data
        ?.error?.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: state.inputs, // Retain previous inputs
    };
  }
}
