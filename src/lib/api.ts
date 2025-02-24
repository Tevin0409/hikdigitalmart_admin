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

// USERS
export const getAllUsersQuery = async () =>
  await API.get("/user/get-all-users");
export const getUserByIdQuery = async (id: string) =>
  await API.get(`/user/get-user/${id}`);
export const getUserByEmailQuery = async (email: string) =>
  await API.get(`/user/get-user-by-email/${email}`);
export const updateUserMutation = async (id: string, data: object) =>
  await API.put(`/user/update-user/${id}`, data);

// PRODUCTS
export const getAllProductsQuery = async (params: ProductQueryParams) =>
  await API.get("/product", { params });
export const createCategoryMutation = async (data: Category) =>
  await API.post("/admin/product/categories/create", data);
export const createSubcategoryMutation = async (data: object) =>
  await API.post("/product/subcategories/create", data);
export const createProductMutation = async (data: object) =>
  await API.post("/product/create-product", data);
export const bulkUploadProductsMutation = async (data: object) => {
  await API.post("/admin/product/upload-xslx", data);
};
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
