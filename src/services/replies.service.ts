import _ from "lodash";
import { Prisma, PrismaClient } from "@prisma/client";
import { PartialDeep } from "type-fest";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.reply, {
    upsertReply: <T extends Prisma.ReplyArgs>(
      botId: number,
      trigger: string,
      messageId: number,
      chatId: number,
      args: PartialDeep<Pick<Prisma.ReplyUpsertArgs, "create" | "update">>,
      select?: Prisma.SelectSubset<T, Prisma.ReplyArgs>
    ) => {
      const query = {
        where: {
          reply_pkey: { botId, trigger },
        },
        create: {
          botId,
          trigger,
          messageId,
          chatId,
        },
        update: {
          messageId,
          chatId,
        },
      } satisfies Prisma.ReplyUpsertArgs;

      return prisma.reply.upsert<T & typeof query>(
        _.merge(query, args, select)
      );
    },
  });
