import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.user.findMany({
  where: {
    bot_user: {
      some: {
        user_id: 1,
      },
    },
  },
});
