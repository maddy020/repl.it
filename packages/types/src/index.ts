import type { Session } from "next-auth";
import type { Request } from "express";
export interface CustomSession extends Session {
  accessToken?: string;
}

export interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export type ReplitProject={
   id:string,
  replId:string,
  language:string,
  env:string
}