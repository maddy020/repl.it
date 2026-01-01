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
};
