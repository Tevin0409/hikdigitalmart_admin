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
  inputs: LoginData;
  errors?: Record<string, string[]>;
  data?: unknown;
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
