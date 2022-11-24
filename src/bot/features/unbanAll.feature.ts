import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { subscriptionsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");
feature.command(
  "unbanAll",
  logHandle("handle /unbanAll"),
  async (ctx, next) => {
    const groupId = Number(ctx.local.bot?.ownerId);
    if (!(groupId === ctx.chat.id) || (groupId && !(groupId === ctx.chat.id)))
      return next();

    await ctx.replyWithChatAction("typing");

    const count = await subscriptionsService.unbanAll(ctx.me.id);
    await ctx.reply(ctx.t("unbanAll.all_users_unbanned", count));
  }
);
