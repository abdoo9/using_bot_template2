import _ from "lodash";
import { Prisma, PrismaClient, Status } from "@prisma/client";
import type { PartialDeep } from "type-fest";
import { Chat } from "grammy/types";

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

    makeBotNotActive: <T extends Prisma.BotArgs>(
      botId: number,
      args?: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
        where: {
          botId,
        },
        data: {
          active: {
            set: false,
          },
        },
      } satisfies Prisma.BotUpdateArgs;

      return prisma.bot.update<T & typeof query>(_.merge(query, args, select));
    },
    upsertBotChats: <T extends Prisma.BotArgs>(
      botId: number,
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
      status:
        | "member"
        | "creator"
        | "administrator"
        | "restricted"
        | "left"
        | "kicked"
        | undefined,
      canInviteUsers: boolean,
      args?: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
        where: {
          botId,
        },
        data: {
          botChats: {
            upsert: {
              where: {
                botId_chatId: {
                  botId,
                  chatId: chat.id,
                },
              },
              create: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: chat.id,
                    },
                    create: {
                      chatId: chat.id,
                      type: chat.type,
                      title: chat.title,
                    },
                  },
                },
                status,
                canInviteUsers,
              },
              update: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: chat.id,
                    },
                    create: {
                      chatId: chat.id,
                      type: chat.type,
                      title: chat.title,
                    },
                  },
                },
                status,
                canInviteUsers,
              },
            },
          },
        },
      } satisfies Prisma.BotUpdateArgs;

      return prisma.bot.update<T & typeof query>(_.merge(query, args, select));
    },
    migrateChat: <T extends Prisma.BotArgs>(
      botId: number,
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
          botId,
        },
        data: {
          botChats: {
            upsert: {
              where: {
                botId_chatId: {
                  botId,
                  chatId: migrateFromChatId,
                },
              },
              create: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: migrateToChatId,
                    },
                    create: {
                      chatId: migrateToChatId,
                      type: "supergroup",
                      title: chat.title,
                    },
                  },
                },
              },
              update: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: migrateFromChatId,
                    },
                    create: {
                      chatId: migrateToChatId,
                      type: "supergroup",
                      title: chat.title,
                    },
                  },
                },
              },
            },
          },
        },
      } satisfies Prisma.BotUpdateArgs;

      return prisma.bot.update<T & typeof query>(_.merge(query, args, select));
    },

    findBotChannels: (
      botId: number
      // args?: Prisma.SelectSubset<T, Prisma.BotFindFirstArgs>
      // select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      // const query = {
      //   where: {
      //     botId,
      //   },
      //   select: {
      //     botChats: {
      //       where: {

      //       },
      //       include: {
      //         chat: true,
      //       },
      //     },
      //   },
      // } satisfies Prisma.BotFindUniqueArgs;

      return prisma.bot.findUnique({
        where: {
          botId,
        },
        select: {
          botChats: {
            where: {
              AND: {
                status: "administrator",
                chat: {
                  type: "channel",
                },
              },
            },
            include: {
              chat: true,
            },
          },
        },
      }); // _.merge(query));
    },

    findBotGroups: (botId: number) => {
      return prisma.bot.findUnique({
        where: {
          botId,
        },
        select: {
          botChats: {
            where: {
              AND: {
                status: "administrator",
                chat: {
                  OR: {
                    type: {
                      in: ["group", "supergroup"],
                    },
                  },
                },
              },
            },
            include: {
              chat: true,
            },
          },
        },
      }); // _.merge(query));
    },
    findBotFsubChats: (botId: number, userId: number) => {
      return prisma.bot.findUnique({
        where: {
          botId,
        },
        select: {
          botChats: {
            where: {
              status: "administrator",
              forceSub: true,
              chat: {
                AND: {
                  members: {
                    none: {
                      userId,
                    },
                  },
                },
              },
            },
            select: {
              chat: true,
            },
            take: 1,
          },
        },
      }); // _.merge(query));
    },

    updateForceSub: (botId: number, chatId: number, forceSub: boolean) => {
      return prisma.bot.update({
        where: {
          botId,
        },
        data: {
          botChats: {
            update: {
              where: {
                botId_chatId: {
                  botId,
                  chatId,
                },
              },
              data: {
                forceSub,
              },
            },
          },
        },
      });
    },
    updateBotChatStatus: (botId: number, chatId: number, status: Status) => {
      return prisma.bot.update({
        where: {
          botId,
        },
        data: {
          botChats: {
            update: {
              where: {
                botId_chatId: {
                  botId,
                  chatId,
                },
              },
              data: {
                status,
              },
            },
          },
        },
      });
    },
    botForceSub: (botId: number, chatId: number) => {
      return prisma.bot.findUnique({
        where: {
          botId,
        },
        select: {
          botChats: {
            where: {
              botId,
              chatId,
            },
            select: {
              forceSub: true,
            },
          },
        },
      });
    },
    upsertChatMember: <T extends Prisma.BotArgs>(
      botId: number,
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
      status: Status,
      canInviteUsers: boolean,
      args?: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
      select?: Prisma.SelectSubset<T, Prisma.BotArgs>
    ) => {
      const query = {
        where: {
          botId,
        },
        data: {
          botChats: {
            upsert: {
              where: {
                botId_chatId: {
                  botId,
                  chatId: chat.id,
                },
              },
              create: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: chat.id,
                    },
                    create: {
                      chatId: chat.id,
                      type: chat.type,
                      title: chat.title,
                    },
                  },
                },
                status,
                canInviteUsers,
              },
              update: {
                chat: {
                  connectOrCreate: {
                    where: {
                      chatId: chat.id,
                    },
                    create: {
                      chatId: chat.id,
                      type: chat.type,
                      title: chat.title,
                    },
                  },
                },
                status,
                canInviteUsers,
              },
            },
          },
        },
      } satisfies Prisma.BotUpdateArgs;

      return prisma.bot.update<T & typeof query>(_.merge(query, args, select));
    },
  });
