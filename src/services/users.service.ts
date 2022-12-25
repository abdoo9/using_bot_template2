import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.user, {
    findByTelegramId: <T extends Prisma.UserArgs>(
      userId: number,
      select?: Prisma.SelectSubset<T, Prisma.UserArgs>
    ) => {
      const query = {
        where: {
          userId,
        },
      } satisfies Prisma.UserFindUniqueArgsBase;

      return prisma.user.findUnique<T & typeof query>(_.merge(query, select));
    },
    upsertByTelegramId: <T extends Prisma.UserArgs>(
      userId: number,
      args: PartialDeep<Pick<Prisma.UserUpsertArgs, "create" | "update">>,
      select?: Prisma.SelectSubset<T, Prisma.UserArgs>
    ) => {
      const query = {
        where: {
          userId,
        },
        create: {
          userId,
        },
        update: {},
      } satisfies Prisma.UserUpsertArgs;

      return prisma.user.upsert<T & typeof query>(_.merge(query, args, select));
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
    userBlockedBot: <T extends Prisma.UserArgs>(
      userId: number,
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.UserArgs>,
      select?: Prisma.SelectSubset<T, Prisma.UserArgs>
    ) => {
      const query = {
        where: {
          userId,
        },
        data: {
          subscriptions: {
            update: {
              where: {
                subscription_pkey: {
                  botId,
                  userId,
                },
              },
              data: {
                botIsBlocked: true,
              },
            },
          },
        },
      } satisfies Prisma.UserUpdateArgs;

      return prisma.user.update<T & typeof query>(_.merge(query, args, select));
    },
  });
