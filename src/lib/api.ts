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

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token")?.value;
        const id = cookieStore.get("id")?.value;
        if (refreshToken && id) {
          const refreshData = { id, refreshToken } as RefreshData;
          const res = await refreshAccessTokenMutation(refreshData);
          const isProd = process.env.NODE_ENV === "production";
          cookieStore.set("access_token", res.data.accessToken as string, {
            secure: isProd,
            sameSite: "strict",
            path: "/",
            expires: new Date(res.data.accessTokenExpiresAt),
          });
          cookieStore.set("refresh_token", res.data.refreshToken as string, {
            secure: isProd,
            sameSite: "strict",
            path: "/",
            expires: new Date(res.data.refreshTokenExpiresAt),
          });
          originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// AUTH
export const loginMutation = async (data: LoginData) =>
  await API.post("/auth/admin/login", data);
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

export const getTechnicianQuestionnaires = async (
  params: { page?: number; limit?: number; searchTerm?: string } = {}
) => {
  const { page = 1, limit = 10, searchTerm } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchTerm ? { searchTerm } : {}),
  }).toString();

  return await API.get(`/admin/user/technician-request?${query}`);
};

export const getShopOwnerQuestionnaires = async (
  params: { page?: number; limit?: number; searchTerm?: string } = {}
) => {
  const { page = 1, limit = 10, searchTerm } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchTerm ? { searchTerm } : {}),
  }).toString();

  return await API.get(`/admin/user/shop-owners-requests?${query}`);
};

export const getAllRoles = async () => await API.get(`admin/role`);

export const getUserByIdQuery = async (id: string) =>
  await API.get(`/user/get-user/${id}`);
export const getUserByEmailQuery = async (email: string) =>
  await API.get(`/user/get-user-by-email/${email}`);
export const updateUserMutation = async (id: string, data: object) =>
  await API.put(`/user/update-user/${id}`, data);
export const approveTechnicianMutation = async (id: string) =>
  await API.post(`/admin/user/approve-technician/${id}`);
export const approveShopOwnersMutation = async (id: string) =>
  await API.post(`/admin/user/approve-shopowner/${id}`);


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
export const getAllReviews = async (
  params: { page?: number; limit?: number; searchTerm?: string } = {}
) => {
  const { page = 1, limit = 10, searchTerm } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(searchTerm ? { searchTerm } : {}),
  }).toString();

  return await API.get(`/admin/product/reviews?${query}`);
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
  await API.post("/product/add-images", data);
export const setPrimaryImageMutation = async (data: object) =>
  await API.post("/product/set-primary-image", data);
export const deleteImageMutation = async (id: string) =>
  await API.delete(`/product/remove-image/${id}`);
export const respondReview = async (id: string, message: string) =>
  await API.post(`/admin/product/respond-review/${id}`, { message });

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
