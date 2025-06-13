"use server";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { LoginFormSchema } from "@/app/_lib/definitions";
import { loginMutation, refreshAccessTokenMutation } from "@/lib/api";
import { createSession, deleteSession } from "@/lib/session";

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
    const isProd = process.env.NODE_ENV === "production";
    cookieStore.set("refresh_token", refreshToken as string, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      expires: new Date(refreshTokenExpiresAt),
    });
    cookieStore.set("access_token", accessToken as string, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      expires: new Date(accessTokenExpiresAt),
    });
    const user = loginResponse.data.user;
    cookieStore.set("id", user.id as string, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      expires: new Date(accessTokenExpiresAt),
    });

    await createSession(user.id, user.roleId, user.role.name);

    return {
      success: true,
      message: "Login successful!",
      inputs: rawData,
      data: { user, accessToken },
    };
  } catch (error) {

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

export async function refreshAccessToken(): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token");

    const user_id = cookieStore.get("id");

    if (!refreshToken || !user_id) {
      return {
        success: false,
        message: "Unable to refresh access token",
        inputs: {
          email: "",
          password: "",
        },
        data: null,
      };
    } else {
      const refreshData = {
        id: user_id.value,
        refreshToken: refreshToken.value as string,
      };
      const response = await refreshAccessTokenMutation(refreshData);
      const isProd = process.env.NODE_ENV === "production";
      cookieStore.set("access_token", response.data.accessToken as string, {
        secure: isProd,
        sameSite: "strict",
        path: "/",
        expires: new Date(response.data.accessTokenExpiresAt),
      });
      cookieStore.set("refresh_token", response.data.refreshToken as string, {
        secure: isProd,
        sameSite: "strict",
        path: "/",
        expires: new Date(response.data.refreshTokenExpiresAt),
      });
      return {
        success: true,
        message: "Access token refreshed successfully",
        inputs: {
          email: "",
          password: "",
        },
        data: response.data,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Unable to  access token",
      inputs: {
        email: "",
        password: "",
      },
      data: null,
    };
  }
}

export async function logout(): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("id");
    await deleteSession();

    return {
      success: true,
      message: "Logged out successfully",
      inputs: {
        email: "",
        password: "",
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to logout",
      inputs: {
        email: "",
        password: "",
      },
    };
  }
}
