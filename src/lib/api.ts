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

export const getAllUsers = () => {
  return API.get("/user/get-all-users");
};

export const getUserById = (id: string) => {
  return API.get(`/user/get-user/${id}`);
};

export const getUserByEmail = (email: string) => {
  return API.get(`/user/get-user-by-email/${email}`);
};

export const updateUser = (id: string, data: object) => {
  return API.put(`/user/update-user/${id}`, data);
};

//PRODUCTS

export const getAllProducts = () => {
  return API.get("/product");
};

export const createCategory = (data: object) => {
  return API.post("/product/categories/create", data);
};

export const createSubcategory = (data: object) => {
  return API.post("/product/subcategories/create", data);
};

export const createProduct = (data: object) => {
  return API.post("/product/create-product", data);
};

export const bulkUploadProducts = (data: object) => {
  return API.post("/product/product/upload-xslx", data);
};

export const getProductById = (id: string) => {
  return API.get(`/product/by-id/${id}`);
};

export const getAllSubcategories = () => {
  return API.get(`/product/subcategories`);
};

export const getAllOrders = () => {
  return API.get(`/product/orders`);
};

export const bulkUploadProductImages = (data: object) => {
  return API.post("/product/product/add-images", data);
};

export const setPrimaryImage = (data: object) => {
  return API.post("/product/set-primary-image", data);
};

export const deleteImage = (id: string) => {
  return API.post(`/product/remove-image/${id}`);
};

// INVENTORY
export const addModelInventory = (data: object) => {
  return API.post("/product/add-stock", data);
};

export const updateModelInventory = (data: object) => {
  return API.post("/product/update-stock", data);
};
