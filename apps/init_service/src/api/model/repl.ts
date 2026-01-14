import { prisma } from "@repo/database";
export const Repl = {
  create: async (userId: number, language: string, replId: string) => {
    try {
      const repl = await prisma.repl.create({
        data:{
          language,
          userId,
          replId
        }
      });
      return { status: 200, repl };
    } catch (error) {
      console.error("Error creating repl:", error);
      return { status: 500, error };
    }
  },
  getAllRepls:async(userId:number)=>{
    try {
      const repls=await prisma.repl.findMany({
        where: {
          userId
        }
      })
      return {status:200,repls};
    } catch (error) {
      console.log("Error in getting the repls:",error);
      return { status:500, error}
    }
  }
};
