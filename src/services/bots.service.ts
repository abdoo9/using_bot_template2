import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.bot, {
    findByBotId: <T extends PartialDeep<Prisma.BotFindUniqueArgs>>(
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs>
    ) => {
      const query: Prisma.BotFindUniqueArgs = {
        where: {
          botId,
        },
      };

      return prisma.bot.findUnique(_.merge(query, args));
    },
    findUserBots: <T extends PartialDeep<Prisma.BotFindManyArgs>>(
      ownerId: number,
      args?: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>
    ) => {
      const query: Prisma.BotFindManyArgs = {
        where: {
          ownerId,
        },
      };

      return prisma.bot.findMany(_.merge(query, args));
    },

    upsertByBotId: <T extends PartialDeep<Prisma.BotUpsertArgs>>(
      botId: number,
      token: string,
      ownerId: number,
      firstName: string,
      username: string,

      args: Prisma.SelectSubset<T, Prisma.BotUpsertArgs>
    ) => {
      const query: Prisma.BotUpsertArgs = {
        where: {
          botId,
        },
        create: {
          botId,
          token,
          ownerId,
          firstName,
          username,
        },
        update: {
          token,
          ownerId,
          firstName,
          username,
        },
      };

      return prisma.bot.upsert(_.merge(query, args));
    },

    updateByBotId: <T extends PartialDeep<Prisma.BotUpdateArgs>>(
      botId: number,
      args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>
    ) => {
      const query: Prisma.BotUpdateArgs = {
        where: {
          botId,
        },
        data: {},
      };

      return prisma.bot.update(_.merge(query, args));
    },
  });
