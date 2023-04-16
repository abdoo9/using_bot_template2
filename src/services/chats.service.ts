import _ from "lodash";
import type { Prisma, PrismaClient, Status } from "@prisma/client";
import { Chat, ChatMemberUpdated, User } from "grammy/types";

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
    upsertChatMember: <T extends Prisma.ChatArgs>(
      chatMember: ChatMemberUpdated,
      args?: Prisma.SelectSubset<T, Prisma.ChatUpsertArgs>,
      select?: Prisma.SelectSubset<T, Prisma.ChatArgs>
    ) => {
      const query = {
        where: {
          chatId: chatMember.chat.id,
        },
        create: {
          chatId: chatMember.chat.id,
          type: chatMember.chat.type,
          members: {
            connectOrCreate: {
              where: {
                userId_chatId: {
                  chatId: chatMember.chat.id,
                  userId: chatMember.new_chat_member.user.id,
                },
              },
              create: {
                userId: chatMember.new_chat_member.user.id,
                status: chatMember.new_chat_member.status,
              },
            },
          },
        },
        update: {
          chatId: chatMember.chat.id,
          type: chatMember.chat.type,
          members: {
            connectOrCreate: {
              where: {
                userId_chatId: {
                  chatId: chatMember.chat.id,
                  userId: chatMember.new_chat_member.user.id,
                },
              },
              create: {
                userId: chatMember.new_chat_member.user.id,
                status: chatMember.new_chat_member.status,
              },
            },
            update: {
              where: {
                userId_chatId: {
                  chatId: chatMember.chat.id,
                  userId: chatMember.new_chat_member.user.id,
                },
              },
              data: {
                status: chatMember.new_chat_member.status,
              },
            },
          },
        },
      } satisfies Prisma.ChatUpsertArgs;

      return prisma.chat.upsert<T & typeof query>(_.merge(query, args, select));
    },
    upsertChatMemberMsg: <T extends Prisma.ChatArgs>(
      chat:
        | (Chat.GroupChat & {
            type: "channel" | "group" | "supergroup";
          })
        | (Chat.SupergroupChat & {
            type: "channel" | "group" | "supergroup";
          })
        | (Chat.ChannelChat & {
            type: "channel" | "group" | "supergroup";
          }),

      user: User,
      status: Status,
      args?: Prisma.SelectSubset<T, Prisma.ChatUpsertArgs>,
      select?: Prisma.SelectSubset<T, Prisma.ChatArgs>
    ) => {
      const query = {
        where: {
          chatId: chat.id,
        },
        create: {
          chatId: chat.id,
          type: chat.type,
          members: {
            connectOrCreate: {
              where: {
                userId_chatId: {
                  chatId: chat.id,
                  userId: user.id,
                },
              },
              create: {
                userId: user.id,
                status,
              },
            },
          },
        },
        update: {
          chatId: chat.id,
          type: chat.type,
          members: {
            connectOrCreate: {
              where: {
                userId_chatId: {
                  chatId: chat.id,
                  userId: user.id,
                },
              },
              create: {
                userId: user.id,
                status,
              },
            },
            update: {
              where: {
                userId_chatId: {
                  chatId: chat.id,
                  userId: user.id,
                },
              },
              data: {
                status,
              },
            },
          },
        },
      } satisfies Prisma.ChatUpsertArgs;

      return prisma.chat.upsert<T & typeof query>(_.merge(query, args, select));
    },
  });
