import { Queue } from "bullmq";
import bcrypt from "bcrypt"
import { model } from "../api/model/index.js";
import { prisma } from "@repo/database";
export const createQueue = (name: string, redisHost: string) => {
  return new Queue(name, {
    connection: {
      host: redisHost,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
  });
};

export const seedDb=async()=>{
   try {
     const checkExisting=await prisma.user.findFirst({
      where:{
         email:"guest@gmail.com"
      }
     })
     if(checkExisting){
       console.log("User already exists");
       return;
     }
     const saltRounds = 10;
     const genSalt = await bcrypt.genSalt(saltRounds);
     const password = process.env.GUEST_USER_PASSWORD || "password";
     const email = process.env.GUEST_USER_EMAIL || "guest@gmail.com";
     const name = process.env.GUEST_USER_NAME || "Guest User";
     const hashedPassword = await bcrypt.hash(password, genSalt);
     const response = await model.User.create(name, email, hashedPassword);
     if (response.status == 200 && response.user) {
       console.log("User seeded");
       return;
      }
     throw new Error("Error in creating the user");
   } catch (error) {
     console.error("Error seeding database:", error);
   }
}