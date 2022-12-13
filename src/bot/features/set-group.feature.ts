import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.filter(
  (ctx) => Number(ctx.local.bot?.ownerId) === ctx.from?.id
);

feature
  .chatType(["group", "supergroup"])
  .command(["set_group", "sg"], logHandle("handle /set_group"), async (ctx) => {
    await ctx.replyWithChatAction("typing");
    await botsService.updateGroupId(ctx.me.id, ctx.chat.id);
    await ctx.reply(
      ctx.t(`set_group.group_set_successfully`, { title: ctx.chat.title })
    );
  });

feature
  .chatType(["group", "supergroup"])
  .on(
    [
      "message:group_chat_created",
      "message:supergroup_chat_created",
      "message:new_chat_members:me",
      "message:migrate_to_chat_id",
    ],
    logHandle("bot added to a group by admin"),
    async (ctx) => {
      await botsService.updateGroupId(ctx.me.id, ctx.chat.id);
      await ctx.reply(
        ctx.t(`set_group.group_set_successfully`, { title: ctx.chat.title })
      );
    }
  );
