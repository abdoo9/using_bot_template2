import { Composer } from "grammy";
import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { chatsService, botsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer;

feature
  .chatType("group")
  .on(
    ":migrate_to_chat_id",
    logHandle("chat group migrated migrate_to_chat_id"),
    async (ctx) => {
      await chatsService.deleteChat(ctx.message.migrate_to_chat_id); // first update will appear as the bot is being added to the group then the migrate update comes
      await chatsService.migrateChat(
        ctx.message.chat.id,
        ctx.message.migrate_to_chat_id,
        ctx.message.chat
      );
    }
  );
// feature
//   .chatType("group")
//   .on(
//     ":migrate_to_chat_id",
//     logHandle("chat group migrated migrate_to_chat_id"),
//     async (ctx) => {
//       return botsService.migrateChat(
//         ctx.me.id,
//         ctx.message.chat.id,
//         ctx.message.migrate_to_chat_id,
//         ctx.message.chat
//       );
//     }
//   );
feature
  .chatType(["group", "supergroup", "channel"])
  .on(
    [
      "message:group_chat_created",
      "message:supergroup_chat_created",
      "message:new_chat_members:me",
      "message:new_chat_title",
      "my_chat_member",
    ],
    logHandle("upsert bot adminstrator status"),
    async (ctx, next) => {
      const canInviteUsers =
        ctx.myChatMember?.new_chat_member.status === "administrator"
          ? ctx.myChatMember?.new_chat_member.can_invite_users
          : false;

      if (canInviteUsers) {
        setTimeout(async () => {
          const adminstrators = await ctx.getChatAdministrators();
          adminstrators
            .filter((user) => !user.user.is_bot)
            .forEach(async (user) => {
              await chatsService.upsertChatMemberMsg(
                ctx.chat,
                user.user,
                user.status
              );
            });
        }, 2000); // for some reason getChatAdministrators doesn't work instantly when the bot is newly added to a channel
      }

      await botsService.upsertBotChats(
        ctx.me.id,
        ctx.chat,
        ctx.myChatMember?.new_chat_member.status,
        canInviteUsers
      );
      next();
    }
  );
// feature.on(
//   ["my_chat_member"],
//   logHandle("bot have been promoted or removed from admins"),
//   async (ctx) => {
//     const canInviteUsers =
//       ctx.myChatMember.new_chat_member.status === "administrator"
//         ? ctx.myChatMember.new_chat_member.can_invite_users
//         : undefined;

//     await botChatsService.upsertBotChats(ctx.me.id, ctx.chat.id, {
//       create: {
//         status: ctx.myChatMember.new_chat_member.status,
//         canInviteUsers,
//       },
//       update: {
//         status: ctx.myChatMember.new_chat_member.status,
//         canInviteUsers,
//       },
//     });
//   }
// );
/*
update_id: 384056837
message: {
  "message_id": 1,
  "from": {
    "id": 1087968824,
    "is_bot": true,
    "first_name": "Group",
    "username": "GroupAnonymousBot"
  },
  "sender_chat": {
    "id": -1001838454889,
    "title": "mmlmlm",
    "type": "supergroup"
  },
  "chat": {
    "id": -1001838454889,
    "title": "mmlmlm",
    "type": "supergroup"
  },
  "date": 1671743391,
  "migrate_from_chat_id": -802390706
}
*/
