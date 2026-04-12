import api from "@/lib/axios";
import type {
  ConfirmToken,
  ResponseDTO,
  UserLoginForm,
  UserRegistrationForm,
} from "../types";
import { isAxiosError } from "axios";

type AuthAPITypes = {
  loginFormData: UserLoginForm;
  registerFormData: UserRegistrationForm;
  token: ConfirmToken["token"];
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
