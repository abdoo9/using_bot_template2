import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.message, {
    findByMessageIdAndSourceIdAndBotId: (
      messageId: number,
      sourceId: number,
      botId: number,
      args?: Prisma.MessageFindUniqueArgs
    ) => {
      const query = {
        where: {
          sourceId,
          messageId,
          botId,
        },
      };

      return prisma.message.findUnique(_.merge(query, args));
    },

    createMessage: <T extends PartialDeep<Prisma.MessageCreateArgs>>(
      messageId: number,
      sourceId: number,
      destId: number,
      botId: number,

      args: Prisma.SelectSubset<T, Prisma.MessageCreateArgs>
    ) => {
      const query: Prisma.MessageCreateArgs = {
        data: {
          messageId,
          sourceId,
          destId,
          botId,
        },
      };

      return prisma.message.create(_.merge(query, args));
    },

    // updateByMessageIdAndSourceId: <
    //   T extends PartialDeep<Prisma.MessageUpdateArgs>
    // >(
    //   messageId: number,
    //   sourceId: number,
    //   args: Prisma.SelectSubset<T, Prisma.MessageUpdateArgs>
    // ) => {
    //   const query: Prisma.MessageUpdateArgs = {
    //     where: {
    //       messageId,
    //       sourceId,
    //     },
    //     data: {},
    //   };

    //   return prisma.message.update(_.merge(query, args));
    // },
  });
