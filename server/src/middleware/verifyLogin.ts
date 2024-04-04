import jwt from "jsonwebtoken";
import { AuthentificatedRequest } from "../AuthentificatedRequest/AuthentificatedRequest";
import { NextFunction, Response } from "express";

export class VerifyLogin {
  static verifyLogin(
    req: AuthentificatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authHeaders = req.headers.authorization;
      if (!authHeaders) {
        return res.status(401).send("No token Provided");
      }
      const token = authHeaders.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECERT_KEY) as jwt.JwtPayload;
      
      // Initialize req.user if not already initialized
      if (!req.user) {
        req.user = {
            id: ""
        };
      }
      req.user.id = decoded.id;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error occurred");
    }
  }
}
