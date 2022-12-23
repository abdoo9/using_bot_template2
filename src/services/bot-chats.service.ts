// import _ from "lodash";
// import { Prisma, PrismaClient } from "@prisma/client";
// import type { PartialDeep } from "type-fest";

// export const createService = (prisma: PrismaClient) =>
//   Object.assign(prisma.botChats, {
//     upsertBotChats: <T extends PartialDeep<Prisma.BotChatsArgs>>(
//       botId: number,
//       chatId: number,
//       // status?: string,
//       // canInviteUsers?: boolean,
//       args?: Prisma.SelectSubset<T, Prisma.BotChatsUpsertArgs>,
//     ) => {
//       const query = {
//         where: {
//           botId_chatId: {
//             botId,
//             chatId,
//           },
//         },
//         create: {
//           botId,
//           chatId,

//           // status,
//           // canInviteUsers,
//         },
//         update: {
//           botId,
//           chatId,
//           // status,
//           // canInviteUsers,
//         },
//       } satisfies Prisma.BotChatsUpsertArgs;

//       return prisma.botChats.upsert(_.merge(query, args));
//     },
//   });

// const x = {
//   update_id: 384056789,
//   my_chat_member: {
//     chat: {
//       id: -1001265242330,
//       title: "ADMIN GROUP",
//       type: "supergroup",
//     },
//     from: {
//       id: 527340500,
//       is_bot: false,
//       first_name: "Abd < _",
//       username: "abdood",
//       language_code: "en",
//       is_premium: true,
//     },
//     date: 1671664302,
//     old_chat_member: {
//       user: {
//         id: 5737905706,
//         is_bot: true,
//         first_name: "Kahoot",
//         username: "khootBot",
//       },
//       status: "member",
//     },
//     new_chat_member: {
//       user: {
//         id: 5737905706,
//         is_bot: true,
//         first_name: "Kahoot",
//         username: "khootBot",
//       },
//       status: "administrator",
//       can_be_edited: false,
//       can_manage_chat: true,
//       can_change_info: true,
//       can_delete_messages: true,
//       can_invite_users: true,
//       can_restrict_members: true,
//       can_pin_messages: true,
//       can_manage_topics: false,
//       can_promote_members: false,
//       can_manage_video_chats: true,
//       is_anonymous: false,
//       can_manage_voice_chats: true,
//     },
//   },
// };
