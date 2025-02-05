declare type LoginData = {
  email: string;
  password: string;
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
  errors?: Record<string, string[]>;
  inputs: LoginData;
};

declare type AddressFormData = {
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};
