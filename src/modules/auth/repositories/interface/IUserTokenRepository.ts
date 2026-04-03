import { ICreateUserTokenDTO } from "../../dtos/ICreateUserTokenDTO";
import { UserToken } from "../../UserToken";

export interface IUserTokenRepository{
  create(userToken: ICreateUserTokenDTO): Promise<UserToken>;
}