import type { Request, Response } from "express";
import { model } from "../model/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const User = {
  signup: async (req: Request, res: Response) => {
    try {
      const { formData } = req.body;
      const { name, email, password ,confirmPassword} = formData;
      if(password !== confirmPassword)return res.status(400).json({message:"Passwords do not match",status:400,token:""})
      if (!(name || email || password)) {
        return res.status(404).json({ message: "Missing fields" });
      }

      const existingUserResponse = await model.User.check(email);
      if (existingUserResponse.status == 200) {
        const existingUser = existingUserResponse.user;
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "User already exists", status: 400, token: "" });
        }
      }
      const saltRounds = 10;
      const genSalt = await bcrypt.genSalt(saltRounds);

      const hashedPassword = await bcrypt.hash(password, genSalt);
      const response = await model.User.create(name, email, hashedPassword);
      if (response.status == 200 && response.user) {
        const payload = { name, email, id: response.user.id };
        const jwt_secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, jwt_secret || "SECRET_JWT");
        return res
          .status(200)
          .json({ message: "User Signed Up Successfully", status: 200, token });
      }
      return res.status(400).json({
        message: "Error in creating the user",
        status: 400,
        token: "",
      });
    } catch (error) {
      console.log("error in sign up",error);
      return res.status(400).json({
        message: "Error in creating the user",
        status: 400,
        token: "",
      });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { formData } = req.body;
      const { email, password } = formData;
      const response = await model.User.check(email);
      if (response.status == 200) {
        const user = response.user;
        if (user) {
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            const payload = { name: user.name, email: user.email, id: user.id };
            const jwt_secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, jwt_secret || "SECRET_JWT");
            return res.status(200).json({
              message: "User Logged In Successfully",
              token,
              user,
            });
          }
        }
      }
      return res
        .status(400)
        .json({ message: "Invalid Credentials", token: "" });
    } catch (error) {
      console.log("Error in login controller:", error);
      return res
        .status(400)
        .json({ message: "Invalid Credentials", token: "" });
    }
  },
  signUpWithGoogle: async (req: Request, res: Response) => {
    try {
      const { formData } = req.body;
      const { name, email, providerId } = formData;
      if (!(name || email || providerId)) {
        return res.status(404).json({ message: "Missing fields" });
      }
      const response = await model.User.check(email);
      if (response.status == 200) {
        const user = response.user;
        if (user) {
          const payload = {
            name: user.name,
            email: user.email,
            id: user.id,
          };
          const jwt_secret = process.env.JWT_SECRET;
          const token = jwt.sign(payload, jwt_secret || "SECRET_JWT");
          return res.status(200).json({
            message: "User Logged In Successfully",
            token,
          });
        } else {
          const tempPassword = Math.random().toString(36).slice(-8);
          const saltRounds = 10;
          const genSalt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(tempPassword, genSalt);
          const createResponse = await model.User.create(
            name,
            email,
            hashedPassword,
            providerId
          );
          if (createResponse.status == 200) {
            const payload = { name, email ,id:createResponse.user?.id };
            const jwt_secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, jwt_secret || "SECRET_JWT");
            return res.status(200).json({
              message: "User Signed Up Successfully",
              token,
            });
          }
          return res.status(400).json({
            message: "Error in creating the user",
          });
        }
      }
    } catch (error) {
      console.log("Error in login with google", error);
      return res.status(400).json({
        message: "Error in Signing Up with Google",
      });
    }
  },
};
