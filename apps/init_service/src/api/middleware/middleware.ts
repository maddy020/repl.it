import type { Response, NextFunction } from "express";
import type { CustomRequest } from "@repo/types";
import jwt from "jsonwebtoken";
export async function checkUser(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeaders = req.headers.authorization as string;
    if (!authHeaders) {
      return res.status(404).json({ message: "No auth headers found" });
    }
    if (!authHeaders.startsWith("Bearer")) {
      return res.status(404).json({ message: "No bearer token found" });
    }
    const token = authHeaders.split(" ")[1];
    if (!token) return res.status(404).json({ message: "No token found" });
    const checkVerified = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_JWT"
    );
    if (!checkVerified) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }
    const decodedJwt: any = jwt.decode(token);
    req.user = {
      name: decodedJwt.name,
      email: decodedJwt.email,
      id: decodedJwt.id,
    };
    next();
  } catch (error) {
    console.log("Error in user middleware", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}
