import * as dotenv from "dotenv";
import * as path from "path";
import Joi from "joi";

// Load env vars
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const envSchema = Joi.object({
  HEADLESS_BROWSER: Joi.boolean().required(),
  WORKERS: Joi.number().integer().min(1).required(),
  RETRY_FAILED: Joi.number().integer().min(0).required(),
  MAX_TEST_RUNTIME: Joi.number().integer().min(1000).required(),
  BASE_URL: Joi.string().uri().required(),
  OWNER_EMAIL: Joi.string().email().required(),
  OWNER_PASSWORD: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().required(),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
});

if (error) {
  throw new Error(`Invalid environment configuration:\n${error.message}`);
}

export class Config {
  static readonly HEADLESS_BROWSER: boolean = envVars.HEADLESS_BROWSER;
  static readonly WORKERS: number = envVars.WORKERS;
  static readonly RETRY_FAILED: number = envVars.RETRY_FAILED;
  static readonly MAX_TEST_RUNTIME: number = envVars.MAX_TEST_RUNTIME;
  static readonly BASE_URL: string = envVars.BASE_URL;
  static readonly OWNER_EMAIL: string = envVars.OWNER_EMAIL;
  static readonly OWNER_PASSWORD: string = envVars.OWNER_PASSWORD;
  static readonly ADMIN_EMAIL: string = envVars.ADMIN_EMAIL;
  static readonly ADMIN_PASSWORD: string = envVars.ADMIN_PASSWORD;
}
