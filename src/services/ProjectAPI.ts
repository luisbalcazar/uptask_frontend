import api from "@/lib/axios";
import {
  dashboardProjectSchema,
  projectSchema,
  type Project,
  type ProjectFormData,
  type ResponseDTO,
} from "../types";
import { isAxiosError } from "axios";

export async function createProject(request: ProjectFormData) {
  try {
    const { data, status } = await api.post("/projects", request);
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

export async function getProjects() {
  try {
    const { data } = await api("/projects");
    const response = dashboardProjectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectById(id: Project["_id"]) {
  try {
    const { data } = await api(`/projects/${id}`);
    const response = projectSchema.safeParse(data);
    if (response.success) {
      return response.data;
    } else {
      throw new Error("Error al obtener el proyecto. Datos no válidos.");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    const { data, status } = await api.put(`/projects/${projectId}`, formData);
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

export async function deleteProject(id: Project["_id"]) {
  try {
    const { data, status } = await api.delete<string>(`/projects/${id}`);
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
