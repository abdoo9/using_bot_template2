import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";
import { botsService, messagesService } from "~/services/index";

export const composer = new Composer<Context>();

const feature = composer;

feature
  .chatType(["group", "supergroup"])
  .filter((ctx) => !!ctx.message?.reply_to_message)
  .command(
    ["unban", "uban", "ub"],
    logHandle("handle /unban reply command in adminsgroup"),
    async (ctx, next) => {
      const groupId = Number(ctx.local.bot?.groupId);
      if (groupId !== ctx.chat.id) return next();

      await ctx.replyWithChatAction("typing");

      const replyToMessage =
        await messagesService.findByDestMessageIdAndDestIdAndBotId(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx.message!.reply_to_message!.message_id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx.message!.reply_to_message!.chat.id,
          ctx.me.id
        );
      if (!replyToMessage[0])
        return ctx.reply(ctx.t(`unban.message_not_found`));

      const { sourceId } = replyToMessage[0];
      await botsService.unbanUser(ctx.me.id, Number(sourceId), {});
      await ctx.reply(ctx.t("unban.user_unbanned_successfully"));
    }
  );

feature
  .chatType("private")
  .filter(
    (ctx) =>
      !!ctx.message?.reply_to_message &&
      ctx.from?.id === Number(ctx.local.bot?.ownerId)
  )
  .command(
    ["unban", "uban", "ub"],
    logHandle("handle /unban reply command in owner private"),
    async (ctx) => {
      await ctx.replyWithChatAction("typing");

      const replyToMessage =
        await messagesService.findByDestMessageIdAndDestIdAndBotId(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx.message!.reply_to_message!.message_id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ctx.message!.reply_to_message!.chat.id,
          ctx.me.id
        );
      if (!replyToMessage[0])
        return ctx.reply(ctx.t(`unban.message_not_found`));

      const { sourceId } = replyToMessage[0];
      await botsService.unbanUser(ctx.me.id, Number(sourceId), {});
      await ctx.reply(ctx.t("unban.user_unbanned_successfully"));
      // }
    }
  );

feature
  .drop((ctx) => !!ctx.message?.reply_to_message)
  .filter(
    (ctx) =>
      ctx.from?.id === Number(ctx.local.bot?.ownerId) ||
      ctx.from?.id === Number(ctx.local.bot?.groupId)
  )
  .command(
    ["unban", "uban", "ub"],
    logHandle("handle /unban command send without reply_to_message"),
    async (ctx) => {
      await ctx.replyWithChatAction("typing");
      await ctx.reply(ctx.t("unban.how_to_use"));
    }
  );
