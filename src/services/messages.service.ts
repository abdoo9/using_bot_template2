import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.message, {
    findBySourceMessageIdAndSourceIdAndBotId: <
      T extends PartialDeep<Prisma.MessageFindManyArgs>
    >(
      sourceMessageId: number,
      sourceId: number,
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.MessageFindManyArgs>
    ) => {
      const query: Prisma.MessageFindManyArgs = {
        where: {
          sourceId,
          sourceMessageId,
          botId,
        },
      };

      return prisma.message.findMany(_.merge(query, args));
    },
    findByDestMessageIdAndDestIdAndBotId: <
      T extends PartialDeep<Prisma.MessageFindManyArgs>
    >(
      destMessageId: number,
      destId: number,
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.MessageFindManyArgs>
    ) => {
      const query: Prisma.MessageFindManyArgs = {
        where: {
          destId,
          destMessageId,
          botId,
        },
      };
      return prisma.message.findMany(_.merge(query, args));
    },

    createMessage: <T extends PartialDeep<Prisma.MessageCreateArgs>>(
      sourceMessageId: number,
      destMessageId: number,
      sourceId: number,
      destId: number,
      botId: number,
      text: string,
      args: Prisma.SelectSubset<T, Prisma.MessageCreateArgs>
    ) => {
      const query: Prisma.MessageCreateArgs = {
        data: { sourceMessageId, destMessageId, sourceId, destId, botId, text },
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