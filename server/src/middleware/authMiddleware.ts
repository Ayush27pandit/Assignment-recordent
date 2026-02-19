import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Invalid authorization format. Use: Bearer <token>" });
    return;
  }

  const token = parts[1];
  
  if (!token || token === 'null' || token === 'undefined') {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage === 'jwt expired') {
      res.status(401).json({ message: "Access token expired", code: "TOKEN_EXPIRED" });
      return;
    }
    
    res.status(403).json({ message: "Invalid access token" });
  }
};
