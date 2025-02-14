import { z } from "zod";
// SignUpFormSchema
export const SignupFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string().min(10),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  roleId: z.string().min(1),
});

// LoginFormSchema
export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ResetPasswordFormSchema
export const ResetPasswordFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ForgotPasswordFormSchema
export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});
// OtpFormSchema
export const OtpFormSchema = z.object({
  otp: z.number().min(6).max(6),
});

export const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1),
  subCategoryId: z.string().uuid(),
  defaultPrice: z.number().positive(),
  models: z.array(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      features: z.array(z.object({ description: z.string().min(1) })),
      inventory: z.object({ quantity: z.number().int().nonnegative() }),
    })
  ),
});

export const CategoryFormSchema = z.object({
  name: z.string().min(1),
});

export const SubcategoryFormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().uuid(),
});
