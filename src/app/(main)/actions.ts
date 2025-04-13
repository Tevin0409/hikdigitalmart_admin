"use server";
import { AxiosError } from "axios";
import z from "zod";
import {
  ChangePasswordFormSchema,
  CategoryFormSchema,
  SubcategoryFormSchema,
  UserInfoFormSchema,
} from "@/app/_lib/definitions";
import {
  getDashboardSummaryQuery,
  changePasswordMutation,
  createCategoryMutation,
  bulkUploadProductsMutation,
  createSubcategoryMutation,
  getAllCategoriesQuery,
  getAllSubcategoriesQuery,
  getAllProductsQuery,
  uploadProductImagesMutation,
  changeUserInfoMutation,
  getAllSalesQuery,
} from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Start Auth Actions
 */
export async function changePassword(
  state: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: ChangePasswordData = {
      oldPassword: formData.get("oldPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmNewPassword: formData.get("confirmNewPassword") as string,
    };

    const validatedData = ChangePasswordFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        inputs: rawData,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const changePasswordResponse = await changePasswordMutation(
      validatedData.data
    );

    return {
      success: true,
      message:
        changePasswordResponse?.data?.message ||
        "Password changed successfully",
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

export async function changeUserInfo(
  state: ActionResponse,
  formData: FormData,
  id: string
): Promise<ActionResponse> {
  try {
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    };

    const validatedData = UserInfoFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        inputs: rawData,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    const userInfoResponse = await changeUserInfoMutation(
      id,
      validatedData.data
    );

    return {
      success: true,
      message: "User info updated successfully",
      inputs: rawData,
      data: userInfoResponse.data,
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

/**
 * Start Dashboard Actions
 */
export async function getDashboardSummary(): Promise<FetchResponse> {
  try {
    const res = await getDashboardSummaryQuery();

    return {
      success: true,
      message: "Dashboard summary fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return {
      success: false,
      message: "Failed to fetch dashboard summary",
      data: null,
    };
  }
}

/**
 * End Dashboard Actions
 
 */
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

/**
 * Start Orders Actions
 */
export async function getAllOrders(
  params: OrderQueryParams
): Promise<FetchResponse> {
  try {
    // Replace this with your actual API call
    const res = await getAllSalesQuery({
      ...params,
    });

    return {
      success: true,
      message: "Orders fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      message: "Failed to fetch orders",
      data: null,
    };
  }
}

/**
 * End Orders Actions
 */
