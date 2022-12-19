import _ from "lodash";
import { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.bot, {
    // https://prisma.slack.com/archives/CA491RJH0/p1669228917525499?thread_ts=1669200271.315109&cid=CA491RJH0
    findByBotId: <T extends Prisma.BotArgs>(
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = Prisma.validator<Prisma.BotFindUniqueArgsBase>()({
        where: {
          botId,
        },
      });
      return prisma.bot.findUnique<T & typeof query>(_.merge(query, args));
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

    upsertByBotId: <T extends Prisma.BotArgs>(
      botId: number,
      token: string,
      ownerId: number,
      firstName: string,
      username: string,
      args?: Prisma.SelectSubset<T, Prisma.BotUpsertArgs>,

      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
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
      } satisfies Prisma.BotUpsertArgs;

      return prisma.bot.upsert<T & typeof query>(_.merge(query, args, select));
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
    botExists: <T extends PartialDeep<Prisma.BotFindUniqueArgs>>(
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
    banUser: <T extends PartialDeep<Prisma.BotUpdateArgs>>(
      botId: number,
      userId: number,
      args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>
    ) => {
      const query: Prisma.BotUpdateArgs = {
        where: {
          botId,
        },
        data: {
          subscribers: {
            update: {
              where: {
                subscription_pkey: {
                  userId,
                  botId,
                },
              },
              data: {
                userIsBanned: true,
              },
            },
          },
        },
      };
      return prisma.bot.update(_.merge(query, args));
    },
    unbanUser: <T extends PartialDeep<Prisma.BotUpdateArgs>>(
      botId: number,
      userId: number,
      args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>
    ) => {
      const query: Prisma.BotUpdateArgs = {
        where: {
          botId,
        },
        data: {
          subscribers: {
            update: {
              where: {
                subscription_pkey: {
                  userId,
                  botId,
                },
              },
              data: {
                userIsBanned: false,
              },
            },
          },
        },
      };
      return prisma.bot.update(_.merge(query, args));
    },

    updateGroupId: <T extends Prisma.BotArgs>(
      botId: number,
      groupId: number | null,
      args?: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
        where: {
          botId,
        },
        data: {
          groupId,
        },
      } satisfies Prisma.BotUpdateArgs;

      return prisma.bot.update<T & typeof query>(_.merge(query, args, select));
    },
  });
