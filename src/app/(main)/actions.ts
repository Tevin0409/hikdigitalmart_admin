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
  bulkUploadProductsMutation,
  createSubcategoryMutation,
  getAllCategoriesQuery,
  getAllSubcategoriesQuery,
  getAllProductsQuery,
  uploadProductImagesMutation,
} from "@/lib/api";
import { revalidatePath } from "next/cache";

// export async function createProduct(state: ActionResponse, formData: FormData) {
//   try {
//     const rawData = {
//       name: formData.get("name"),
//       subCategoryId: formData.get("subCategoryId"),
//       defaultPrice: parseFloat(formData.get("defaultPrice") as string),
//       models: JSON.parse(formData.get("models") as string),
//     };
//     return await validateAndPost(
//       ProductFormSchema,
//       rawData,
//       createProductMutation
//     );
//   } catch (error) {
//     const errorMessage =
//       (error as AxiosError<{ error: { message: string } }>)?.response?.data
//         ?.error?.message || "An unexpected error occurred";

//     return {
//       success: false,
//       message: errorMessage,
//       inputs: state.inputs, // Retain previous inputs
//     };
//   }
// }

export async function createCategory(
  state: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: Category = {
      name: formData.get("name") as string,
    };

    const validatedData = CategoryFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        inputs: rawData,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const categoryResponse = await createCategoryMutation(validatedData.data);
    console.log(categoryResponse);

    return {
      success: true,
      message: "Category created successfully",
      inputs: rawData,
    };
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

export async function bulkUploadProducts(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const response = await bulkUploadProductsMutation(formData);
    console.log("res", response);

    return {
      success: true,
      message: "Products uploaded successfully",
      inputs: {
        file: formData.get("file")!,
      }, // Retain previous inputs
    };
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ error: { message: string } }>)?.response?.data
        ?.error?.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: {
        file: formData.get("file")!,
      },
    };
  }
}

export async function uploadProductImages(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const response = await uploadProductImagesMutation(formData);
    console.log("res", response);

    return {
      success: true,
      message: "Images uploaded successfully",
      inputs: {
        file: formData.get("file")!,
      }, // Retain previous inputs
    };
  } catch (error) {
    const errorMessage =
      (error as AxiosError<{ error: { message: string } }>)?.response?.data
        ?.error?.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: {
        file: formData.get("file")!,
      },
    };
  }
}

export async function getProducts(
  page = 1,
  limit = 10
): Promise<FetchResponse> {
  try {
    const res = await getAllProductsQuery({
      page,
      limit,
    });
    console.log("res", res.data);
    return {
      success: true,
      message: "Products fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Failed to fetch products",
      data: null,
    };
  }
}
export async function getCategories(): Promise<FetchResponse> {
  try {
    const res = await getAllCategoriesQuery();
    console.log("res", res.data);
    return {
      success: true,
      message: "Categories fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "Failed to fetch categories",
      data: null,
    };
  }
}
export async function getSubCategories(): Promise<FetchResponse> {
  try {
    const res = await getAllSubcategoriesQuery();
    console.log("res", res.data);
    return {
      success: true,
      message: "Sub Categories fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "Failed to fetch categories",
      data: null,
    };
  }
}

export async function revalidateProducts() {
  revalidatePath("/product"); // Adjust path as needed
}

export async function createSubCategory(
  state: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      name: formData.get("name") as string,
      categoryId: formData.get("categoryId") as string,
    };

    const validatedData = SubcategoryFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        inputs: rawData,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const subCategoryResponse = await createSubcategoryMutation(
      validatedData.data
    );
    console.log(subCategoryResponse);

    return {
      success: true,
      message: "Subcategory created successfully",
      inputs: rawData,
    };
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

// export async function createSubcategory(
//   state: ActionResponse,
//   formData: FormData
// ) {
//   try {
//     const rawData = {
//       name: formData.get("name"),
//       categoryId: formData.get("categoryId"),
//     };
//     return await validateAndPost(
//       SubcategoryFormSchema,
//       rawData,
//       createSubcategoryMutation
//     );
//   } catch (error) {
//     const errorMessage =
//       (error as AxiosError<{ error: { message: string } }>)?.response?.data
//         ?.error?.message || "An unexpected error occurred";

//     return {
//       success: false,
//       message: errorMessage,
//       inputs: state.inputs, // Retain previous inputs
//     };
//   }
// }
