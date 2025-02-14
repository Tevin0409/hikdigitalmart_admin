import API from "./axios-client";

export const loginMutation = (data: LoginData) => {
  return API.post("/auth/login", data);
};

export const registerMutation = (data: RegisterData) => {
  return API.post("/user/create-user", data);
};

export const refreshAccessTokenMutation = (data: RefreshData) => {
  return API.post("/auth/refresh", data);
};

export const forgotPasswordMutation = (data: ForgotPasswordData) => {
  return API.post("/auth/forgot-password", data);
};

// USEERS

export const getAllUsersMutation = () => {
  return API.get("/user/get-all-users");
};

export const getUserByIdMutation = (id: string) => {
  return API.get(`/user/get-user/${id}`);
};

export const getUserByEmailMutation = (email: string) => {
  return API.get(`/user/get-user-by-email/${email}`);
};

export const updateUserMutation = (id: string, data: object) => {
  return API.put(`/user/update-user/${id}`, data);
};

//PRODUCTS

export const getAllProductsMutation = () => {
  return API.get("/product");
};

export const createCategoryMutation = (data: object) => {
  return API.post("/product/categories/create", data);
};

export const createSubcategoryMutation = (data: object) => {
  return API.post("/product/subcategories/create", data);
};

export const createProductMutation = (data: object) => {
  return API.post("/product/create-product", data);
};

export const bulkUploadProductsMutation = (data: object) => {
  return API.post("/product/product/upload-xslx", data);
};

export const getProductByIdMutation = (id: string) => {
  return API.get(`/product/by-id/${id}`);
};

export const getAllSubcategoriesMutation = () => {
  return API.get(`/product/subcategories`);
};

export const getAllOrdersMutation = () => {
  return API.get(`/product/orders`);
};

export const bulkUploadProductImagesMutation = (data: object) => {
  return API.post("/product/product/add-images", data);
};

export const setPrimaryImageMutation = (data: object) => {
  return API.post("/product/set-primary-image", data);
};

export const deleteImageMutation = (id: string) => {
  return API.post(`/product/remove-image/${id}`);
};

// INVENTORY
export const addModelInventoryMutation = (data: object) => {
  return API.post("/product/add-stock", data);
};

export const updateModelInventoryMutation = (data: object) => {
  return API.post("/product/update-stock", data);
};
