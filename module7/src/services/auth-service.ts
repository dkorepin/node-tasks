import { Request, Response, NextFunction } from "express";
import { User } from "../models/user/User";
import jwt from "jsonwebtoken";

export class AuthService {
  static login = async (fields: Partial<User>) => {
    const result = {
      data: null,
      message: "",
      ok: false,
    };

    try {
      const user = await User.findOne({ where: { login: fields.login } });

      if (!user || fields.password !== user.password)
        return { ...result, message: "Bad username/password combination" };

      const additionalData = { isActive: true };
      const token = jwt.sign(additionalData, "secret", { expiresIn: 1200 });

      return { ...result, data: token, ok: true };
    } catch (error) {
      return { ...result, data: error, message: "Something went wrong" };
    }
  };

  static checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-access-token"] as string;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, "secret", (err) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      next();
    });
  };
}
