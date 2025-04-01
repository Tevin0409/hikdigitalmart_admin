"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import PageContainer from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { changePassword, changeUserInfo } from "../../actions";

const initialState: ActionResponse = {
  success: false,
  message: "",
  errors: {},
  inputs: {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  },
};

const userInitialState: ActionResponse = {
  success: false,
  message: "",
  errors: {},
  inputs: {
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
};

const Profile = () => {
  const stored_user = localStorage.getItem("user");
  const jsonifyUser = JSON.parse(stored_user!);
  const user = React.useRef({
    id: jsonifyUser.id || "",
    firstName: jsonifyUser.firstName || "",
    lastName: jsonifyUser.lastName || "",
    phoneNumber: jsonifyUser.phoneNumber || "",
    email: jsonifyUser.email || "",
    role: jsonifyUser.role || "",
  });
  const [updatingPassword, setUpdatingPassword] = React.useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const [passwordFormData, setPasswordFormData] = React.useState<{
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [userInfo, setUserInfo] = React.useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  }>({
    firstName: user?.current.firstName,
    lastName: user?.current.lastName,
    phoneNumber: user?.current.phoneNumber,
    email: user?.current.email,
  });

  const [state, passwordDispatch, isPending] = React.useActionState(
    (
      prevState: ActionResponse,
      formData: FormData
    ): Promise<ActionResponse> => {
      return changePassword(prevState, formData);
    },
    initialState
  );

  const [userInfoState, userInfoDispatch, pending] = React.useActionState(
    (
      prevState: ActionResponse,
      formData: FormData
    ): Promise<ActionResponse> => {
      return changeUserInfo(prevState, formData, user.current.id);
    },
    userInitialState
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // check if there are state.errors and clear them
    if (state.errors) {
      state.errors = {};
    }
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // check if there are state.errors and clear them
    if (state.errors) {
      state.errors = {};
    }
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  React.useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // store user data in local storage
    } else {
      if (state.message && state.message.length > 0) {
        toast.error(state.message);
      }
    }
  }, [state.success, state.message, state]);
  React.useEffect(() => {
    if (userInfoState.success) {
      toast.success(userInfoState.message);

      // store user data in local storage
      if (userInfoState.data as LoginResponse["user"]) {
        const updatedUser = userInfoState.data as LoginResponse["user"];
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update the ref
        user.current = {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phoneNumber: updatedUser.phoneNumber,
          email: updatedUser.email,
          role: jsonifyUser.role,
        };

        // Also update the state that controls the form inputs and the profile display
        setUserInfo({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          phoneNumber: updatedUser.phoneNumber,
          email: updatedUser.email,
        });
      }
    } else {
      if (userInfoState.message && userInfoState.message.length > 0) {
        toast.error(userInfoState.message);
      }
    }
  }, [userInfoState.success, userInfoState.message, userInfoState]);
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="w-full lg:w-1/3">
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-6">My Profile</h2>

              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center overflow-hidden">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        fill="#7178f8"
                        stroke="#717ff8"
                      />
                      <path
                        d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                        fill="#7178f8"
                        stroke="#717ff8"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4V20M4 12H20"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">
                    {user?.current.firstName} {user?.current.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {user?.current?.role?.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-sm text-gray-500 w-24">
                    FULL NAME :
                  </span>
                  <span className="text-sm">
                    {user?.current.firstName} {user?.current.lastName}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-500 w-24">MOBILE :</span>
                  <span className="text-sm">{user?.current.phoneNumber}</span>
                </div>
                <div className="flex">
                  <span className="text-sm text-gray-500 w-24">E-MAIL :</span>
                  <span className="text-sm">{user?.current.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-2/3">
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-medium mb-6">Edit Profile</h2>
              <form action={userInfoDispatch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      FIRST NAME
                    </label>
                    <Input
                      value={userInfo.firstName}
                      className="border rounded"
                      onChange={handleUserInfoChange}
                      name="firstName"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      LAST NAME
                    </label>
                    <Input
                      value={userInfo.lastName}
                      className="border rounded"
                      onChange={handleUserInfoChange}
                      name="lastName"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      PHONE NUMBER
                    </label>
                    <Input
                      value={userInfo.phoneNumber}
                      className="border rounded"
                      onChange={handleUserInfoChange}
                      name="phoneNumber"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 block mb-2">
                      EMAIL ADDRESS
                    </label>
                    <Input
                      value={userInfo.email}
                      className="border rounded"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      passwordFormData.newPassword !==
                        passwordFormData.confirmNewPassword
                    }
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {!updatingPassword && (
            <Card className=" shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-6">Change Password</h2>
                <form action={passwordDispatch}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm text-gray-500 block mb-2">
                        CURRENT PASSWORD
                      </label>
                      <div className="">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          value={passwordFormData.oldPassword}
                          onChange={handleChange}
                          required
                          name="oldPassword"
                          className="border rounded"
                        />
                        {state.errors?.oldPassword && (
                          <p className="text-sm text-red-500">
                            {state.errors.oldPassword[0]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 block mb-2">
                        NEW PASSWORD
                      </label>
                      <Input
                        placeholder="Enter New Password"
                        className="border rounded"
                        type="password"
                        value={passwordFormData.newPassword}
                        onChange={handleChange}
                        name="newPassword"
                        required
                      />
                      {state.errors?.newPassword && (
                        <p className="text-sm text-red-500">
                          {state.errors.newPassword[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm text-gray-500 block mb-2">
                        REPEAT NEW PASSWORD
                      </label>
                      <Input
                        placeholder="Repeat New Password"
                        className="border rounded"
                        type="password"
                        value={passwordFormData.confirmNewPassword}
                        onChange={handleChange}
                        name="confirmNewPassword"
                        required
                      />
                      {state.errors?.confirmNewPassword && (
                        <p className="text-sm text-red-500">
                          {state.errors.confirmNewPassword[0]}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          isPending ||
                          passwordFormData.newPassword !==
                            passwordFormData.confirmNewPassword
                        }
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {(updatingPassword || isPending) && (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[325px] w-[890px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
