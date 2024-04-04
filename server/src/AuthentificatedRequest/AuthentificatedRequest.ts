import { Request } from "express";
import  jwt  from "jsonwebtoken";

type User = {
  id: string | jwt.JwtPayload;
};

export interface AuthentificatedRequest extends Request {
   user: User;
}
