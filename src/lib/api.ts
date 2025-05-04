"use server";
import { cookies } from "next/headers";
import API from "./axios-client";

// add interceptors here
API.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH
export const loginMutation = async (data: LoginData) =>
  await API.post("/auth/login", data);
export const registerMutation = async (data: RegisterData) =>
  await API.post("/user/create-user", data);
export const refreshAccessTokenMutation = async (data: RefreshData) =>
  await API.post("/auth/refresh", data);
export const forgotPasswordMutation = async (data: ForgotPasswordData) =>
  await API.post("/auth/forgot-password", data);
export const changePasswordMutation = async (data: ChangePasswordData) =>
  await API.post("/auth/change-password", data);
export const changeUserInfoMutation = async (id: string, data: UserInfoData) =>
  await API.put(`/admin/user/update-user/${id}`, data);

// DASHBOARD
export const getDashboardSummaryQuery = async () =>
  await API.get("/admin/dashboard");

// USERS

export const getAllUsersQuery = async (params: GetAllUsersParams = {}) => {
  const { page = 1, limit = 10, searchTerm, roleId } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchTerm ? { searchTerm } : {}),
    ...(roleId ? { roleId } : {}),
  }).toString();

  return await API.get(`/admin/user/get-all-users?${query}`);
};

export const getAllRoles = async () => await API.get(`admin/role`);

export const getUserByIdQuery = async (id: string) =>
  await API.get(`/user/get-user/${id}`);
export const getUserByEmailQuery = async (email: string) =>
  await API.get(`/user/get-user-by-email/${email}`);
export const updateUserMutation = async (id: string, data: object) =>
  await API.put(`/user/update-user/${id}`, data);

// SALES
export const getAllSalesQuery = async (params: OrderQueryParams) =>
  await API.get("/admin/product/orders", { params });

// PRODUCTS
export const getAllProductsQuery = async (params: ProductQueryParams) =>
  await API.get("/admin/product", { params });
export const createCategoryMutation = async (data: Category) =>
  await API.post("/admin/product/categories/create", data);
export const createSubcategoryMutation = async (data: object) =>
  await API.post("/admin/product/subcategories/create", data);
export const createProductMutation = async (data: object) =>
  await API.post("/product/create-product", data);
export const bulkUploadProductsMutation = async (data: object) => {
  await API.post("/admin/product/upload-xslx", data);
};
export const uploadProductImagesMutation = async (data: object) =>
  await API.post("/admin/product/add-images", data);
export const getProductByIdQuery = async (id: string) =>
  await API.get(`/product/by-id/${id}`);
export const getAllCategoriesQuery = async () =>
  await API.get("/admin/product/categories");

export const getAllSubcategoriesQuery = async () =>
  await API.get(`/admin/product/subcategories`);
export const getAllOrdersQuery = async () => await API.get(`/product/orders`);
export const bulkUploadProductImagesMutation = async (data: object) =>
  await API.post("/product/product/add-images", data);
export const setPrimaryImageMutation = async (data: object) =>
  await API.post("/product/set-primary-image", data);
export const deleteImageMutation = async (id: string) =>
  await API.delete(`/product/remove-image/${id}`);

// INVENTORY
export const addModelInventoryMutation = async (data: object) =>
  await API.post("/product/add-stock", data);
export const updateModelInventoryMutation = async (data: object) =>
  await API.put("/product/update-stock", data);

// REPORTS
export const getUserRegistrationsReport = async () =>
  await API.get(`/admin/report/user-registrations`);
export const getVerifiedUsersReport = async () =>
  await API.get(`/admin/report/verified-users`);
export const getSalesSummaryReport = async () =>
  await API.get(`/admin/report/sales-summary`);
export const getOrderStatusReport = async () =>
  await API.get(`/admin/report/order-status`);
export const getTopProductsReport = async () =>
  await API.get(`/admin/report/top-products`);
export const getLowInStockReport = async (params: LowInStockReportParams) =>
  await API.get(`/admin/report/low-stock`, { params });
export const getWishlistsTrendsReport = async () =>
  await API.get(`/admin/report/wishlist-trends`);
export const getTechnicianRegistrationReport = async () =>
  await API.get(`/admin/report/technician-registrations`);
