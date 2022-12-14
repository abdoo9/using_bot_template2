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
    "ban",
    logHandle("handle /ban reply command in adminsgroup"),
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

      const { sourceId } = replyToMessage[0];
      await botsService.banUser(ctx.me.id, Number(sourceId), {});
      await ctx.reply(ctx.t("ban.user_banned_successfully"));
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
    "ban",
    logHandle("handle /ban reply command in owner private"),
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

      const { sourceId } = replyToMessage[0];
      await botsService.banUser(ctx.me.id, Number(sourceId), {});
      await ctx.reply(ctx.t("ban.user_banned_successfully"));
      // }
    }
  );

feature
  .drop((ctx) => !!ctx.message?.reply_to_message)
  .command(
    "ban",
    logHandle("handle /ban command send without reply_to_message"),
    async (ctx) => {
      await ctx.replyWithChatAction("typing");
      await ctx.reply(ctx.t("ban.how_to_use"));
    }
  );
