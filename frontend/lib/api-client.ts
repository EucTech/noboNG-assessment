export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const ApiErrorCode = {
  VALIDATION_FAILED: "VALIDATION_FAILED",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  PRODUCT_UNAVAILABLE: "PRODUCT_UNAVAILABLE",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  EMPTY_CART: "EMPTY_CART",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  ORDER_NOT_PAYABLE: "ORDER_NOT_PAYABLE",
  PAYMENT_NOT_FOUND: "PAYMENT_NOT_FOUND",
  PAYMENT_DECLINED: "PAYMENT_DECLINED",
  PAYMENT_IN_PROGRESS: "PAYMENT_IN_PROGRESS",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export type ApiErrorCodeValue =
  (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCodeValue | string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: ApiErrorCodeValue | string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  revalidate?: number | false;
}

function isErrorBody(
  value: unknown,
): value is { code?: string; message?: string; details?: unknown } {
  return typeof value === "object" && value !== null;
}

export async function apiRequest<T>(
  path: string,
  { body, revalidate, headers, ...init }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(revalidate === undefined ? {} : { next: { revalidate } }),
    });
  } catch {
    throw new ApiError(
      0,
      ApiErrorCode.NETWORK_ERROR,
      "We could not reach the NoboNG service. Check your connection and try again.",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const details = isErrorBody(payload) ? payload : {};

    throw new ApiError(
      response.status,
      details.code ?? ApiErrorCode.INTERNAL_ERROR,
      details.message ?? "Something went wrong. Please try again.",
      details.details,
    );
  }

  return payload as T;
}
