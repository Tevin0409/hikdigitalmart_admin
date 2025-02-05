"use server";
import { LoginFormSchema } from "@/app/_lib/definitions";
import { loginMutation } from "@/lib/api";
import { AxiosError } from "axios";

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

// export async function login(formData: FormData) {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
//   const name = formData.get("name") as string;
//   if (name.length < 3) {
//     const res = {
//       success: false,
//       message: "Name must be at least 3 characters long",
//     };
//     return "res";
//   }
//   return "success";
//   // const data = {
//   //   email: formData.get("email"),
//   //   password: formData.get("password"),
//   // };
//   // const validationResult = LoginFormSchema.safeParse(data);

//   // if (!validationResult.success) {
//   //   throw new Error(
//   //     JSON.stringify(validationResult.error.flatten().fieldErrors)
//   //   );
//   // }

//   // try {
//   //   // Perform the login API request
//   //   const response = await loginMutation(data as LoginData);

//   //   if (response.status === 200) {
//   //     return { success: true, data: response.data };
//   //   }

//   //   // Handle unsuccessful login
//   //   throw new Error("Invalid email or password.");
//   // } catch (error) {
//   //   // Throw errors so the client can catch and display them
//   //   throw new Error((error as Error).message || "Something went wrong.");
//   // }
// }

// export async function login(
//   prevState: ActionResponse | null,
//   formData: FormData
// ) {
//   try {
//     const rawData: LoginData = {
//       email: formData.get("email") as string,
//       password: formData.get("password") as string,
//     };
//     // Validate the form data
//     const validatedData = LoginFormSchema.safeParse(rawData);

//     if (!validatedData.success) {
//       return {
//         success: false,
//         message: "Please fix the errors in the form",
//         errors: validatedData.error.flatten().fieldErrors,
//         inputs: rawData,
//       };
//     }

//     // Here you would typically log the user in
//     const loginResponse = await loginMutation(validatedData.data);
//     console.log("Login response:", loginResponse);

//     return {
//       success: true,
//       message: "Login successful!",
//       inputs: rawData,
//       errors: undefined,
//     };
//   } catch (error) {
//     console.log("Error submitting address:", error);
//     if (
//       (error as AxiosError) &&
//       (error as AxiosError).response.data.error.message
//     ) {
//       return {
//         success: false,
//         message: error.response.data.error.message,
//       };
//     } else {
//       return {
//         success: false,
//         message: "An unexpected error occurred",
//       };
//     }
//   }
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
    console.log("Login response:", loginResponse);

    return {
      success: true,
      message: "Login successful!",
      inputs: rawData,
    };
  } catch (error) {
    console.log("Error submitting login:", error);

    const errorMessage =
      (error as AxiosError)?.response?.data?.error?.message ||
      "An unexpected error occurred";

    return {
      success: false,
      message: errorMessage,
      inputs: state.inputs, // Retain previous inputs
    };
  }
}
