import _ from "lodash";
import { Prisma, PrismaClient } from "@prisma/client";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.subscription, {
    // https://prisma.slack.com/archives/CA491RJH0/p1669228917525499?thread_ts=1669200271.315109&cid=CA491RJH0
    unbanAll: <T extends Prisma.SubscriptionArgs>(
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.SubscriptionArgs>
    ) => {
      const query = Prisma.validator<Prisma.SubscriptionUpdateManyArgs>()({
        where: {
          botId,
          userIsBanned: true,
        },
        data: {
          userIsBanned: false,
        },
      });
      return prisma.subscription.updateMany<T & typeof query>(
        _.merge(query, args)
      );
    },

    botStats: <T extends Prisma.SubscriptionCountArgs>(
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.SubscriptionCountArgs>
    ) => {
      const query: Prisma.SubscriptionCountArgs = {
        where: {
          botId,
        },
      };
      return prisma.bot.count(_.merge(query, args));
    },
  });
