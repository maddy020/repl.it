import { prisma } from "@repo/database";

export const User = {
  create: async (
    name: string,
    email: string,
    password: string,
    providerId?: string
  ) => {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password,
          ...(providerId && { providerId }),
        },
      });
      return { status: 200, user };
    } catch (error) {
      return { status: 400, error };
    }
  },
  check: async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return { status: 200, user };
    } catch (error) {
      return { status: 400, error };
    }
  },
};
