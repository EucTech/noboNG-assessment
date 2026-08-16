import axios, { AxiosError } from "axios";

import { ApiError, ApiErrorCode, API_BASE_URL } from "./api-client";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function isErrorBody(
  value: unknown,
): value is { code?: string; message?: string; details?: unknown } {
  return typeof value === "object" && value !== null;
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!(error instanceof AxiosError)) {
      throw error;
    }

    if (!error.response) {
      throw new ApiError(
        0,
        ApiErrorCode.NETWORK_ERROR,
        "We could not reach the NoboNG service. Check your connection and try again.",
      );
    }

    const payload: unknown = error.response.data;
    const details = isErrorBody(payload) ? payload : {};

    throw new ApiError(
      error.response.status,
      details.code ?? ApiErrorCode.INTERNAL_ERROR,
      details.message ?? "Something went wrong. Please try again.",
      details.details,
    );
  },
);
