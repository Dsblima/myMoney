import { Request, Response } from 'express';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    console.log("Creating user...");
     const {name, email, password} = req.body;

    return res.status(201).json({ message: "User created successfully." });
  }
}