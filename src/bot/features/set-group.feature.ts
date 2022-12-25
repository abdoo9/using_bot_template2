import { Composer, matchFilter } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, chatsService } from "~/services/index";
import { escapeHTML } from "~/bot/helpers/escape-html";

export const composer = new Composer<Context>();
const feature = composer.chatType(["group", "supergroup"]);

feature.command(
  ["set_group", "sg"],
  logHandle("handle /set_group"),
  async (ctx) => {
    ctx.replyWithChatAction("typing");
    await botsService.updateGroupId(ctx.me.id, ctx.chat.id);
    await ctx.reply(
      ctx.t(`set_group.group_set_successfully`, {
        title: escapeHTML(ctx.chat.title),
      })
    );
  }
);
// feature
// .chatType(["group", "supergroup"])
// .on(
//   ["message:migrate_to_chat_id"],
//   logHandle("bot added to a group by admin"),
//   async (ctx) => {
//     await botsService.updateGroupId(ctx.me.id, ctx.chat.id);
//     await ctx.reply(
//       ctx.t(`set_group.group_set_successfully`, { title: ctx.chat.title })
//     );
//   }
// );

feature.on(
  [
    "message:group_chat_created",
    "message:supergroup_chat_created",
    "message:new_chat_members:me",
  ],
  logHandle("bot added to a group by admin"),
  async (ctx) => {
    await botsService.updateGroupId(ctx.me.id, ctx.chat.id);
    await ctx.reply(
      ctx.t(`set_group.group_set_successfully`, {
        title: escapeHTML(ctx.chat.title),
      })
    );
  }
);

feature
  .filter((ctx) => Number(ctx.local.bot?.groupId) === ctx.message?.chat.id)
  .filter(matchFilter(":left_chat_member:me"))
  .use(logHandle("handle bot left admins group"), async (ctx) => {
    if (typeof Number(ctx.local.bot?.groupId) === "number")
      await chatsService.disconnectAdminsGroup(
        Number(ctx.local.bot?.groupId),
        ctx.me.id
      );
  });

feature
  .on("my_chat_member")
  .filter(
    (ctx) =>
      Number(ctx.local.bot?.groupId) === ctx.update.my_chat_member.chat.id &&
      ctx.update.my_chat_member.new_chat_member.status === "restricted" &&
      ctx.update.my_chat_member.new_chat_member.is_member === true &&
      ctx.update.my_chat_member.new_chat_member.can_send_messages === false
  )
  .use(
    logHandle("handle bot is restricted from sending messages in adminsGroup"),
    async (ctx) => {
      const title = escapeHTML(ctx.update.my_chat_member.chat.title);
      const firstName = escapeHTML(ctx.update.my_chat_member.from.first_name);
      ctx.leaveChat();
      ctx.api.sendMessage(
        Number(ctx.local.bot?.ownerId),
        ctx.t("set_group.bot_restricted_from_adminsGroup", {
          title,
          firstName,
        })
      );
    }
  );
