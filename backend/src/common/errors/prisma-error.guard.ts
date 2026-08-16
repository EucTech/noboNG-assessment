export interface PrismaKnownRequestError {
  name: string;
  code: string;
  meta?: Record<string, unknown>;
}

export function isPrismaKnownRequestError(error: unknown): error is PrismaKnownRequestError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as { name?: unknown; code?: unknown };

  return candidate.name === 'PrismaClientKnownRequestError' && typeof candidate.code === 'string';
}

export const PrismaErrorCode = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
} as const;
