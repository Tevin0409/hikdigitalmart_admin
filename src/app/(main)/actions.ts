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
  createProductMutation,
  getAllUsersQuery,
  getUserRegistrationsReport,
  getVerifiedUsersReport,
  getSalesSummaryReport,
  getOrderStatusReport,
  getTopProductsReport,
  getLowInStockReport,
  getWishlistsTrendsReport,
  getTechnicianRegistrationReport,
  getAllRoles,
  registerMutation,
  getTechnicianQuestionnaires,
  getShopOwnerQuestionnaires,
  approveTechnicianMutation,
  approveShopOwnersMutation,
  getAllReviews,
  respondReview,
} from "@/lib/api";
import { revalidatePath } from "next/cache";
import { ProductFormSchema, ProductPayload } from "./_components/newProduct";

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
    // // console.log(categoryResponse);

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
    // // console.log("res", response);

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
    // // console.log("res", response);

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
    // // console.log("res", res.data);
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
      // intentionally omit data to keep type expectations
    };
  }
}

export async function createProduct(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const subCategoryId = formData.get("subCategoryId") as string;
    const defaultPrice = parseFloat(formData.get("defaultPrice") as string);
    const models = JSON.parse(
      formData.get("models") as string
    ) as ProductPayload["productData"]["models"];

    const rawPayload: ProductPayload = {
      productData: { name, subCategoryId, defaultPrice, models },
    };

    const parsed = ProductFormSchema.safeParse(rawPayload);
    if (!parsed.success) {
      // Convert formData to a simpler record for displaying errors
      const entries = Object.fromEntries(formData.entries());
      return {
        success: false,
        message: "Please fix the errors in the form",
        inputs: entries,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await createProductMutation(parsed.data);
    // On success, preserve simple record
    const entries = Object.fromEntries(formData.entries());
    return {
      success: true,
      message: "Product created successfully",
      inputs: entries,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "An unexpected error occurred",
      inputs: prevState.inputs,
    };
  }
}

export async function getCategories(): Promise<FetchResponse> {
  try {
    const res = await getAllCategoriesQuery();
    // console.log("res", res.data);
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
    // // console.log("res", res.data);
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
    // console.log(subCategoryResponse);

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

/**
 * Start Admin User Actions
 */

export async function getAllUsers({
  page = 1,
  limit = 10,
  searchTerm,
  roleId,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
  roleId?: string;
}): Promise<UsersFetchResponse> {
  try {
    const res = await getAllUsersQuery({
      page,
      limit,
      searchTerm,
      roleId,
    });

    return {
      success: true,
      message: "Users fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: "Failed to fetch users",
      data: null,
    };
  }
}

export async function getAllTechnicianQuestionnaires({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}): Promise<UsersFetchResponse> {
  try {
    const res = await getTechnicianQuestionnaires({
      page,
      limit,
      searchTerm,
    });

    return {
      success: true,
      message: "Technicians fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return {
      success: false,
      message: "Failed to fetch technicians",
      data: null,
    };
  }
}

export async function getAllShopOwnerQuestionnaires({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}): Promise<UsersFetchResponse> {
  try {
    const res = await getShopOwnerQuestionnaires({
      page,
      limit,
      searchTerm,
    });

    return {
      success: true,
      message: "Shop owners fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching shop owners:", error);
    return {
      success: false,
      message: "Failed to fetch shop owners",
      data: null,
    };
  }
}

/**
 * Start Admin Reports
 */

export async function userRegistrationsReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getUserRegistrationsReport();

    return {
      success: true,
      message: "Users Registration report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching user registration report:", error);
    return {
      success: false,
      message: "Failed to fetch user registration report",
      data: null,
    };
  }
}
export async function verifiedUsersReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getVerifiedUsersReport();

    return {
      success: true,
      message: "Verified Users report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Verified Users report:", error);
    return {
      success: false,
      message: "Failed to fetch Verified Users report",
      data: null,
    };
  }
}
export async function salesSummaryReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getSalesSummaryReport();

    return {
      success: true,
      message: "Sales Summary report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Sales Summary report:", error);
    return {
      success: false,
      message: "Failed to fetch Sales Summary report",
      data: null,
    };
  }
}
export async function orderStatusReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getOrderStatusReport();

    return {
      success: true,
      message: "Order Status report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Order Status Report:", error);
    return {
      success: false,
      message: "Failed to fetch Order Status Report",
      data: null,
    };
  }
}
export async function topProductsReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getTopProductsReport();

    return {
      success: true,
      message: "Top Products Report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Top Products Report:", error);
    return {
      success: false,
      message: "Failed to fetch Top Products Report",
      data: null,
    };
  }
}
export async function lowInStockReport(
  quantity: number
): Promise<ReportsFetchResponse> {
  try {
    const res = await getLowInStockReport({ quantity: quantity });

    return {
      success: true,
      message: "Low In Stock Report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Low In Stock Report:", error);
    return {
      success: false,
      message: "Failed to fetch Low In Stock Report",
      data: null,
    };
  }
}
export async function wishlistsTrendsReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getWishlistsTrendsReport();

    return {
      success: true,
      message: "Wishlists Trends Report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Wishlists Trends Report:", error);
    return {
      success: false,
      message: "Failed to fetch Wishlists Trends Report",
      data: null,
    };
  }
}
export async function technicianRegistrationReport(): Promise<ReportsFetchResponse> {
  try {
    const res = await getTechnicianRegistrationReport();

    return {
      success: true,
      message: "Technician Registration Report fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching Technician Registration Report:", error);
    return {
      success: false,
      message: "Failed to fetch Technician Registration Report",
      data: null,
    };
  }
}

export async function getAllRolesAction(): Promise<UsersFetchResponse> {
  try {
    const res = await getAllRoles();

    return {
      success: true,
      message: "Roles fetched successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to user roles",
      data: null,
    };
  }
}

export async function createUserAction(
  data: RegisterData
): Promise<UsersFetchResponse> {
  try {
    const res = await registerMutation(data);

    return {
      success: true,
      message: "User created successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create user",
      data: null,
    };
  }
}

export async function updateUserAction(
  id: string,
  data: UserInfoData
): Promise<UsersFetchResponse> {
  try {
    const res = await changeUserInfoMutation(id, data);

    return {
      success: true,
      message: "User updated successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update user",
      data: null,
    };
  }
}
export async function approveTechnician (id:string):Promise<UsersFetchResponse>{
  try {
    const res = await approveTechnicianMutation(id);

    return {
      success: true,
      message: "Technician approved successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Technician update failed",
      data: null,
    };
  }
}

export async function approveShopOwners (id:string):Promise<UsersFetchResponse>{
  try {
    const res = await approveShopOwnersMutation(id);

    return {
      success: true,
      message: "Shop Owner approved successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Shop Owner update failed",
      data: null,
    };
  }
}

export async function getAllReviewsAction({
  page = 1,
  limit = 10,
  searchTerm,
}: {
  page: number;
  limit: number;
  searchTerm?: string;
}): Promise<UsersFetchResponse> {
  try {
    const res = await getAllReviews({
      page,
      limit,
      searchTerm,
    });

    return {
      success: true,
      message: "Reviews fetched successfully",
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching reviews owners:", error);
    return {
      success: false,
      message: "Failed to fetch review owners",
      data: null,
    };
  }
}


export async function RespondToReview (id:string,message:string):Promise<UsersFetchResponse>{
  try {
    const res = await respondReview(id,message);

    return {
      success: true,
      message: "Responded successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Respond failed update failed",
      data: null,
    };
  }
}