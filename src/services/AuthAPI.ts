import api from "@/lib/axios";
import type {
  ConfirmToken,
  RequestConfirmationCodeForm,
  ResponseDTO,
  UserLoginForm,
  UserRegistrationForm,
  ForgotPasswordForm,
  NewPasswordForm,
} from "../types";
import { isAxiosError } from "axios";

type AuthAPITypes = {
  loginFormData: UserLoginForm;
  registerFormData: UserRegistrationForm;
  token: ConfirmToken["token"];
  requestConfirmationCodeForm: RequestConfirmationCodeForm["email"];
  forgotPasswordForm: ForgotPasswordForm;
  newPasswordForm: NewPasswordForm;
};

export async function createAccount({
  registerFormData,
}: Pick<AuthAPITypes, "registerFormData">) {
  try {
    const { data, status } = await api.post(
      `/auth/create-account`,
      registerFormData,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function confirmAccount({ token }: Pick<AuthAPITypes, "token">) {
  try {
    const { data, status } = await api.post(`/auth/confirm-account`, { token });
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function requestConfirmationCode({
  requestConfirmationCodeForm: email,
}: Pick<AuthAPITypes, "requestConfirmationCodeForm">) {
  try {
    const { data, status } = await api.post(`/auth/request-code`, { email });
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function login({
  loginFormData,
}: Pick<AuthAPITypes, "loginFormData">) {
  try {
    const { data, status } = await api.post(`/auth/login`, loginFormData);
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function forgotPassword({
  forgotPasswordForm,
}: Pick<AuthAPITypes, "forgotPasswordForm">) {
  try {
    const { data, status } = await api.post(
      `/auth/forgot-password`,
      forgotPasswordForm,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function validateToken({ token }: Pick<AuthAPITypes, "token">) {
  try {
    const { data, status } = await api.post(`/auth/validate-token`, { token });
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updatePassword({
  newPasswordForm,
  token,
}: {
  newPasswordForm: NewPasswordForm;
  token: ConfirmToken["token"];
}) {
  try {
    console.log(token);
    const { data, status } = await api.patch(
      `/auth/update-password/${token}`,
      newPasswordForm,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
