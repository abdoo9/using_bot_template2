import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { subscriptionsService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer;
feature
  .filter((ctx) => ctx.from?.id === Number(ctx.local.bot?.ownerId))
  .hears(
    /^\/unbanall(@[a-zA-Z][\w_]{0,39}bot)?$/i,
    logHandle("handle /unbanAll"),
    async (ctx) => {
      ctx.replyWithChatAction("typing");

      const count = await subscriptionsService.unbanAll(ctx.me.id);
      await ctx.reply(ctx.t("unbanAll.all_users_unbanned", count));
    }
  );

feature.command(
  "unbanAll",
  logHandle("handle /unbanAll sent by not owner"),
  async (ctx) => {
    ctx.replyWithChatAction("typing");
    await ctx.reply(ctx.t("unbanAll.can_be_used_by_owner_only"));
  }
);
