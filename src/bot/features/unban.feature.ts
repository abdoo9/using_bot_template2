import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, messagesService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");
feature.command("unban", logHandle("handle /unban"), async (ctx, next) => {
  const groupId = Number(ctx.local.bot?.ownerId);
  if (!(groupId === ctx.chat.id) || (groupId && !(groupId === ctx.chat.id)))
    return next();

  await ctx.replyWithChatAction("typing");

  if (!ctx.message.reply_to_message) {
    await ctx.reply(ctx.t("unban.how_to_use"));
  } else {
    const replyToMessage =
      await messagesService.findByDestMessageIdAndDestIdAndBotId(
        ctx.message.reply_to_message.message_id,
        ctx.message.reply_to_message.chat.id,
        ctx.me.id
      );

    const { sourceId } = replyToMessage[0];
    await botsService.unbanUser(ctx.me.id, Number(sourceId), {});
    await ctx.reply(ctx.t("unban.user_unbanned_successfully"));
  }
});
