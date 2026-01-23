import { Request, Response } from 'express';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    console.log("Creating user...");

    return res.status(201).json({ message: "User created successfully." });
  }
}