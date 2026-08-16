export interface AppConfig {
  nodeEnv: string;
  port: number;
  corsOrigins: string[];
  throttleTtlSeconds: number;
  throttleLimit: number;
  paymentProvider: string;
  paymentRandomFailureRate: number;
}

export const configuration = (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  throttleTtlSeconds: Number(process.env.THROTTLE_TTL_SECONDS ?? 60),
  throttleLimit: Number(process.env.THROTTLE_LIMIT ?? 120),
  paymentProvider: process.env.PAYMENT_PROVIDER ?? 'mock',
  paymentRandomFailureRate: Number(process.env.PAYMENT_RANDOM_FAILURE_RATE ?? 0.25),
});
