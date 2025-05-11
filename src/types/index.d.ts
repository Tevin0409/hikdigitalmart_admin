declare type LoginData = {
  email: string;
  password: string;
};

declare type RefreshData = {
  id: string;
  refreshToken: string;
};

declare type RegisterData = {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  roleId: string;
};

declare type ActionResponse = {
  success: boolean;
  message: string;
  inputs: Record<string, string | File> | FormData;
  errors?: Record<string, string[]>;
  data?: unknown;
};
type FetchResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

type ReportsFetchResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T | any;
};

type UsersFetchResponse<T = unknown> = {
  success: boolean;
  message: string;
  data:
    | PaginatedUsers
    | T
    | Roles[]
    | any
    | User
    | TechnicianQuestionnaire
    | Review[];
};
declare type AddressFormData = {
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

declare type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    technicianVerified: boolean;
    roleId: string;
    role: {
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

declare type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

declare type UserInfoData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId?: string;
};

declare type SessionPayload = {
  userId: string;
  roleId: string;
  role: string;
  expiresAt: Date;
};

declare type NavSideItem = {
  title: string;
  url: string;
  icon: string;
  shortcut: string[];
};

declare type NavItem = {
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  items: NavSideItem[];
  shortcut?: string[];
};

declare type ForgotPasswordData = {
  email: string;
};

declare type ResetPasswordData = {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
  otp: string;
};

declare type Feature = {
  id?: string;
  description: string;
  modelId: string;
};

declare type Inventory = {
  quantity: number;
  id: string;
  modelId: string;
  createdAt?: string;
  updatedAt?: string;
};

declare type Category = {
  name: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
};

declare type Subcategory = {
  name: string;
  categoryId: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
};

declare type Model = {
  name: string;
  description: string;
  price: number;
  features: Feature[];
  inventory: Inventory;
  id?: string;
  productId?: string;
  price: number;
  status: string;
  isFeatured: string;
  createdAt?: string;
  updatedAt?: string;
  inventory?: Inventory;
};

declare type ProductData = {
  id?: string;
  name: string;
  defaultPrice?: number;
  subCategoryId: string;
  subCategory: Subcategory;
  models: Model[];
  createdAt?: string;
  updatedAt?: string;
};

declare type FetchProductsResponse = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  results: ProductData[];
};

declare type ProductQueryParams = {
  page: number;
  limit: number;
};

declare type LowInStockReportParams = {
  quantity: number;
};
declare type FlattenProductsData = {
  productId: string;
  productName: string;
  category: string;
  subCategory: string;
  modelId: string;
  modelName: string;
  description: string;
  price: number;
  inventory: number;
  features: Feature[];
  status: string;
  isFeatured: boolean;
};

declare type OrderQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
};

declare type OrdersData = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  results: Order[];
};

declare type ProductModel = {
  id: string;
  name: string;
  price: number;
  description: string;
};

declare type OrderItem = {
  id: string;
  orderId: string;
  productModelId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  productModel: ProductModel;
};

declare type Order = {
  id: string;
  userId: string;
  orderPrice: number;
  vat: number;
  total: number;
  first_name: string;
  last_name: string;
  company_name: string | null;
  street_address: string;
  apartment: string | null;
  town: string;
  phone_number: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
};

declare type SummaryData = {
  revenueKsh: number;
  totalOrders: number;
  topCustomers: {
    customerId: string;
    name: string;
    email: string;
    totalSpent: number;
  }[];
  topModels: {
    modelId: string;
    name: string;
    quantityOrdered: number;
  }[];
  inventoryValue: number;
  salesByCategory: {
    [category: string]: number;
  };
  salesPerDuration: {
    monthly: {
      [month: string]: number;
    };
    weekly: {
      [week: string]: number;
    };
    yearly: {
      [year: string]: number;
    };
  };
};

declare type DurationKey = "monthly" | "weekly" | "yearly";

declare type GetAllUsersParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  roleId?: string;
};

declare type PaginatedUsers = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  results: User[];
};

declare type PaginatedTechnician = {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  results: TechnicianQuestionnaire[];
};

declare type Roles = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

declare type Role = {
  id: string;
  name: string;
};

declare type User = {
  id: string;
  phoneNumber: string | null;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  technicianVerified: boolean;
  shopOwnerVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roleId?: string;
  role: Role;
  permissions: any[];
};

declare type UserTableProps = {
  users: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
    results: User[];
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchTermChange: (search: string) => void;
  roles: Role[];
  selectedRoleId: string;
  onRoleChange: (roleId: string) => void;
  isLoading?: boolean;
  onEdit: (user: User) => void;
};

declare type TechnicianQuestionnaire = {
  id: number;
  businessName: string;
  phoneNumber: string;
  email: string;
  location: string;
  businessType: string;
  experienceYears: number | null;
  experienceAreas: string[];
  brandsWorkedWith: string[];
  integrationExperience: string;
  familiarWithStandard: string | null;
  purchaseSource: string[];
  purchaseHikvision: string;
  requiresTraining: string;
  createdAt: string;
  updatedAt: string;
  user: User;
};

declare type TechnicianTableProps = {
  data: PaginatedTechnician;
  currentPage?: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
  onApprove: (id: string) => void;
  isLoading?: boolean;
};

declare type ShopOwner = {
  id: number;
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumber2: string | null;
  email: string;
  email2: string | null;
  address: string;
  selectedBusinessType: string;
  selectedBrands: string[];
  selectedSecurityBrands: string[];
  otherBrand: string;
  selectedCategories: string[];
  hikvisionChallenges: string;
  adviceToSecureDigital: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
};

declare type ShopOwnersTableProps = {
  data: {
    results: ShopOwner[];
    totalResults: number;
    totalPages: number;
  };
  currentPage?: number;
  onPageChange: (page: number) => void;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
  onApprove?: (id: string) => void;
  isLoading?: boolean;
};

declare type Review = {
  id: string;
  productModelId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: {
      name: string;
    };
  };
  productModel: {
    name: string;
  };
  images: {
    id: string;
    reviewId: string;
    uploadUrl: string;
    optimizeUrl: string;
    isPrimary: boolean;
  }[];
  ReviewResponse: {
    id: string;
    reviewId: string;
    userId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      role: {
        name: string;
      };
    };
  } | null;
};
