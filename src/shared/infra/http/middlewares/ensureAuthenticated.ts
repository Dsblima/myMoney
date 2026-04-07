import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "../../../../modules/auth/config/auth";
import { UsersRepository } from "../../../../modules/users/repositories/UsersRepository";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated( req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authConfig.secret_token) {
    return res.status(500).json("Server configuration error");
  }

  if (!authHeader) {
    return res.status(401).json("Token is messing");
  }

  const [, token] = authHeader.split(' ');
  
  if (!token) {
    throw new Error('Invalid token format');
  }
  try {
    const { sub: userId } = verify(token, authConfig.secret_token) as IPayload;
    
    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(userId);
    if (!user)
      return res.status(401).json("Users does not exists");

    req.user = {
      id: userId,
    }
    next();
  } catch {
    return res.status(401).json("Invalid Token");
  }
}