import { SignOptions } from "jsonwebtoken";

type TokenConfig = {
  secret_token: string,
    expires_in_token: SignOptions['expiresIn'],
    secret_refresh_token: string,
    expires_in_refresh_token: string,
    expires_in_refresh_token_days: number,
}

export const authConfig: TokenConfig = {
    secret_token: '08b9d906f1f2534056d561f74bdd6dd9',
    expires_in_token: '15m' as const,
    secret_refresh_token: 'f807f108a5001a2cb9540a23588b4e02',
    expires_in_refresh_token: '30d',
    expires_in_refresh_token_days: 30,
};