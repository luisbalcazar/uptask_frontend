import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  dashboardTaskSchema,
  taskSchema,
  type Project,
  type ResponseDTO,
  type Task,
  type TaskFormData,
  type TaskStatus,
} from "../types";

type TaskAPIType = {
  projectId: Project["_id"];
  taskId: Task["_id"];
  formData: TaskFormData;
  taskStatus?: TaskStatus;
};

export async function createTask({
  formData,
  projectId,
}: Pick<TaskAPIType, "formData" | "projectId">) {
  try {
    const { data, status } = await api.post(
      `/projects/${projectId}/task`,
      formData,
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

export async function getTasks({ projectId }: Pick<TaskAPIType, "projectId">) {
  try {
    const { data } = await api(`/projects/${projectId}/task`);
    const response = dashboardTaskSchema.safeParse(data);
    if (response.success) return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPIType, "taskId" | "projectId">) {
  try {
    const { data } = await api(`/projects/${projectId}/task/${taskId}`);
    const response = taskSchema.safeParse(data);

    if (response.success) {
      return response.data;
    } else {
      throw new Error("Error al obtener la tarea. Datos no válidos.");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPIType, "formData" | "projectId" | "taskId">) {
  try {
    const { data, status } = await api.put(
      `/projects/${projectId}/task/${taskId}`,
      formData,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    if (status === 200) return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function updateTaskStatus({
  projectId,
  taskId,
  taskStatus,
}: Pick<TaskAPIType, "taskStatus" | "projectId" | "taskId">) {
  try {
    const { data, status } = await api.patch(
      `/projects/${projectId}/task/${taskId}`,
      taskStatus,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    if (status === 200) return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPIType, "taskId" | "projectId">) {
  try {
    const { data, status } = await api.delete<string>(
      `/projects/${projectId}/task/${taskId}`,
    );
    const response: ResponseDTO = {
      msg: data,
      code: status,
    };
    if (status === 200) return response;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
