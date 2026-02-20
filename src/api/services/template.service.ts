import api from "../api";
import type {
  PaginatedResponse,
  SelectListItem,
  BaseQueryParams,
} from "../types/pagination";

export interface Template {
  id: number;
  name: string;
  code: string;
  type: string;
  description: string;
  htmlContent: string;
}

export interface CreateTemplateDto {
  name: string;
  code: string;
  type: string;
  description: string;
  htmlContent: string;
}

export interface UpdateTemplateDto {
  id: number;
  name: string;
  description: string;
  htmlContent: string;
}

export interface TemplateQueryParams extends BaseQueryParams {
  type?: string;
}

const $URL = "/templates";

export const TemplateService = {
  getAll: async (
    params?: TemplateQueryParams
  ): Promise<PaginatedResponse<Template>> => {
    const response = await api.get<PaginatedResponse<Template>>($URL, {
      params,
    });
    return response.data;
  },

  getTemplateTypesSelectList: async (): Promise<SelectListItem[]> => {
    const response = await api.get<SelectListItem[]>(`${$URL}/lookup`);
    return response.data;
  },

  getById: async (id: number): Promise<Template> => {
    const response = await api.get<Template>(`${$URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateTemplateDto): Promise<any> => {
    const response = await api.post($URL, data);
    return response.data;
  },

  update: async (data: UpdateTemplateDto): Promise<any> => {
    const response = await api.patch($URL, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${$URL}/${id}`);
  },

  getHtmlContentByCode: async (
    code: string
  ): Promise<{ htmlContent: string }> => {
    const response = await api.get<{ htmlContent: string }>(
      `${$URL}/content-by-code/${code}`
    );
    return response.data;
  },
};
