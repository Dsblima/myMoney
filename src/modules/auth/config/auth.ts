import { SignOptions } from "jsonwebtoken";

import "dotenv/config";
type TokenConfig = {
  secret_token: string,
  expires_in_token: SignOptions['expiresIn'],
  secret_refresh_token: string,
  expires_in_refresh_token: string,
  expires_in_refresh_token_days: number,
}

export const authConfig: TokenConfig = {
  secret_token: String(process.env.SECRET_TOKEN),
  expires_in_token: '15m' as const,
  secret_refresh_token: String(process.env.SECRET_REFRESH_TOKEN),
  expires_in_refresh_token: '30d',
  expires_in_refresh_token_days: 30,
};