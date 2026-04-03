import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UserToken } from "../UserToken";
import { IUserTokenRepository } from "./interface/IUserTokenRepository";

export class UserTokenRepository implements IUserTokenRepository {
    async create({
        userId,
        refresh_token,
        expires_date,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = await prisma.userToken.create({
            data: {
                expires_date,
                refresh_token,
                userId,
            },
        });

        return userToken;
    }
}