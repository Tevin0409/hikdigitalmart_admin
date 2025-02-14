"use server";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { LoginFormSchema } from "@/app/_lib/definitions";
import { loginMutation, getAllProductsMutation } from "@/lib/api";
import { createSession } from "@/lib/session";

// export async function createUser(prevState: unknown, formData: FormData) {
//   const validationResult = SignupFormSchema.safeParse({
//     email: formData.get("email"),
//     password: formData.get("password"),
//     phoneNumber: formData.get("phoneNumber"),
//     firstName: formData.get("firstName"),
//     lastName: formData.get("lastName"),
//     roleId: formData.get("roleId"),
//   });

//   // Validate fields using the zod schema
//   if (!validationResult.success) {
//     return {
//       errors: validationResult.error.flatten().fieldErrors,
//     };
//   }
//   // Create user
//   // create session
// }

export async function login(
  state: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData: LoginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedData = LoginFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedData.error.flatten().fieldErrors,
        inputs: rawData,
      };
    }

    const loginResponse = await loginMutation(validatedData.data);
    const {
      refreshToken,
      accessToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = loginResponse.data;

    const cookieStore = await cookies();
    cookieStore.set("refresh_token", refreshToken as string, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(refreshTokenExpiresAt),
    });
    cookieStore.set("access_token", accessToken as string, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(accessTokenExpiresAt),
    });
    const user = {
      id: loginResponse.data.user.id,
      email: loginResponse.data.user.email,
      phoneNumber: loginResponse.data.user.phoneNumber,
      firstName: loginResponse.data.user.firstName,
      lastName: loginResponse.data.user.lastName,
      isVerified: loginResponse.data.user.isVerified,
      technicianVerified: loginResponse.data.user.technicianVerified,
      roleId: loginResponse.data.user.roleId,
      role: loginResponse.data.user.role,
      accessToken,
    };
    cookieStore.set("id", user.id as string, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: new Date(accessTokenExpiresAt),
    });

    await createSession(user.id, user.roleId, user.role.name);

    return {
      success: true,
      message: "Login successful!",
      inputs: rawData,
      data: user,
    };
  } catch (error) {
    console.log("Error submitting login:", error);

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
