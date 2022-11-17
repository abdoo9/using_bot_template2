import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.user, {
    findByTelegramId: <T extends PartialDeep<Prisma.UserFindUniqueArgs>>(
      userId: number,
      args?: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>
    ) => {
      const query: Prisma.UserFindUniqueArgs = {
        where: {
          userId,
        },
      };

      return prisma.user.findUnique(_.merge(query, args));
    },

    upsertByTelegramId: <T extends PartialDeep<Prisma.UserUpsertArgs>>(
      userId: number,
      args: Prisma.SelectSubset<T, Prisma.UserUpsertArgs>
    ) => {
      const query: Prisma.UserUpsertArgs = {
        where: {
          userId,
        },
        create: {
          userId,
        },
        update: {},
      };

      return prisma.user.upsert(_.merge(query, args));
    },

    upsertByUserIdAndBotId: <T extends PartialDeep<Prisma.UserUpsertArgs>>(
      userId: number,
      botId: number,
      args: Prisma.SelectSubset<T, Prisma.UserUpsertArgs>
    ) => {
      const query: Prisma.UserUpsertArgs = {
        where: {
          userId,
        },
        create: {
          userId,
          subscriptions: {
            create: {
              botId,
            },
          },
        },
        update: {},
      };
      return prisma.user.upsert(_.merge(query, args));
    },

    upsertSubscription: <T extends PartialDeep<Prisma.SubscriptionUpsertArgs>>(
      userId: number,
      botId: number,
      args: Prisma.SelectSubset<T, Prisma.SubscriptionUpsertArgs>
    ) => {
      const query: Prisma.SubscriptionUpsertArgs = {
        where: {},
        create: {
          userId,
          botId,
        },
        update: {},
      };
      return prisma.subscription.upsert(_.merge(query, args));
    },

    updateByTelegramId: <T extends PartialDeep<Prisma.UserUpdateArgs>>(
      userId: number,
      args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>
    ) => {
      const query: Prisma.UserUpdateArgs = {
        where: {
          userId,
        },
        data: {},
      };

      return prisma.user.update(_.merge(query, args));
    },
  });
