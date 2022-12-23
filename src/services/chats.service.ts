import _ from "lodash";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { PartialDeep } from "type-fest";
import { Chat } from "grammy/types";

export const createService = (prisma: PrismaClient) =>
  Object.assign(prisma.user, {
    migrateChat: <T extends Prisma.ChatArgs>(
      migrateFromChatId: number,
      migrateToChatId: number,
      chat:
        | (Chat.GroupChat & {
            type: "group" | "supergroup";
          })
        | (Chat.SupergroupChat & {
            type: "group" | "supergroup";
          }),
      args?: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
        where: {
          chatId: migrateFromChatId,
        },
        data: {
          chatId: migrateToChatId,
          type: "supergroup", // chat is the old chat so chat.type is group
          title: chat.title,
        },
      } satisfies Prisma.ChatUpdateArgs;

      return prisma.chat.update<T & typeof query>(_.merge(query, args, select));
    },
    deleteChat: <T extends Prisma.ChatArgs>(
      migrateToChatId: number,
      args?: Prisma.SelectSubset<T, Prisma.ChatDeleteArgs>,
      select?: Prisma.SelectSubset<T, Prisma.ChatArgs>
    ) => {
      const query = {
        where: {
          chatId: migrateToChatId,
        },
      } satisfies Prisma.ChatDeleteArgs;

      return prisma.chat.delete<T & typeof query>(_.merge(query, args, select));
    },
    disconnectAdminsGroup: <T extends Prisma.ChatArgs>(
      chatId: number,
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.ChatUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.ChatArgs>
    ) => {
      const query = {
        where: {
          chatId,
        },
        data: {
          Bots: {
            disconnect: {
              botId,
            },
          },
        },
      } satisfies Prisma.ChatUpdateArgs;

      return prisma.chat.update<T & typeof query>(_.merge(query, args, select));
    },
  });
