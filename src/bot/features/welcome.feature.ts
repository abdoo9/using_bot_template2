import { Composer } from "grammy";

import { Context } from "~/bot/types";
import { logHandle } from "~/bot/helpers/logging";

export const composer = new Composer<Context>();

const feature = composer.chatType("private");

feature.filter(
  (ctx) => {
    return (
      (!!ctx.update.message?.text &&
        ctx.local.bot?.replies
          ?.map((reply) => reply.trigger)
          .includes(ctx.update.message?.text)) ||
      false
    );
  },
  async (ctx, next) => {
    const replyMessageInfo = ctx.local.bot?.replies.filter(
      (r) => r.trigger === ctx.update.message?.text
    )[0];
    const reply = replyMessageInfo
      ? ctx.api.copyMessage(
          ctx.chat.id,
          Number(replyMessageInfo?.chatId),
          replyMessageInfo?.messageId
        )
      : ctx.reply(ctx.t("something_went_wrong.reply_message_not_fonud_in_db"));
    reply.catch((err) => {
      if (
        err.message ===
        "Call to 'copyMessage' failed! (400: Bad Request: message to copy not found)"
      ) {
        next();
      }
    });
  }
);

feature.hears("/start", logHandle("handle /start"), async (ctx) => {
  await ctx.replyWithChatAction("typing");
  await ctx.reply("hello");
});

// feature.on("message:text", async (ctx) => {
//   await ctx.replyWithChatAction("typing");
// });
